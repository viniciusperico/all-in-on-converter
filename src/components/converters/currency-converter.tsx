
'use client';

import { useState, useMemo } from 'react';
import usePersistentState from '@/hooks/use-persistent-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import { useInterstitialAd } from '@/contexts/interstitial-ad-context';
import { Label } from '../ui/label';

const currencies = [
    { value: 'USD', label: 'USD - Dólar Americano' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'BRL', label: 'BRL - Real Brasileiro' },
    { value: 'GBP', label: 'GBP - Libra Esterlina' },
    { value: 'JPY', label: 'JPY - Iene Japonês' },
    { value: 'CAD', label: 'CAD - Dólar Canadense' },
    { value: 'AUD', label: 'AUD - Dólar Australiano' },
    { value: 'CHF', label: 'CHF - Franco Suíço' },
    { value: 'CNY', label: 'CNY - Yuan Chinês' },
    { value: 'ARS', label: 'ARS - Peso Argentino' },
    { value: 'TRY', label: 'TRY - Nova Lira Turca' },
    { value: 'BTC', label: 'BTC - Bitcoin' },
    { value: 'ETH', label: 'ETH - Ethereum' },
    { value: 'LTC', label: 'LTC - Litecoin' },
    { value: 'DOGE', label: 'DOGE - Dogecoin' },
];

/**
 * @typedef {object} CurrencyState
 * @property {string} amount - O valor a ser convertido.
 * @property {string} from - A moeda de origem (ex: 'BRL').
 * @property {string} to - A moeda de destino (ex: 'USD').
 */
type CurrencyState = {
  amount: string;
  from: string;
  to: string;
};

/**
 * Componente para conversão de moedas.
 * Permite ao usuário selecionar moedas de origem e destino, inserir um valor
 * e obter a conversão com base em taxas de câmbio em tempo real de uma API.
 */
export function CurrencyConverter() {
  const { t } = useLanguage();
  const { triggerInteraction } = useInterstitialAd();
  const [state, setState, isMounted] = usePersistentState<CurrencyState>('currencyConverterState', {
    amount: '1',
    from: 'BRL',
    to: 'USD',
  });
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Inverte as moedas de origem e destino.
   */
  const handleSwap = () => {
    setState(prevState => ({ ...prevState, from: prevState.to, to: prevState.from }));
  };

  /**
   * Realiza o cálculo da conversão.
   * Busca a taxa de câmbio na API da AwesomeAPI e atualiza o estado com o resultado.
   * Lida com diferentes cenários de conversão (de/para BRL, entre moedas estrangeiras).
   */
  const calculateConversion = async () => {
    triggerInteraction();
    const amount = Number(state.amount);
    if (!state.amount || isNaN(amount) || amount <= 0) {
      toast({ variant: 'destructive', title: t('invalidAmount'), description: t('invalidAmountDesc') });
      return;
    }
    if (state.from === state.to) {
        setResult(`${amount.toLocaleString()} ${state.to}`);
        return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      let convertedAmount;
      const fromCurrency = state.from === 'BRL' ? state.to : state.from;
      const toCurrency = state.from === 'BRL' ? 'BRL' : state.to;
      
      const pair = `${fromCurrency}-${toCurrency}`;
      const response = await fetch(`https://economia.awesomeapi.com.br/json/last/${pair}`);
      const data = await response.json();
      const rateData = data[pair.replace('-', '')];
      
      if (!rateData) throw new Error('API Error');

      // Cenário 1: De BRL para moeda estrangeira
      if (state.from === 'BRL' && state.to !== 'BRL') {
        convertedAmount = amount / parseFloat(rateData.ask); // Usar 'ask' (venda)
      
      // Cenário 2: De moeda estrangeira para BRL
      } else if (state.from !== 'BRL' && state.to === 'BRL') {
        convertedAmount = amount * parseFloat(rateData.bid); // Usar 'bid' (compra)

      // Cenário 3: Entre duas moedas estrangeiras (usando BRL como base)
      } else {
        const pair1 = `${state.from}-BRL`;
        const pair2 = `${state.to}-BRL`;
        const responseMulti = await fetch(`https://economia.awesomeapi.com.br/json/last/${pair1},${pair2}`);
        const dataMulti = await responseMulti.json();

        const fromRateData = dataMulti[pair1.replace('-', '')];
        const toRateData = dataMulti[pair2.replace('-', '')];

        if (!fromRateData || !fromRateData.bid || !toRateData || !toRateData.ask) {
          throw new Error('API Error for one of the pairs');
        }
        
        const amountInBRL = amount * parseFloat(fromRateData.bid);
        convertedAmount = amountInBRL / parseFloat(toRateData.ask);
      }
      
      const fractionDigits = ['BTC', 'ETH', 'DOGE', 'LTC'].includes(state.to) ? 8 : 2;
      const formattedResult = convertedAmount.toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      });

      setResult(`${formattedResult} ${state.to}`);
    } catch (error) {
      console.error('Conversion error:', error);
      toast({ variant: 'destructive', title: t('conversionFailed'), description: t('conversionFailedDesc') });
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };


  // Memoiza o label da moeda de origem para evitar recálculos desnecessários.
  const fromLabel = useMemo(() => currencies.find(c => c.value === state.from)?.label, [state.from]);

  // Exibe um skeleton enquanto o estado persistido não foi carregado para evitar piscar de tela.
  if (!isMounted) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('currencyConverter')}</CardTitle>
        <CardDescription>{t('currencyDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">{t('amount')}</Label>
              <Input
                id="amount"
                type="number"
                placeholder="100.00"
                value={state.amount}
                onChange={(e) => setState({ ...state, amount: e.target.value })}
              />
            </div>
            <div></div>
            <div className="space-y-2">
              <Label htmlFor="from-currency">{t('from')}</Label>
              <Select value={state.from} onValueChange={(value) => setState({ ...state, from: value })}>
                <SelectTrigger id="from-currency"><SelectValue placeholder="Select currency" /></SelectTrigger>
                <SelectContent>{currencies.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-currency">{t('to')}</Label>
              <Select value={state.to} onValueChange={(value) => setState({ ...state, to: value })}>
                <SelectTrigger id="to-currency"><SelectValue placeholder="Select currency" /></SelectTrigger>
                <SelectContent>{currencies.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
        </div>

         <div className="flex items-center justify-center">
             <Button variant="ghost" size="icon" onClick={handleSwap} aria-label={t('swapCurrencies')}>
                <ArrowRightLeft className="h-5 w-5" />
            </Button>
          </div>

        <Button onClick={calculateConversion} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : t('convert')}
        </Button>

        {(result || isLoading) && (
          <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">{t('result')}</p>
            {isLoading ? (
              <Skeleton className="h-10 w-48 mx-auto mt-1" />
            ) : (
              <p className="text-3xl font-bold text-primary" data-testid="conversion-result">
                {result}
              </p>
            )}
             <p className="text-sm text-muted-foreground mt-2">{state.amount} {fromLabel?.split(' - ')[0]} {t('equals')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
