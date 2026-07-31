import React from 'react';
import { notFound } from 'next/navigation';
import { EditProjectClient } from './EditProjectClient';
import { getAllMasterData, getProvinces } from '@/lib/master-data-store';
import { getProjectById } from '@/lib/projects-store';

export const metadata = {
  title: 'Chỉnh sửa Dự án | M$A International Admin',
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  
  const [projectData, categoriesData, provincesData] = await Promise.all([
    getProjectById(id),
    getAllMasterData(),
    getProvinces(false),
  ]);

  if (!projectData) {
    notFound();
  }

  return (
    <EditProjectClient 
      initialProject={projectData}
      categories={categoriesData} 
      provinces={provincesData} 
    />
  );
}
