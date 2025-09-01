
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from '@/components/cookie-consent';
import { LanguageProvider } from '@/contexts/language-context';
import { ThemeProvider } from '@/components/theme-provider';
import { InterstitialAdProvider } from '@/contexts/interstitial-ad-context';

export const metadata: Metadata = {
  title: 'OmniCalc – All-in-One Online Converter',
  description: 'OmniCalc is your global platform to convert currencies, measurements, BMI, and more – fast, easy, and free.',
  keywords: 'online converter, currency converter, BMI calculator, measurement converter, global conversion tool, financial calculator',
  author: [{ name: 'OmniCalc' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://www.omnicalc.com/',
    languages: {
      'en': 'https://www.omnicalc.com/en',
      'pt': 'https://www.omnicalc.com/pt',
    },
  },
  openGraph: {
    title: 'OmniCalc – All-in-One Online Converter',
    description: 'OmniCalc helps you convert currencies, units, BMI, and more quickly and easily, all in one place.',
    type: 'website',
    url: 'https://www.omnicalc.com',
    images: 'https://www.omnicalc.com/assets/logo.png',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniCalc – All-in-One Online Converter',
    description: 'Convert currencies, measurements, BMI, and more online with OmniCalc – fast, simple, and free.',
    images: 'https://www.omnicalc.com/assets/logo.png',
    site: '@OmniCalc',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        {/*
          // ===================================================================
          // SUBSTITUA O ID DO ADSENSE AQUI
          // Substitua 'ca-pub-XXXXXXXXXXXXXXXX' pelo seu ID de cliente do AdSense.
          // ===================================================================
        */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script>
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <InterstitialAdProvider>
              {children}
              <Toaster />
              <CookieConsent />
            </InterstitialAdProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
