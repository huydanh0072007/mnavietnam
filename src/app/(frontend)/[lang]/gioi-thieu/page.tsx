import React from 'react';
import { Metadata } from 'next';
import { GioiThieuClient } from './GioiThieuClient';

export const metadata: Metadata = {
  title: 'Giới thiệu về M$A International - Nền tảng M&A Bất động sản',
  description: 'Tìm hiểu về M$A International, tầm nhìn, sứ mệnh và giá trị cốt lõi trong việc minh bạch hóa thị trường mua bán, sáp nhập dự án bất động sản.',
  openGraph: {
    title: 'Giới thiệu về M$A International - Nền tảng M&A Bất động sản',
    description: 'Tìm hiểu về M$A International, tầm nhìn, sứ mệnh và giá trị cốt lõi trong việc minh bạch hóa thị trường M&A bất động sản.',
    url: 'https://mnainternational.pages.dev/gioi-thieu',
  }
};

import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';

export default async function GioiThieuPage({ params }: { params: Promise<any> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return <GioiThieuClient lang={lang} dict={dict} />;
}
