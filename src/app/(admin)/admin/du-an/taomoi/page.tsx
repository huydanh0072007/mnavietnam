import React from 'react';
import { CreateProjectClient } from './CreateProjectClient';
import { getAllMasterData, getProvinces, getDistricts } from '@/lib/master-data-store';

export const metadata = {
  title: 'Thêm Dự án mới | M$A International Admin',
};

export default async function CreateProjectPage() {
  const [categoriesData, provincesData, districtsData] = await Promise.all([
    getAllMasterData(),
    getProvinces(false),
    getDistricts(undefined, false),
  ]);

  return (
    <CreateProjectClient 
      categories={categoriesData} 
      provinces={provincesData} 
      districts={districtsData} 
    />
  );
}
