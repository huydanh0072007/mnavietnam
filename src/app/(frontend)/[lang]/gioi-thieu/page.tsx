import React from 'react';
import { Metadata } from 'next';
import { GioiThieuClient } from './GioiThieuClient';

import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';

export async function generateMetadata({ params }: { params: Promise<any> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: `${dict.about.hero_title} | M$A International`,
    description: dict.about.hero_desc,
    openGraph: {
      title: `${dict.about.hero_title} | M$A International`,
      description: dict.about.hero_desc,
      url: 'https://mnainternational.pages.dev/gioi-thieu',
    }
  };
}

export default async function GioiThieuPage({ params }: { params: Promise<any> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return <GioiThieuClient lang={lang} dict={dict} />;
}
