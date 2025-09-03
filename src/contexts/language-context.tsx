
'use client';

import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { translations } from '@/lib/translations';

export type Language = 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Provedor de Contexto de Idioma.
 * Fornece o idioma atual, uma função para alterá-lo e uma função de tradução `t`
 * para todos os componentes filhos.
 * @param {object} props
 * @param {React.ReactNode} props.children - Os componentes filhos que terão acesso ao contexto.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/en')) {
        setLanguage('en');
      } else if (path.startsWith('/pt')) {
        setLanguage('pt');
      }
    }
  }, []);

  /**
   * Função de tradução.
   * Busca uma string de tradução no objeto `translations` com base no idioma atual.
   * Se não encontrar, usa o inglês como padrão.
   * Permite substituições de placeholders (ex: {lang}).
   * @param {keyof typeof translations.en} key - A chave da string de tradução.
   * @param {Record<string, string>} [replacements] - Um objeto com placeholders para substituir.
   * @returns {string} A string traduzida.
   */
  const t = useCallback((key: keyof typeof translations.en, replacements: Record<string, string> = {}): string => {
    let translation = translations[language]?.[key] || translations.en[key] || key;
    
    Object.keys(replacements).forEach(rKey => {
      translation = translation.replace(`{${rKey}}`, replacements[rKey]);
    });

    return translation;
  }, [language]);

  // Memoiza o valor do contexto para evitar re-renderizações desnecessárias.
  const value = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook customizado para acessar o Contexto de Idioma.
 * Simplifica o uso do contexto nos componentes.
 * @returns {LanguageContextType} O valor do contexto.
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}