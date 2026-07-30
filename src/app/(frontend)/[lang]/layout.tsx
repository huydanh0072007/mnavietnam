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

export const metadata: Metadata = {
  title: {
    default: 'M$A International - Cổng thông tin Dự án M&A Bất động sản',
    template: '%s | M$A International',
  },
  description: 'M$A International - Nền tảng kết nối Độc quyền chuyển nhượng và hợp tác đầu tư phát triển dự án bất động sản uy tín hàng đầu tại Việt Nam.',
  keywords: ['M&A', 'bất động sản', 'chuyển nhượng dự án', 'hợp tác đầu tư', 'bán dự án', 'BĐS', 'Việt Nam'],
  authors: [{ name: 'M$A International' }],
  creator: 'M$A International',
  publisher: 'M$A International',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'M$A International - Cổng thông tin Dự án M&A Bất động sản',
    description: 'Nền tảng kết nối Độc quyền chuyển nhượng và hợp tác đầu tư phát triển dự án bất động sản uy tín hàng đầu tại Việt Nam.',
    url: 'https://mnainternational.pages.dev',
    siteName: 'M$A International',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M$A International',
    description: 'Nền tảng kết nối Độc quyền chuyển nhượng và hợp tác đầu tư BĐS.',
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

import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  // If using Next.js 15, params might be a Promise, but we'll try this first.
  const lang = params?.lang || 'vi';
  const dict = await getDictionary(lang as Locale);
  
  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}>
        <AppShell lang={lang} dict={dict}>{children}</AppShell>
      </body>
    </html>
  );
}
