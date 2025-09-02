
'use client';

import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import React, { useEffect } from 'react';

interface GoogleAdProps extends React.HTMLAttributes<HTMLDivElement> {
  adSlot: string;
}

export function GoogleAd({ adSlot, className, ...props }: GoogleAdProps) {
    const { t } = useLanguage();

    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, []);

    if (!adSlot || adSlot.startsWith('YOUR_')) {
        return (
             <div
                className={cn(
                    "flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center text-sm text-muted-foreground",
                    className
                )}
                {...props}
                >
                <p>{t('advertisement')}</p>
            </div>
        )
    }

    return (
        <div className={cn("overflow-hidden", className)} {...props}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-3866356690472317"
                data-ad-slot={adSlot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
