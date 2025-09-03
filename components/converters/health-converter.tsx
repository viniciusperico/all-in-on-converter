
'use client';

import { useState, useEffect } from 'react';
import usePersistentState from '@/hooks/use-persistent-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/contexts/language-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

/**
 * @typedef {object} HealthState
 * @property {string} height - A altura do usuário em centímetros.
 * @property {string} weight - O peso do usuário em quilogramas.
 * @property {string} age - A idade do usuário em anos.
 * @property {'male' | 'female'} gender - O gênero do usuário.
 */
type HealthState = {
  height: string;
  weight: string;
  age: string;
  gender: 'male' | 'female';
};

type BmiCategory = 'underweight' | 'normalWeight' | 'overweight' | 'obese';

/**
 * @typedef {object|null} ResultState
 * @property {object} [bmi] - O resultado do cálculo do IMC.
 * @property {number} bmi.value - O valor do IMC.
 * @property {BmiCategory} bmi.categoryKey - A chave da categoria do IMC.
 * @property {string} bmi.category - O nome traduzido da categoria.
 * @property {number} [calories] - O resultado do cálculo de calorias diárias.
 */
type ResultState = {
  bmi?: { value: number; categoryKey: BmiCategory; category: string };
  calories?: number;
} | null;

/**
 * Componente que renderiza a tabela de referência de IMC.
 * @param {object} props
 * @param {BmiCategory} props.highlightCategory - A categoria a ser destacada na tabela.
 */
function BmiReferenceTable({ highlightCategory }: { highlightCategory: BmiCategory }) {
  const { t } = useLanguage();

  const bmiData: { range: string; categoryKey: BmiCategory; category: string }[] = [
    { range: t('bmiRangeUnderweight'), categoryKey: 'underweight', category: t('underweight') },
    { range: t('bmiRangeNormal'), categoryKey: 'normalWeight', category: t('normalWeight') },
    { range: t('bmiRangeOverweight'), categoryKey: 'overweight', category: t('overweight') },
    { range: t('bmiRangeObese'), categoryKey: 'obese', category: t('obese') },
  ];

  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('bmiCategory')}</TableHead>
            <TableHead className="text-right">{t('bmiRange')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bmiData.map((row) => (
            <TableRow
              key={row.categoryKey}
              className={cn(
                row.categoryKey === highlightCategory ? 'bg-primary/20' : ''
              )}
            >
              <TableCell className="font-medium">{row.category}</TableCell>
              <TableCell className="text-right">{row.range}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


/**
 * Componente para cálculos de saúde.
 * Permite ao usuário calcular seu Índice de Massa Corporal (IMC) e sua
 * necessidade diária de calorias (Taxa Metabólica Basal).
 */
export function HealthConverter() {
  const { t } = useLanguage();
  const [state, setState, isMounted] = usePersistentState<HealthState>('healthState', {
    height: '180',
    weight: '75',
    age: '30',
    gender: 'male',
  });
  const [activeTab, setActiveTab] = useState('bmi');
  const [result, setResult] = useState<ResultState>(null);
  
  /**
   * Retorna a chave da categoria do IMC com base em seu valor.
   * @param {number} bmi - O valor do Índice de Massa Corporal.
   * @returns {BmiCategory} A chave da categoria correspondente.
   */
  const getBmiCategoryKey = (bmi: number): BmiCategory => {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 24.9) return 'normalWeight';
    if (bmi < 29.9) return 'overweight';
    return 'obese';
  };

  /**
   * Calcula o IMC ou as calorias diárias com base na aba ativa.
   */
  const calculate = () => {
    const h = parseFloat(state.height) / 100; // cm para m
    const w = parseFloat(state.weight);
    const age = parseInt(state.age);

    if (isNaN(h) || h <= 0 || isNaN(w) || w <= 0) return;
    

    if (activeTab === 'bmi') {
      const bmi = w / (h * h);
      const categoryKey = getBmiCategoryKey(bmi);
      setResult({ bmi: { value: bmi, categoryKey: categoryKey, category: t(categoryKey) } });
    } else {
       if (isNaN(age) || age <= 0) return;
       // Fórmula de Harris-Benedict (revisada) para Taxa Metabólica Basal (TMB)
       const bmr = 10 * w + 6.25 * (h * 100) - 5 * age + (state.gender === 'male' ? 5 : -161);
       // Multiplica por um fator de atividade (1.2 para sedentário)
       setResult({ calories: Math.round(bmr * 1.2) });
    }
  };
  
  /**
   * Atualiza o estado de um campo de entrada e limpa o resultado anterior.
   * @param {keyof Omit<HealthState, 'gender'>} field - O campo a ser atualizado.
   * @param {string} value - O novo valor para o campo.
   */
  const handleInputChange = (field: keyof Omit<HealthState, 'gender'>, value: string) => {
    setState(s => ({ ...s, [field]: value }));
    setResult(null);
  };

  if (!isMounted) {
    return <Skeleton className="h-[480px] w-full" />;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('healthConverter')}</CardTitle>
        <CardDescription>{t('healthDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setResult(null); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bmi">{t('bmiCalculator')}</TabsTrigger>
            <TabsTrigger value="calories">{t('calorieCalculator')}</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">{t('height')}</Label>
              <Input id="height" type="number" placeholder="180" value={state.height} onChange={e => handleInputChange('height', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weightKg">{t('weightKg')}</Label>
              <Input id="weight" type="number" placeholder="75" value={state.weight} onChange={e => handleInputChange('weight', e.target.value)} />
            </div>
            <TabsContent value="calories" className="!mt-0 sm:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">{t('age')}</Label>
                  <Input id="age" type="number" placeholder="30" value={state.age} onChange={e => handleInputChange('age', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('gender')}</Label>
                  <RadioGroup value={state.gender} onValueChange={(v: 'male' | 'female') => { setState(s => ({ ...s, gender: v })); setResult(null); }} className="flex items-center space-x-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="font-normal">{t('male')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="font-normal">{t('female')}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <Button onClick={calculate} className="w-full mt-6">{t('calculate')}</Button>
        
        {result && (
          <div className="mt-6 rounded-lg bg-muted p-4 text-center">
            {result.bmi && (
              <>
                <p className="text-sm text-muted-foreground">{t('yourBmi')}</p>
                <p className="text-3xl font-bold text-primary">{result.bmi.value.toFixed(1)}</p>
                <p className="font-medium text-primary">{result.bmi.category}</p>
                <BmiReferenceTable highlightCategory={result.bmi.categoryKey} />
              </>
            )}
            {result.calories && (
               <>
                <p className="text-sm text-muted-foreground">{t('estDailyCalories')}</p>
                <p className="text-3xl font-bold text-primary">{result.calories.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">{t('sedentaryLifestyle')}</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
