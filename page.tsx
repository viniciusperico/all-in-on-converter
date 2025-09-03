
'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { GoogleAd } from '@/components/google-ad';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/language-context';
import { Coins, Ruler, Landmark, HeartPulse } from 'lucide-react';
import { Faq } from '@/components/layout/faq';
import { Skeleton } from '@/components/ui/skeleton';

const CurrencyConverter = dynamic(() => import('@/components/converters/currency-converter').then(mod => mod.CurrencyConverter), {
  loading: () => <Skeleton className="h-[350px] w-full" />,
});
const MeasurementConverter = dynamic(() => import('@/components/converters/measurement-converter').then(mod => mod.MeasurementConverter), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
});
const FinancialConverter = dynamic(() => import('@/components/converters/financial-converter').then(mod => mod.FinancialConverter), {
  loading: () => <Skeleton className="h-[450px] w-full" />,
});
const HealthConverter = dynamic(() => import('@/components/converters/health-converter').then(mod => mod.HealthConverter), {
  loading: () => <Skeleton className="h-[480px] w-full" />,
});


/**
 * Componente principal da página inicial.
 * Renderiza o cabeçalho, rodapé, placeholders de anúncio e o sistema de abas
 * que contém todos os conversores disponíveis na aplicação.
 */
export default function Home() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('currency');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <GoogleAd adSlot="7605794059" className="h-24 w-full mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 justify-center">
          {/* Publicidade Lateral Esquerda (visível em telas grandes) */}
          <aside className="hidden lg:flex justify-end sticky top-8 self-start">
            <GoogleAd adSlot="4979630719" className="h-[600px] w-[200px]" />
          </aside>

          {/* Conteúdo Principal */}
          <div className="w-full max-w-2xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                <TabsTrigger value="currency" className="flex flex-col sm:flex-row items-center justify-center gap-2 py-2">
                  <Coins className="h-5 w-5" /> {t('currencyConverter')}
                </TabsTrigger>
                <TabsTrigger value="measurement" className="flex flex-col sm:flex-row items-center justify-center gap-2 py-2">
                  <Ruler className="h-5 w-5" /> {t('measurementConverter')}
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex flex-col sm:flex-row items-center justify-center gap-2 py-2">
                  <Landmark className="h-5 w-5" /> {t('financialConverter')}
                </TabsTrigger>
                <TabsTrigger value="health" className="flex flex-col sm:flex-row items-center justify-center gap-2 py-2">
                  <HeartPulse className="h-5 w-5" /> {t('healthConverter')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="currency" className="mt-6">
                <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                  <CurrencyConverter />
                </Suspense>
              </TabsContent>
              <TabsContent value="measurement" className="mt-6">
                 <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <MeasurementConverter />
                </Suspense>
              </TabsContent>
              <TabsContent value="financial" className="mt-6">
                 <Suspense fallback={<Skeleton className="h-[450px] w-full" />}>
                  <FinancialConverter />
                </Suspense>
              </TabsContent>
              <TabsContent value="health" className="mt-6">
                 <Suspense fallback={<Skeleton className="h-[480px] w-full" />}>
                  <HealthConverter />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>

          {/* Publicidade Lateral Direita (visível em telas grandes) */}
          <aside className="hidden lg:flex justify-start sticky top-8 self-start">
            <GoogleAd adSlot="4979630719" className="h-[600px] w-[200px]" />
          </aside>
        </div>
        
        <Faq />

        <GoogleAd adSlot="7605794059" className="h-24 w-full mt-8" />
      </main>
      <Footer />
    </div>
  );
}
