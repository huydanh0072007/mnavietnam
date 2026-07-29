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

export default function GioiThieuPage() {
  return <GioiThieuClient />;
}
