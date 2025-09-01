
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AdPlaceholder } from '@/components/ad-placeholder';
import { CurrencyConverter } from '@/components/converters/currency-converter';
import { MeasurementConverter } from '@/components/converters/measurement-converter';
import { FinancialConverter } from '@/components/converters/financial-converter';
import { HealthConverter } from '@/components/converters/health-converter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/language-context';
import { Coins, Ruler, Landmark, HeartPulse } from 'lucide-react';

/**
 * Componente principal da página inicial.
 * Renderiza o cabeçalho, rodapé, placeholders de anúncio e o sistema de abas
 * que contém todos os conversores disponíveis na aplicação.
 */
export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <AdPlaceholder className="h-24 w-full mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 justify-center">
          {/* Publicidade Lateral Esquerda (visível em telas grandes) */}
          <aside className="hidden lg:flex justify-end sticky top-8 self-start">
            <AdPlaceholder className="h-[600px] w-[200px]" />
          </aside>

          {/* Conteúdo Principal */}
          <div className="w-full max-w-2xl">
            <Tabs defaultValue="currency" className="w-full">
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
                <CurrencyConverter />
              </TabsContent>
              <TabsContent value="measurement" className="mt-6">
                <MeasurementConverter />
              </TabsContent>
              <TabsContent value="financial" className="mt-6">
                <FinancialConverter />
              </TabsContent>
              <TabsContent value="health" className="mt-6">
                <HealthConverter />
              </TabsContent>
            </Tabs>
          </div>

          {/* Publicidade Lateral Direita (visível em telas grandes) */}
          <aside className="hidden lg:flex justify-start sticky top-8 self-start">
            <AdPlaceholder className="h-[600px] w-[200px]" />
          </aside>
        </div>
        
        <AdPlaceholder className="h-24 w-full mt-8" />
      </main>
      <Footer />
    </div>
  );
}
