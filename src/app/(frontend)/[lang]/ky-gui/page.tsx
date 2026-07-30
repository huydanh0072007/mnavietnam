import React from 'react';
import { Metadata } from 'next';
import { KyGuiClient } from './KyGuiClient';
import { getAllMasterData } from '@/lib/master-data-store';

import { getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }: { params: Promise<any> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: `${dict.submit.title} | M$A International`,
    description: dict.submit.desc,
    openGraph: {
      title: `${dict.submit.title} | M$A International`,
      description: dict.submit.desc,
      url: 'https://mnainternational.pages.dev/ky-gui',
    }
  };
}

export default async function KyGuiPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const dict = await getDictionary(lang as any);
  
  const categoriesData = await getAllMasterData();
  return <KyGuiClient categories={categoriesData} dict={dict} lang={lang as string} />;
}
