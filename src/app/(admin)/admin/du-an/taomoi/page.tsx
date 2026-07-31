import React from 'react';
import { CreateProjectClient } from './CreateProjectClient';
import { getAllMasterData, getProvinces } from '@/lib/master-data-store';

export const metadata = {
  title: 'Thêm Dự án mới | M$A International Admin',
};

export default async function CreateProjectPage() {
  const [categoriesData, provincesData] = await Promise.all([
    getAllMasterData(),
    getProvinces(false),
  ]);

  return (
    <CreateProjectClient 
      categories={categoriesData} 
      provinces={provincesData} 
    />
  );
}
