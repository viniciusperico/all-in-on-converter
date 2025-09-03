
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from '@/components/cookie-consent';
import { LanguageProvider } from '@/contexts/language-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'All-in-One Converter',
  description: 'Your global platform to convert currencies, measurements, BMI, and more – fast, easy, and free.',
  keywords: 'online converter, currency converter, BMI calculator, measurement converter, global conversion tool, financial calculator',
  authors: [{ name: 'All-in-One Converter' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://all-in-on-converter.tech/',
    languages: {
      'x-default': 'https://all-in-on-converter.tech/',
      'en': 'https://all-in-on-converter.tech/en/',
      'pt': 'https://all-in-on-converter.tech/pt/',
    },
  },
  openGraph: {
    title: 'All-in-One Converter',
    description: 'Convert currencies, units, BMI, and more quickly and easily, all in one place.',
    type: 'website',
    url: 'https://all-in-on-converter.tech/',
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "All-in-One Converter",
    "description": "Your global platform to convert currencies, measurements, BMI, and more – fast, easy, and free. Includes currency converter, measurement converter, financial calculator, and health calculator (BMI, calories).",
    "url": "https://all-in-on-converter.tech/",
    "applicationCategory": "Utilities",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    },
    "mainEntity": {
      "@type": "WebSite",
      "url": "https://all-in-on-converter.tech/"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3866356690472317" crossOrigin="anonymous"></script>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster />
            <CookieConsent />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
