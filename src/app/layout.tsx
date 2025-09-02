
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from '@/components/cookie-consent';
import { LanguageProvider } from '@/contexts/language-context';
import { ThemeProvider } from '@/components/theme-provider';
import { InterstitialAdProvider } from '@/contexts/interstitial-ad-context';

export const metadata: Metadata = {
  title: 'All-in-One Converter',
  description: 'Your global platform to convert currencies, measurements, BMI, and more – fast, easy, and free.',
  keywords: 'online converter, currency converter, BMI calculator, measurement converter, global conversion tool, financial calculator',
  author: [{ name: 'All-in-One Converter' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://all-in-on-converter.tech/',
    languages: {
      'en': 'https://all-in-on-converter.tech/en',
      'pt': 'https://all-in-on-converter.tech/pt',
    },
  },
  openGraph: {
    title: 'All-in-One Converter',
    description: 'Convert currencies, units, BMI, and more quickly and easily, all in one place.',
    type: 'website',
    url: 'https://all-in-on-converter.tech',
    images: 'https://all-in-on-converter.tech/icon.svg',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All-in-One Converter',
    description: 'Convert currencies, measurements, BMI, and more online with All-in-One Converter – fast, simple, and free.',
    images: 'https://all-in-on-converter.tech/icon.svg',
    site: '@allinoneconv',
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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3866356690472317" crossOrigin="anonymous"></script>
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
