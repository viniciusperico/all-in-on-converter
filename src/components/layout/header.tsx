
'use client';

import Image from 'next/image';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage, Language } from '@/contexts/language-context';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    toast({
      title: t('languageChanged'),
      description: t('languageChangedTo', { lang: lang === 'pt' ? t('portuguese') : t('english') }),
    });
  };

  return (
    <header className="w-full shrink-0 py-4 px-4 md:px-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <Image src="/icon.svg" alt="All-in-One Converter Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t('appName')}
          </h1>
        </div>
        <div className="flex items-center justify-end gap-2">
           <Select value={language} onValueChange={(value) => handleLanguageChange(value as Language)}>
            <SelectTrigger className="w-auto" aria-label="Select language">
              <SelectValue asChild>
                <Globe />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="en">{t('english')}</SelectItem>
              <SelectItem value="pt">{t('portuguese')}</SelectItem>
            </SelectContent>
          </Select>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
