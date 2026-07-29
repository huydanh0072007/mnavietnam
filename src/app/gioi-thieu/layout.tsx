import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới thiệu về M$A International | Nền tảng kết nối M&A Bất động sản',
  description: 'Tìm hiểu về tầm nhìn, sứ mệnh và đội ngũ chuyên gia của M$A International - cổng kết nối chuyển nhượng và hợp tác đầu tư dự án bất động sản cao cấp.',
};

export default function GioiThieuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
