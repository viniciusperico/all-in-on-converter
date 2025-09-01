
'use client';

import { useLanguage } from '@/contexts/language-context';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full shrink-0 py-6 px-4 md:px-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <a href="https://viniciusperico.github.io" target="_blank" rel="noopener noreferrer" className="hover:underline">
          &copy; {new Date().getFullYear()} All-in-One Converter.
        </a>
        <p>{t('appDescription')}</p>
      </div>
    </footer>
  );
}
