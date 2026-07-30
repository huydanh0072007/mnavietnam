import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { DanhMucContent, DanhMucLoading } from './DanhMucClient';
import { getProjects } from '@/lib/projects-store';
import { getAllMasterData, getProvinces } from '@/lib/master-data-store';

export const revalidate = 60; // revalidate every 60 seconds

import { getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }: { params: Promise<any> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: `${dict.projects.title} | M$A International`,
    description: dict.projects.description,
  };
}

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
