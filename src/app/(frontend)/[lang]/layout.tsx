import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '@/app/globals.css';
import { AppShell } from '@/components/layout/AppShell';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair',
});

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mnavietnam.vercel.app';

  return {
    title: {
      default: dict.metadata.title,
      template: '%s | M$A International',
    },
    description: dict.metadata.description,
    keywords: dict.metadata.keywords.split(',').map((k: string) => k.trim()),
    authors: [{ name: 'M$A International' }],
    creator: 'M$A International',
    publisher: 'M$A International',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      url: `${siteUrl}/${lang}`,
      siteName: 'M$A International',
      locale: lang === 'en' ? 'en_US' : 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'M$A International',
      description: dict.metadata.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<any>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  
  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}>
        <AppShell lang={lang} dict={dict}>{children}</AppShell>
      </body>
    </html>
  );
}
