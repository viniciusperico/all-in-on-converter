
'use client';

import { useState, useEffect } from 'react';
import usePersistentState from '@/hooks/use-persistent-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/language-context';

// --- Tip Calculator ---
type TipState = {
  bill: string;
  tipPercent: string;
  people: string;
};
type TipResult = {
  tipAmount: number;
  total: number;
  perPerson: number;
} | null;

// --- Loan Calculator ---
type LoanState = {
  amount: string;
  rate: string;
  term: string;
};
type LoanResult = {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
} | null;


// --- Interest Calculator ---
type InterestState = {
  principal: string;
  rate: string;
  time: string;
  compoundsPerYear: string;
};
type InterestResult = {
  interest: number;
  total: number;
} | null;

/**
 * Componente para cálculos financeiros.
 * Permite ao usuário calcular juros, empréstimos, gorjetas e mais.
 */
export function FinancialConverter() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('interest');

  // --- Interest State & Logic ---
  const [interestState, setInterestState, isInterestMounted] = usePersistentState<InterestState>('financialState', {
    principal: '1000',
    rate: '5',
    time: '10',
    compoundsPerYear: '12',
  });
  const [interestResult, setInterestResult] = useState<InterestResult>(null);
  const [interestType, setInterestType] = useState('simple');

  const handleInterestCalc = () => {
    const p = parseFloat(interestState.principal);
    const r = parseFloat(interestState.rate) / 100;
    const t = parseFloat(interestState.time);
    const n = parseInt(interestState.compoundsPerYear);
    if (isNaN(p) || isNaN(r) || isNaN(t)) return;
    
    if (interestType === 'simple') {
      const interest = p * r * t;
      setInterestResult({ interest, total: p + interest });
    } else {
      if (isNaN(n)) return;
      const total = p * Math.pow(1 + r / n, n * t);
      setInterestResult({ interest: total - p, total });
    }
  };

  // --- Tip State & Logic ---
  const [tipState, setTipState, isTipMounted] = usePersistentState<TipState>('tipState', {
    bill: '50',
    tipPercent: '15',
    people: '1',
  });
  const [tipResult, setTipResult] = useState<TipResult>(null);

  const handleTipCalc = () => {
    const bill = parseFloat(tipState.bill);
    const tipPercent = parseFloat(tipState.tipPercent);
    const people = parseInt(tipState.people);
    if (isNaN(bill) || isNaN(tipPercent) || isNaN(people) || people < 1) return;
    const tipAmount = bill * (tipPercent / 100);
    const total = bill + tipAmount;
    setTipResult({ tipAmount, total, perPerson: total / people });
  };
  
  // --- Loan State & Logic ---
  const [loanState, setLoanState, isLoanMounted] = usePersistentState<LoanState>('loanState', {
    amount: '200000',
    rate: '6',
    term: '30',
  });
  const [loanResult, setLoanResult] = useState<LoanResult>(null);

  const handleLoanCalc = () => {
    const p = parseFloat(loanState.amount); // Principal
    const r = parseFloat(loanState.rate) / 100 / 12; // Monthly interest rate
    const n = parseFloat(loanState.term) * 12; // Total number of payments
    if (isNaN(p) || isNaN(r) || isNaN(n)) return;

    const monthlyPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    setLoanResult({
      monthlyPayment,
      totalPayment,
      totalInterest: totalPayment - p,
    });
  };

  const handleInputChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, field: keyof T, value: string, resultSetter: (res: any) => void) => {
    setter(s => ({ ...s, [field]: value }));
    resultSetter(null);
  };

  if (!isInterestMounted || !isTipMounted || !isLoanMounted) {
    return <Skeleton className="h-[450px] w-full" />;
  }

  const formatNumber = (num: number) => num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });


  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('financialConverter')}</CardTitle>
        <CardDescription>{t('financialDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="interest">{t('interestCalculator')}</TabsTrigger>
            <TabsTrigger value="loan">{t('loanCalculator')}</TabsTrigger>
            <TabsTrigger value="tip">{t('tipCalculator')}</TabsTrigger>
          </TabsList>
          
          {/* Interest Calculator */}
          <TabsContent value="interest" className="mt-6">
            <Tabs value={interestType} onValueChange={setInterestType} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="simple">{t('simpleInterest')}</TabsTrigger>
                <TabsTrigger value="compound">{t('compoundInterest')}</TabsTrigger>
              </TabsList>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">{t('principalAmount')}</Label>
                  <Input id="principal" type="number" value={interestState.principal} onChange={e => handleInputChange(setInterestState, 'principal', e.target.value, setInterestResult)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">{t('annualInterestRate')}</Label>
                  <Input id="rate" type="number" value={interestState.rate} onChange={e => handleInputChange(setInterestState, 'rate', e.target.value, setInterestResult)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="time">{t('timeYears')}</Label>
                  <Input id="time" type="number" value={interestState.time} onChange={e => handleInputChange(setInterestState, 'time', e.target.value, setInterestResult)} />
                </div>
                 <TabsContent value="compound" className="space-y-4 !mt-0 md:col-span-2">
                   <div className="space-y-2">
                    <Label htmlFor="compounds">{t('compoundsPerYear')}</Label>
                    <Input id="compounds" type="number" value={interestState.compoundsPerYear} onChange={e => handleInputChange(setInterestState, 'compoundsPerYear', e.target.value, setInterestResult)} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
             <Button onClick={handleInterestCalc} className="w-full mt-6">{t('calculate')}</Button>
             {interestResult && (
               <div className="mt-6 space-y-4 rounded-lg bg-muted p-4 text-center">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <p className="text-sm text-muted-foreground">{t('totalInterest')}</p>
                     <p className="text-2xl font-bold text-primary">{formatNumber(interestResult.interest)}</p>
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground">{t('totalValue')}</p>
                     <p className="text-2xl font-bold text-primary">{formatNumber(interestResult.total)}</p>
                   </div>
                 </div>
               </div>
            )}
          </TabsContent>

          {/* Loan Calculator */}
          <TabsContent value="loan" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="loan-amount">{t('loanAmount')}</Label>
                    <Input id="loan-amount" type="number" value={loanState.amount} onChange={e => handleInputChange(setLoanState, 'amount', e.target.value, setLoanResult)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="loan-rate">{t('annualInterestRate')}</Label>
                    <Input id="loan-rate" type="number" value={loanState.rate} onChange={e => handleInputChange(setLoanState, 'rate', e.target.value, setLoanResult)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="loan-term">{t('loanTermYears')}</Label>
                    <Input id="loan-term" type="number" value={loanState.term} onChange={e => handleInputChange(setLoanState, 'term', e.target.value, setLoanResult)} />
                </div>
            </div>
             <Button onClick={handleLoanCalc} className="w-full mt-6">{t('calculate')}</Button>
             {loanResult && (
               <div className="mt-6 space-y-4 rounded-lg bg-muted p-4">
                 <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">{t('monthlyPayment')}</p>
                    <p className="text-3xl font-bold text-primary">{formatNumber(loanResult.monthlyPayment)}</p>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                   <div>
                     <p className="text-sm text-muted-foreground">{t('totalPayment')}</p>
                     <p className="text-lg font-semibold">{formatNumber(loanResult.totalPayment)}</p>
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground">{t('totalInterest')}</p>
                     <p className="text-lg font-semibold">{formatNumber(loanResult.totalInterest)}</p>
                   </div>
                 </div>
               </div>
            )}
          </TabsContent>

          {/* Tip Calculator */}
          <TabsContent value="tip" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bill-amount">{t('billAmount')}</Label>
                    <Input id="bill-amount" type="number" value={tipState.bill} onChange={e => handleInputChange(setTipState, 'bill', e.target.value, setTipResult)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tip-percent">{t('tipPercentage')}</Label>
                    <Input id="tip-percent" type="number" value={tipState.tipPercent} onChange={e => handleInputChange(setTipState, 'tipPercent', e.target.value, setTipResult)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="people">{t('numberOfPeople')}</Label>
                    <Input id="people" type="number" value={tipState.people} onChange={e => handleInputChange(setTipState, 'people', e.target.value, setTipResult)} />
                </div>
            </div>
             <Button onClick={handleTipCalc} className="w-full mt-6">{t('calculate')}</Button>
             {tipResult && (
               <div className="mt-6 space-y-4 rounded-lg bg-muted p-4">
                 <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">{t('totalPerPerson')}</p>
                    <p className="text-3xl font-bold text-primary">{formatNumber(tipResult.perPerson)}</p>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                   <div>
                     <p className="text-sm text-muted-foreground">{t('tipAmount')}</p>
                     <p className="text-lg font-semibold">{formatNumber(tipResult.tipAmount)}</p>
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground">{t('totalBill')}</p>
                     <p className="text-lg font-semibold">{formatNumber(tipResult.total)}</p>
                   </div>
                 </div>
               </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
