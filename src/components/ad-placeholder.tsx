
'use client';

import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  className?: string;
}

export function AdPlaceholder({ className }: AdPlaceholderProps) {
  const { t } = useLanguage();
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center text-sm text-muted-foreground",
        className
      )}
    >
      <p>{t('advertisement')}</p>
    </div>
  );
}
