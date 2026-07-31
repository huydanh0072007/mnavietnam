import React from 'react';
import { MasterDataClient } from './MasterDataClient';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getAllMasterData, getProvinces } from '@/lib/master-data-store';

export const metadata = {
  title: 'Quản lý Master Data | M$A International Admin',
};

export default async function MasterDataPage() {
  const [categoriesData, provincesData] = await Promise.all([
    getAllMasterData(),
    getProvinces(true),
  ]);

  return (
    <div className="flex-1 pb-16 bg-[#F8F6F2] min-h-screen">
      <AdminHeader 
        title="Quản lý Master Data" 
        subtitle="Cấu hình địa giới hành chính (34 Tỉnh/Thành), các trạng thái, loại hình giao dịch trên hệ thống" 
      />
      <main className="px-8 py-8 max-w-7xl mx-auto">
        <MasterDataClient 
          initialCategories={categoriesData} 
          initialProvinces={provincesData} 
        />
      </main>
    </div>
  );
}
