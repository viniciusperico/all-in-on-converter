
'use client';

import { useLanguage } from '@/contexts/language-context';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * Componente de Perguntas Frequentes (FAQ).
 * Exibe uma lista de perguntas e respostas comuns sobre as ferramentas
 * do site em um formato de acordeão.
 */
export function Faq() {
  const { t } = useLanguage();

  const faqItems = [
    {
      question: t('faqQuestion1'),
      answer: t('faqAnswer1'),
    },
    {
      question: t('faqQuestion2'),
      answer: t('faqAnswer2'),
    },
    {
      question: t('faqQuestion3'),
      answer: t('faqAnswer3'),
    },
    {
      question: t('faqQuestion4'),
      answer: t('faqAnswer4'),
    },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto py-12 md:py-16">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('faqTitle')}
        </h2>
        <p className="text-muted-foreground md:text-xl">
          {t('faqSubtitle')}
        </p>
      </div>
      <div className="mt-8">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
