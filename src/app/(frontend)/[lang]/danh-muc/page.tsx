import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { DanhMucContent, DanhMucLoading } from './DanhMucClient';
import { getProjects } from '@/lib/projects-store';
import { getAllMasterData, getProvinces } from '@/lib/master-data-store';

export const revalidate = 60; // revalidate every 60 seconds

export const metadata: Metadata = {
  title: 'Danh mục Dự án M&A Bất động sản | M$A International',
  description: 'Khám phá danh mục các cơ hội đầu tư, chuyển nhượng 100% hoặc hợp tác đầu tư phát triển dự án bất động sản cao cấp được thẩm định pháp lý và quy hoạch bởi chuyên gia M$A International.',
};

import { getDictionary } from '@/lib/get-dictionary';

export default async function DanhMucPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const dict = await getDictionary(lang as any);
  
  const [allProjects, categoriesData, provincesData] = await Promise.all([
    getProjects(),
    getAllMasterData(),
    getProvinces(false),
  ]);
  const publishedProjects = allProjects.filter(p => p.publish_status === 'published');

  return (
    <Suspense fallback={<DanhMucLoading />}>
      <DanhMucContent 
        initialProjects={publishedProjects} 
        categories={categoriesData} 
        provinces={provincesData} 
        dict={dict}
        lang={lang as string}
      />
    </Suspense>
  );
}
