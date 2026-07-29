'use client';

import React, { useState, useRef } from 'react';
import { MasterDataItem, MdProvince, MdDistrict } from '@/lib/master-data-store';
import { actionSaveProvince, actionSaveDistrict, actionSaveMasterData, actionBatchUpsertLocations } from './actions';
import { Button } from '@/components/ui/Button';
import * as XLSX from 'xlsx';

interface Props {
  initialCategories: MasterDataItem[];
  initialProvinces: MdProvince[];
  initialDistricts: MdDistrict[];
}

export function MasterDataClient({ initialCategories, initialProvinces, initialDistricts }: Props) {
  const [activeTab, setActiveTab] = useState<'locations' | 'categories'>('locations');
  const [isUploading, setIsUploading] = useState(false);
  
  // Modals state
  const [showProvModal, setShowProvModal] = useState(false);
  const [showDistModal, setShowDistModal] = useState<string | null>(null); // holds provinceCode if open
  
  // Form state
  const [provForm, setProvForm] = useState({ code: '', name: '' });
  const [distForm, setDistForm] = useState({ code: '', name: '', old_address_note: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProvince = async () => {
    if (!provForm.code || !provForm.name) return;
    await actionSaveProvince({ 
      code: provForm.code, 
      name: provForm.name, 
      is_active: true, 
      sort_order: initialProvinces.length + 1 
    });
    setShowProvModal(false);
    setProvForm({ code: '', name: '' });
  };

  const handleSaveDistrict = async () => {
    if (!showDistModal || !distForm.code || !distForm.name) return;
    await actionSaveDistrict({ 
      code: distForm.code, 
      province_code: showDistModal, 
      name: distForm.name, 
      old_address_note: distForm.old_address_note || undefined, 
      is_active: true, 
      sort_order: initialDistricts.length + 1 
    });
    setShowDistModal(null);
    setDistForm({ code: '', name: '', old_address_note: '' });
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Expected format: array of JSON
        const data: any[] = XLSX.utils.sheet_to_json(ws);
        
        const provMap = new Map<string, Partial<MdProvince>>();
        const distMap = new Map<string, Partial<MdDistrict>>();

        data.forEach((row, index) => {
          const pCode = row['Mã Tỉnh'] || row['Mã tỉnh'] || row['ma_tinh'];
          const pName = row['Tên Tỉnh'] || row['Tên tỉnh'] || row['ten_tinh'];
          const dCode = row['Mã Quận'] || row['Mã quận'] || row['ma_quan'] || row['Mã Quận/Huyện'];
          const dName = row['Tên Quận'] || row['Tên quận'] || row['ten_quan'] || row['Tên Quận/Huyện'];
          const note = row['Ghi chú'] || row['ghi_chu'] || row['Ghi chú cũ'];

          if (pCode && pName) {
            if (!provMap.has(pCode)) {
              provMap.set(pCode, {
                code: String(pCode),
                name: String(pName),
                is_active: true,
                sort_order: index + 1
              });
            }
          }

          if (dCode && dName && pCode) {
            distMap.set(String(dCode), {
              code: String(dCode),
              province_code: String(pCode),
              name: String(dName),
              old_address_note: note ? String(note) : undefined,
              is_active: true,
              sort_order: index + 1
            });
          }
        });

        const newProvs = Array.from(provMap.values());
        const newDists = Array.from(distMap.values());

        if (newProvs.length > 0 || newDists.length > 0) {
          await actionBatchUpsertLocations(newProvs, newDists);
          alert(`Đã import thành công ${newProvs.length} Tỉnh/Thành và ${newDists.length} Quận/Huyện!`);
        } else {
          alert('Không tìm thấy dữ liệu hợp lệ trong file Excel. Vui lòng kiểm tra lại tên cột.');
        }
      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi đọc file Excel.');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
      <div className="flex border-b border-gray-200 bg-gray-50/50">
        <button
          onClick={() => setActiveTab('locations')}
          className={`flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-colors ${activeTab === 'locations' ? 'border-[#C4A35A] text-[#1A1A2E]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Địa giới Hành chính
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-colors ${activeTab === 'categories' ? 'border-[#C4A35A] text-[#1A1A2E]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Danh mục chung
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'locations' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-[#1A1A2E]">Quản lý Tỉnh/Thành & Quận/Huyện</h2>
              <div className="flex gap-2">
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleExcelUpload} 
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  size="sm" 
                  variant="secondary"
                  disabled={isUploading}
                >
                  {isUploading ? 'Đang xử lý...' : 'Import Excel'}
                </Button>
                <Button onClick={() => setShowProvModal(true)} size="sm">Thêm Tỉnh/Thành</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {initialProvinces.map(prov => (
                <div key={prov.code} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{prov.name} <span className="text-sm text-gray-500 font-normal">({prov.code})</span></h3>
                    <Button onClick={() => setShowDistModal(prov.code)} size="sm" variant="secondary">Thêm Quận/Huyện</Button>
                  </div>
                  
                  <div className="pl-4 border-l-2 border-[#C4A35A]/30 space-y-2">
                    {initialDistricts.filter(d => d.province_code === prov.code).map(dist => (
                      <div key={dist.code} className="bg-gray-50 p-3 rounded flex justify-between items-start">
                        <div>
                          <div className="font-medium text-[#1A1A2E]">{dist.name}</div>
                          {dist.old_address_note && (
                            <div className="text-xs text-gray-500 mt-1 italic">Ghi chú cũ: {dist.old_address_note}</div>
                          )}
                        </div>
                        <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded">{dist.code}</span>
                      </div>
                    ))}
                    {initialDistricts.filter(d => d.province_code === prov.code).length === 0 && (
                      <div className="text-sm text-gray-400 italic">Chưa có Quận/Huyện nào</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-8">
             <div className="flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-[#1A1A2E]">Danh mục Loại hình, Trạng thái</h2>
            </div>
            {/* Group by category */}
            {['deal_type', 'project_type', 'legal_status', 'project_status'].map(cat => (
              <div key={cat} className="mb-6">
                <h3 className="font-bold text-gray-700 capitalize mb-3 px-2 py-1 bg-gray-100 rounded inline-block">{cat.replace('_', ' ')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {initialCategories.filter(c => c.category === cat).map(item => (
                    <div key={item.id} className="border border-gray-200 p-3 rounded-lg flex justify-between items-center shadow-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{item.key}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      
      {/* Province Modal */}
      {showProvModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Thêm Tỉnh/Thành</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Tỉnh/Thành *</label>
                <input 
                  type="text" 
                  value={provForm.code} 
                  onChange={(e) => setProvForm(prev => ({...prev, code: e.target.value}))}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[#C4A35A] focus:border-[#C4A35A]" 
                  placeholder="VD: HN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Tỉnh/Thành *</label>
                <input 
                  type="text" 
                  value={provForm.name} 
                  onChange={(e) => setProvForm(prev => ({...prev, name: e.target.value}))}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[#C4A35A] focus:border-[#C4A35A]" 
                  placeholder="VD: Hà Nội"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={() => setShowProvModal(false)}>Hủy</Button>
              <Button onClick={handleSaveProvince}>Lưu Lại</Button>
            </div>
          </div>
        </div>
      )}

      {/* District Modal */}
      {showDistModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Thêm Quận/Huyện</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Quận/Huyện *</label>
                <input 
                  type="text" 
                  value={distForm.code} 
                  onChange={(e) => setDistForm(prev => ({...prev, code: e.target.value}))}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[#C4A35A] focus:border-[#C4A35A]" 
                  placeholder="VD: HN_BD"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Quận/Huyện *</label>
                <input 
                  type="text" 
                  value={distForm.name} 
                  onChange={(e) => setDistForm(prev => ({...prev, name: e.target.value}))}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[#C4A35A] focus:border-[#C4A35A]" 
                  placeholder="VD: Quận Ba Đình"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú địa chỉ cũ (Tùy chọn)</label>
                <input 
                  type="text" 
                  value={distForm.old_address_note} 
                  onChange={(e) => setDistForm(prev => ({...prev, old_address_note: e.target.value}))}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[#C4A35A] focus:border-[#C4A35A]" 
                  placeholder="VD: Phường Trúc Bạch"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={() => setShowDistModal(null)}>Hủy</Button>
              <Button onClick={handleSaveDistrict}>Lưu Lại</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
