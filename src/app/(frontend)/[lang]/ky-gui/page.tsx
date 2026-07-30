import React from 'react';
import { Metadata } from 'next';
import { KyGuiClient } from './KyGuiClient';
import { getAllMasterData } from '@/lib/master-data-store';

export const metadata: Metadata = {
  title: 'Ký gửi & Hợp tác đầu tư Dự án Bất động sản',
  description: 'Gửi thông tin ký gửi hoặc hợp tác đầu tư dự án bất động sản tiềm năng của bạn tới hơn 200 nhà đầu tư tổ chức và cá nhân uy tín. M$A International cam kết bảo mật thông tin tuyệt đối.',
  openGraph: {
    title: 'Ký gửi & Hợp tác đầu tư Dự án Bất động sản | M$A International',
    description: 'Nền tảng kết nối Độc quyền chuyển nhượng và hợp tác đầu tư phát triển dự án bất động sản uy tín hàng đầu tại Việt Nam.',
    url: 'https://mnainternational.pages.dev/ky-gui',
  }
};

import { getDictionary } from '@/lib/get-dictionary';

export default async function KyGuiPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const dict = await getDictionary(lang as any);
  
  const categoriesData = await getAllMasterData();
  return <KyGuiClient categories={categoriesData} dict={dict} lang={lang as string} />;
}
