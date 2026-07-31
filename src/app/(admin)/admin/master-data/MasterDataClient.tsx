'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MasterDataItem, MdProvince } from '@/lib/master-data-store';
import { 
  actionSaveProvince, 
  actionUpdateProvinceName, 
  actionToggleProvinceActive,
  actionAddMasterDataItem,
  actionUpdateMasterDataItem,
  actionToggleMasterDataItemActive,
  actionBatchUpsertLocations 
} from './actions';
import { Button } from '@/components/ui/Button';
import { Edit2, Eye, EyeOff, Plus, Check, X, Loader2, AlertCircle, Save } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Props {
  initialCategories: MasterDataItem[];
  initialProvinces: MdProvince[];
}

export function MasterDataClient({ initialCategories, initialProvinces }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'locations' | 'categories'>('locations');
  const [isUploading, setIsUploading] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // Modals state
  const [showProvModal, setShowProvModal] = useState(false);
  const [provForm, setProvForm] = useState({ code: '', name: '' });
  
  // Inline edit state for Province Name
  const [editingProvCode, setEditingProvCode] = useState<string | null>(null);
  const [editingProvName, setEditingProvName] = useState<string>('');

  // Inline edit state for Master Data Item Label
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemLabel, setEditingItemLabel] = useState<string>('');

  // Mini Form Add Master Data Item
  const [addingCategory, setAddingCategory] = useState<string | null>(null);
  const [newItemForm, setNewItemForm] = useState({ key: '', label: '' });

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS FOR PROVINCES ---

  const handleSaveProvince = async () => {
    if (!provForm.code || !provForm.name) return;
    setLoadingActionId('save_prov');
    try {
      await actionSaveProvince({ 
        code: provForm.code.trim().toUpperCase(), 
        name: provForm.name.trim(), 
        is_active: true, 
        sort_order: initialProvinces.length + 1 
      });
      setShowProvModal(false);
      setProvForm({ code: '', name: '' });
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu Tỉnh/Thành');
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleStartEditProvince = (prov: MdProvince) => {
    setEditingProvCode(prov.code);
    setEditingProvName(prov.name);
  };

  const handleSaveEditProvince = async (code: string) => {
    if (!editingProvName.trim()) return;
    setLoadingActionId(`edit_prov_${code}`);
    try {
      await actionUpdateProvinceName(code, editingProvName.trim());
      setEditingProvCode(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật tên Tỉnh/Thành');
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleToggleProvince = (prov: MdProvince) => {
    const nextStatus = !prov.is_active;
    if (!nextStatus) {
      // Confirm when hiding
      setConfirmDialog({
        isOpen: true,
        title: 'Xác nhận Ẩn Tỉnh/Thành',
        message: `Bạn có chắc chắn muốn ẩn "${prov.name}" không? Tỉnh/Thành ẩn sẽ không xuất hiện trong các form lựa chọn.`,
        onConfirm: async () => {
          setLoadingActionId(`toggle_prov_${prov.code}`);
          try {
            await actionToggleProvinceActive(prov.code, false);
            router.refresh();
          } catch (err) {
            console.error(err);
            alert('Lỗi khi thay đổi trạng thái Tỉnh/Thành');
          } finally {
            setLoadingActionId(null);
            setConfirmDialog(null);
          }
        }
      });
    } else {
      // Unhide directly
      (async () => {
        setLoadingActionId(`toggle_prov_${prov.code}`);
        try {
          await actionToggleProvinceActive(prov.code, true);
          router.refresh();
        } catch (err) {
          console.error(err);
          alert('Lỗi khi kích hoạt Tỉnh/Thành');
        } finally {
          setLoadingActionId(null);
        }
      })();
    }
  };

  // --- HANDLERS FOR MASTER DATA ITEMS ---

  const handleAddItem = async (category: string) => {
    if (!newItemForm.key || !newItemForm.label) {
      alert('Vui lòng điền đủ Mã (Key) và Tên hiển thị (Label)');
      return;
    }
    setLoadingActionId(`add_cat_${category}`);
    try {
      await actionAddMasterDataItem(category, newItemForm.key.trim().toLowerCase(), newItemForm.label.trim());
      setAddingCategory(null);
      setNewItemForm({ key: '', label: '' });
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Không thể thêm mục mới');
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleStartEditItem = (item: MasterDataItem) => {
    setEditingItemId(item.id);
    setEditingItemLabel(item.label);
  };

  const handleSaveEditItem = async (id: string) => {
    if (!editingItemLabel.trim()) return;
    setLoadingActionId(`edit_item_${id}`);
    try {
      await actionUpdateMasterDataItem(id, editingItemLabel.trim());
      setEditingItemId(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật tên mục');
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleToggleItem = (item: MasterDataItem) => {
    const nextStatus = !item.is_active;
    if (!nextStatus) {
      setConfirmDialog({
        isOpen: true,
        title: 'Xác nhận Ẩn Mục Danh mục',
        message: `Bạn có chắc chắn muốn ẩn "${item.label}" không?`,
        onConfirm: async () => {
          setLoadingActionId(`toggle_item_${item.id}`);
          try {
            await actionToggleMasterDataItemActive(item.id, false);
            router.refresh();
          } catch (err) {
            console.error(err);
            alert('Lỗi khi ẩn mục danh mục');
          } finally {
            setLoadingActionId(null);
            setConfirmDialog(null);
          }
        }
      });
    } else {
      (async () => {
        setLoadingActionId(`toggle_item_${item.id}`);
        try {
          await actionToggleMasterDataItemActive(item.id, true);
          router.refresh();
        } catch (err) {
          console.error(err);
          alert('Lỗi khi hiện mục danh mục');
        } finally {
          setLoadingActionId(null);
        }
      })();
    }
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
        const data: any[] = XLSX.utils.sheet_to_json(ws);
        
        const provMap = new Map<string, Partial<MdProvince>>();

        data.forEach((row, index) => {
          const pCode = row['Mã Tỉnh'] || row['Mã tỉnh'] || row['ma_tinh'];
          const pName = row['Tên Tỉnh'] || row['Tên tỉnh'] || row['ten_tinh'];

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
        });

        const newProvs = Array.from(provMap.values());

        if (newProvs.length > 0) {
          await actionBatchUpsertLocations(newProvs);
          alert(`Đã import thành công ${newProvs.length} Tỉnh/Thành!`);
          router.refresh();
        } else {
          alert('Không tìm thấy dữ liệu Tỉnh/Thành hợp lệ trong file Excel. Vui lòng kiểm tra lại tên cột ("Mã Tỉnh", "Tên Tỉnh").');
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

  const categoryLabels: Record<string, string> = {
    deal_type: 'Loại hình Giao dịch',
    project_type: 'Loại hình Dự án / BĐS',
    legal_status: 'Trạng thái Pháp lý',
    project_status: 'Hiện trạng Dự án',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
      <div className="flex border-b border-gray-200 bg-gray-50/50">
        <button
          onClick={() => setActiveTab('locations')}
          className={`flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-colors ${activeTab === 'locations' ? 'border-[#C4A35A] text-[#1A1A2E]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Địa giới Hành chính (34 Tỉnh/Thành)
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#1A1A2E]">Danh sách Tỉnh / Thành phố ({initialProvinces.length})</h2>
                <p className="text-xs text-gray-500 mt-1">Cấu hình tên hiển thị và ẩn/hiện Tỉnh/Thành trên hệ thống</p>
              </div>
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
                <Button onClick={() => setShowProvModal(true)} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm Tỉnh/Thành
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {initialProvinces.map(prov => {
                const isEditing = editingProvCode === prov.code;
                const isLoading = loadingActionId === `edit_prov_${prov.code}` || loadingActionId === `toggle_prov_${prov.code}`;

                return (
                  <div 
                    key={prov.code} 
                    className={`border rounded-lg p-3.5 flex justify-between items-center transition-all ${
                      !prov.is_active ? 'bg-gray-50/70 border-gray-200 opacity-60' : 'bg-white border-gray-200 shadow-sm hover:border-[#C4A35A]/50'
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={editingProvName}
                          onChange={(e) => setEditingProvName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEditProvince(prov.code)}
                          className="w-full bg-white border border-[#C4A35A] rounded px-2 py-1 text-sm text-gray-900 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEditProvince(prov.code)}
                          disabled={isLoading}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Lưu"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setEditingProvCode(null)}
                          className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                          title="Hủy"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200 shrink-0">
                          {prov.code}
                        </span>
                        <span className="font-bold text-sm text-gray-900 truncate">{prov.name}</span>
                        {!prov.is_active && (
                          <span className="text-[10px] bg-red-100 text-red-700 font-semibold px-1.5 py-0.5 rounded">Đã ẩn</span>
                        )}
                      </div>
                    )}

                    {!isEditing && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEditProvince(prov)}
                          disabled={isLoading}
                          className="p-1.5 rounded text-gray-400 hover:text-[#C4A35A] hover:bg-amber-50 transition-colors"
                          title="Sửa tên"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleProvince(prov)}
                          disabled={isLoading}
                          className={`p-1.5 rounded transition-colors ${
                            prov.is_active 
                              ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={prov.is_active ? "Ẩn tỉnh/thành" : "Kích hoạt lại"}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : prov.is_active ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-xl font-serif font-bold text-[#1A1A2E]">Quản lý Danh mục Hệ thống</h2>
              <p className="text-xs text-gray-500 mt-1">Thêm mới, chỉnh sửa nhãn hiển thị và ẩn/hiện các loại hình giao dịch, loại dự án, pháp lý...</p>
            </div>

            {/* Group by category */}
            {['deal_type', 'project_type', 'legal_status', 'project_status'].map(cat => {
              const catItems = initialCategories.filter(c => c.category === cat);
              const isAdding = addingCategory === cat;
              const isCatLoading = loadingActionId === `add_cat_${cat}`;

              return (
                <div key={cat} className="bg-gray-50/50 p-5 rounded-xl border border-gray-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-[#1A1A2E]">{categoryLabels[cat] || cat}</h3>
                      <span className="text-xs text-gray-400 font-mono">category: {cat} ({catItems.length} mục)</span>
                    </div>

                    {!isAdding && (
                      <button
                        onClick={() => {
                          setAddingCategory(cat);
                          setNewItemForm({ key: '', label: '' });
                        }}
                        className="bg-[#C4A35A] hover:bg-[#b09048] text-[#0A1628] font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Thêm mới item
                      </button>
                    )}
                  </div>

                  {/* Form add item */}
                  {isAdding && (
                    <div className="bg-white p-4 rounded-lg border border-[#C4A35A] shadow-sm space-y-3">
                      <div className="text-xs font-bold text-gray-700 uppercase">Thêm mục mới vào {categoryLabels[cat]}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Mã (Key) *</label>
                          <input
                            type="text"
                            placeholder="VD: commercial_land"
                            value={newItemForm.key}
                            onChange={(e) => setNewItemForm(prev => ({ ...prev, key: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Nhãn hiển thị (Label) *</label>
                          <input
                            type="text"
                            placeholder="VD: Đất thương mại dịch vụ"
                            value={newItemForm.label}
                            onChange={(e) => setNewItemForm(prev => ({ ...prev, label: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setAddingCategory(null)}
                          className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddItem(cat)}
                          disabled={isCatLoading}
                          className="bg-[#0A1628] hover:bg-[#1E2D42] text-white font-bold px-4 py-1 text-xs rounded transition-colors flex items-center gap-1"
                        >
                          {isCatLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-[#C4A35A]" />}
                          Lưu Item
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {catItems.map(item => {
                      const isEditing = editingItemId === item.id;
                      const isLoading = loadingActionId === `edit_item_${item.id}` || loadingActionId === `toggle_item_${item.id}`;

                      return (
                        <div 
                          key={item.id} 
                          className={`border rounded-lg p-3 flex justify-between items-center transition-all ${
                            !item.is_active ? 'bg-gray-100/60 border-gray-200 opacity-60' : 'bg-white border-gray-200 shadow-sm hover:border-[#C4A35A]/50'
                          }`}
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-2 flex-1 mr-2">
                              <input
                                type="text"
                                value={editingItemLabel}
                                onChange={(e) => setEditingItemLabel(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEditItem(item.id)}
                                className="w-full bg-white border border-[#C4A35A] rounded px-2 py-1 text-xs text-gray-900 focus:outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveEditItem(item.id)}
                                disabled={isLoading}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              >
                                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => setEditingItemId(null)}
                                className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="min-w-0 pr-2 space-y-0.5">
                              <div className="font-semibold text-xs text-gray-900 truncate flex items-center gap-1.5">
                                <span>{item.label}</span>
                                {!item.is_active && (
                                  <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1 py-0.2 rounded">Ẩn</span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono">key: {item.key}</div>
                            </div>
                          )}

                          {!isEditing && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleStartEditItem(item)}
                                disabled={isLoading}
                                className="p-1 rounded text-gray-400 hover:text-[#C4A35A] hover:bg-amber-50 transition-colors"
                                title="Sửa nhãn"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleToggleItem(item)}
                                disabled={isLoading}
                                className={`p-1 rounded transition-colors ${
                                  item.is_active 
                                    ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
                                    : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                                title={item.is_active ? "Ẩn mục này" : "Hiện lại mục này"}
                              >
                                {isLoading ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : item.is_active ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PROVINCE ADD MODAL */}
      {showProvModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900 font-serif">Thêm Tỉnh / Thành mới</h3>
              <button onClick={() => setShowProvModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Mã Tỉnh/Thành *</label>
                <input 
                  type="text" 
                  value={provForm.code} 
                  onChange={(e) => setProvForm(prev => ({...prev, code: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-[#C4A35A]" 
                  placeholder="VD: BD (Viết tắt unique)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Tên Tỉnh/Thành *</label>
                <input 
                  type="text" 
                  value={provForm.name} 
                  onChange={(e) => setProvForm(prev => ({...prev, name: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-[#C4A35A]" 
                  placeholder="VD: Tỉnh Bình Dương"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowProvModal(false)}>Hủy</Button>
              <Button onClick={handleSaveProvince} disabled={loadingActionId === 'save_prov'}>
                {loadingActionId === 'save_prov' ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                Lưu Tỉnh/Thành
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DIALOG */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-gray-900">{confirmDialog.title}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setConfirmDialog(null)}>Hủy bỏ</Button>
              <Button 
                onClick={confirmDialog.onConfirm} 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
