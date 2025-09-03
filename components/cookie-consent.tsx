
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent');
      if (consent !== 'true') {
        setShowConsent(true);
      }
    } catch (e) {
      // localStorage is not available
      setShowConsent(true);
    }
  }, []);

  const acceptConsent = () => {
    setShowConsent(false);
    try {
      localStorage.setItem('cookie_consent', 'true');
    } catch (e) {
        // localStorage is not available
    }
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <Card className="max-w-xl mx-auto p-4 md:p-6 flex flex-col md:flex-row items-center gap-4">
        <p className="text-sm text-foreground flex-1">
          {t('cookieConsent')}
        </p>
        <div className="flex items-center gap-2">
          <Button onClick={acceptConsent}>{t('accept')}</Button>
        </div>
      </Card>
    </div>
  );
}
