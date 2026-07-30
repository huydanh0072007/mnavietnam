'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { createProjectAction } from '../actions';
import { Project, DealType, ProjectType, PublishStatus } from '@/lib/types';
import { generateSlug } from '@/lib/utils';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2,
  FileText,
  DollarSign,
  Languages,
  Loader2
} from 'lucide-react';

import { MasterDataItem, MdProvince, MdDistrict } from '@/lib/master-data-store';

interface CreateProjectClientProps {
  categories: MasterDataItem[];
  provinces: MdProvince[];
  districts: MdDistrict[];
}

function CreateProjectForm({ categories, provinces, districts }: CreateProjectClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projectCode, setProjectCode] = useState(`MNA-0${Math.floor(Math.random() * 90 + 10)}`);
  const [title, setTitle] = useState(searchParams.get('title') || '');
  const [dealType, setDealType] = useState<DealType>((searchParams.get('dealType') as DealType) || 'buyout');
  const [statusLabel, setStatusLabel] = useState('Sẵn Sàng Giao Dịch');
  const [projectType, setProjectType] = useState<ProjectType>('residential');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [district, setDistrict] = useState('Thủ Đức');
  const [scale, setScale] = useState(searchParams.get('scale') || '');
  const [legalStatus, setLegalStatus] = useState('Quy hoạch 1/500, đã hoàn thành nghĩa vụ tài chính');
  const [currentStatus, setCurrentStatus] = useState('Đất sạch, sẵn sàng khởi công');
  const [valuationDisplay, setValuationDisplay] = useState('1,200 Tỷ VNĐ');
  const [showValuation, setShowValuation] = useState(false);
  const [capitalStructure, setCapitalStructure] = useState('Mời chào 49% cổ phần, Capex 500 Tỷ');
  const [description, setDescription] = useState(searchParams.get('desc') || '');
  const [highlights, setHighlights] = useState<string[]>([
    'Vị trí đắc địa mặt tiền đại lộ lớn',
    'Pháp lý hoàn chỉnh 100%, có 1/500'
  ]);
  const [newHighlight, setNewHighlight] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // English Fields
  const [titleEn, setTitleEn] = useState('');
  const [statusLabelEn, setStatusLabelEn] = useState('');
  const [scaleEn, setScaleEn] = useState('');
  const [legalStatusEn, setLegalStatusEn] = useState('');
  const [currentStatusEn, setCurrentStatusEn] = useState('');
  const [valuationDisplayEn, setValuationDisplayEn] = useState('');
  const [capitalStructureEn, setCapitalStructureEn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [highlightsEn, setHighlightsEn] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Nếu có dữ liệu truyền vào từ Lead (có title), tự động chuyển trạng thái bài viết thành Draft
  const [publishStatus, setPublishStatus] = useState<PublishStatus>(searchParams.get('title') ? 'draft' : 'published');

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights(prev => [...prev, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(prev => prev.filter((_, i) => i !== index));
    if (highlightsEn.length > index) {
      setHighlightsEn(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    try {
      const translateText = async (text: string) => {
        if (!text) return '';
        const res = await fetch('/api/admin/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLang: 'en', sourceLang: 'vi' }),
        });
        const data = await res.json();
        return data.translatedText || text;
      };

      if (title && !titleEn) setTitleEn(await translateText(title));
      if (statusLabel && !statusLabelEn) setStatusLabelEn(await translateText(statusLabel));
      if (scale && !scaleEn) setScaleEn(await translateText(scale));
      if (legalStatus && !legalStatusEn) setLegalStatusEn(await translateText(legalStatus));
      if (currentStatus && !currentStatusEn) setCurrentStatusEn(await translateText(currentStatus));
      if (valuationDisplay && !valuationDisplayEn) setValuationDisplayEn(await translateText(valuationDisplay));
      if (capitalStructure && !capitalStructureEn) setCapitalStructureEn(await translateText(capitalStructure));
      if (description && !descriptionEn) setDescriptionEn(await translateText(description));

      // Translate highlights if they haven't been translated
      if (highlights.length > 0 && highlightsEn.length !== highlights.length) {
        const translatedHLs = await Promise.all(highlights.map(h => translateText(h)));
        setHighlightsEn(translatedHLs);
      }
    } catch (error) {
      console.error('Translation failed:', error);
      alert('Không thể dịch tự động lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên dự án');
      return;
    }

    const newProject: Partial<Project> = {
      project_code: projectCode,
      title,
      title_en: titleEn,
      slug: generateSlug(title),
      deal_type: dealType,
      status_label: statusLabel,
      status_label_en: statusLabelEn,
      project_type: projectType,
      province,
      district,
      scale: scale || '10 ha',
      scale_en: scaleEn,
      legal_status_summary: legalStatus,
      legal_status_summary_en: legalStatusEn,
      current_status: currentStatus,
      current_status_en: currentStatusEn,
      valuation_display: valuationDisplay,
      valuation_display_en: valuationDisplayEn,
      show_valuation: showValuation,
      capital_structure_summary: capitalStructure,
      capital_structure_summary_en: capitalStructureEn,
      highlights: highlights.length > 0 ? highlights : ['Dự án tiềm năng cao'],
      highlights_en: highlightsEn.length > 0 ? highlightsEn : [],
      description: description || title,
      description_en: descriptionEn,
      gallery_images: [
        'https://picsum.photos/seed/mna_new1/800/600',
        'https://picsum.photos/seed/mna_new2/800/600'
      ],
      teaser_pdf: 'teaser_sample.pdf',
      is_featured: isFeatured,
      featured_order: 1,
      publish_status: publishStatus,
    };

    try {
      await createProjectAction(newProject);
      alert('Đã thêm dự án thành công!');
      router.push('/admin/du-an');
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi thêm dự án.');
    }
  };

  return (
    <div className="flex-1 pb-16">
      <AdminHeader 
        title="Thêm Dự án M&A Mới" 
        subtitle="Biên tập và chuẩn hóa thông tin Teaser công khai cho dự án" 
      />

      <main className="px-8 py-8 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Top Bar Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAutoTranslate}
                disabled={isTranslating}
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                Dịch tự động (EN)
              </button>

              <button
                type="button"
                onClick={() => setPublishStatus('draft')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Lưu Nháp (Draft)
              </button>

              <button
                type="submit"
                className="px-6 py-2 text-sm font-bold text-[#0A1628] bg-[#C4A35A] hover:bg-[#b09048] rounded-lg flex items-center gap-2 transition-all shadow-md"
              >
                <Save className="w-4 h-4" />
                Xuất bản Dự án
              </button>
            </div>
          </div>

          {/* Form Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 font-serif border-b border-gray-100 pb-3">Thông tin Cơ bản</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Mã Dự án</label>
                    <input
                      type="text"
                      required
                      value={projectCode}
                      onChange={(e) => setProjectCode(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Loại Giao dịch</label>
                    <select
                      value={dealType}
                      onChange={(e) => setDealType(e.target.value as DealType)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    >
                      <option value="">Chọn...</option>
                      {categories.filter(c => c.category === 'deal_type').map(c => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Tên Dự án (VI)</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Khu đô thị sinh thái Long Thành"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Tên Dự án (EN)</label>
                    <input
                      type="text"
                      placeholder="VD: Long Thanh Eco City"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Nhãn Trạng thái (VI)</label>
                    <input
                      type="text"
                      placeholder="VD: Sẵn Sàng Giao Dịch"
                      value={statusLabel}
                      onChange={(e) => setStatusLabel(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Nhãn Trạng thái (EN)</label>
                    <input
                      type="text"
                      placeholder="VD: Ready for Transaction"
                      value={statusLabelEn}
                      onChange={(e) => setStatusLabelEn(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Loại hình BĐS</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value as ProjectType)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    >
                      <option value="">Chọn...</option>
                      {categories.filter(c => c.category === 'project_type').map(c => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Tỉnh / Thành phố</label>
                    <select
                      required
                      value={province}
                      onChange={(e) => {
                        setProvince(e.target.value);
                        setDistrict(''); // Reset district when province changes
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    >
                      <option value="">Chọn Tỉnh/Thành</option>
                      {provinces.map(p => (
                        <option key={p.code} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Quận / Huyện</label>
                    <select
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                      disabled={!province}
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {districts
                        .filter(d => {
                          const p = provinces.find(prov => prov.name === province);
                          return p ? d.province_code === p.code : false;
                        })
                        .map(d => (
                          <option key={d.code} value={d.name}>{d.name}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Quy mô (VI)</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: 50 ha"
                      value={scale}
                      onChange={(e) => setScale(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A] mb-2"
                    />
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Quy mô (EN)</label>
                    <input
                      type="text"
                      placeholder="VD: 50 hectares"
                      value={scaleEn}
                      onChange={(e) => setScaleEn(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 font-serif border-b border-gray-100 pb-3">Pháp lý & Hiện trạng</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Tình trạng Pháp lý (VI)</label>
                    <select
                      value={legalStatus}
                      onChange={(e) => setLegalStatus(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    >
                      <option value="">Chọn tình trạng pháp lý...</option>
                      {categories.filter(c => c.category === 'legal_status').map(c => (
                        <option key={c.key} value={c.label}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Tình trạng Pháp lý (EN)</label>
                    <input
                      type="text"
                      value={legalStatusEn}
                      onChange={(e) => setLegalStatusEn(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                      placeholder="Legal Status EN"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Hiện trạng Thực tế (VI)</label>
                    <select
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    >
                      <option value="">Chọn hiện trạng...</option>
                      {categories.filter(c => c.category === 'project_status').map(c => (
                        <option key={c.key} value={c.label}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Hiện trạng Thực tế (EN)</label>
                    <input
                      type="text"
                      value={currentStatusEn}
                      onChange={(e) => setCurrentStatusEn(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                      placeholder="Current Status EN"
                    />
                  </div>
                </div>

                {dealType === 'joint_venture' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Cơ cấu Vốn Kêu gọi Tổng quan (VI)</label>
                      <input
                        type="text"
                        value={capitalStructure}
                        onChange={(e) => setCapitalStructure(e.target.value)}
                        placeholder="VD: Mời chào 49% cổ phần, Capex 500 Tỷ"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Cơ cấu Vốn Kêu gọi Tổng quan (EN)</label>
                      <input
                        type="text"
                        value={capitalStructureEn}
                        onChange={(e) => setCapitalStructureEn(e.target.value)}
                        placeholder="VD: Offering 49% shares, Capex 500 Billion"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 font-serif border-b border-gray-100 pb-3">Tổng quan dự án</h2>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Mô tả chi tiết (VI)</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="VD: Dự án nằm ở vị trí chiến lược..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Mô tả chi tiết (EN)</label>
                    <textarea
                      rows={4}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      placeholder="VD: The project is strategically located..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    />
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 font-serif border-b border-gray-100 pb-3">Điểm nhấn Sinh lời</h2>

                <div className="space-y-4">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Điểm nhấn {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newHL = [...highlights];
                          newHL[idx] = e.target.value;
                          setHighlights(newHL);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm"
                        placeholder="VI"
                      />
                      <input
                        type="text"
                        value={highlightsEn[idx] || ''}
                        onChange={(e) => {
                          const newHL = [...highlightsEn];
                          newHL[idx] = e.target.value;
                          setHighlightsEn(newHL);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm"
                        placeholder="EN"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Thêm điểm nhấn mới..."
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Controls (1 col) */}
            <div className="space-y-6">
              {/* Valuation Security Policy */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 font-serif border-b border-gray-100 pb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#C4A35A]" />
                  Định giá & Bảo mật
                </h2>

                <div className="flex items-center justify-between p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
                  <div>
                    <div className="text-xs font-bold text-amber-900">Hiển thị Định giá?</div>
                    <div className="text-[11px] text-amber-700">Mặc định Ẩn theo chính sách bảo mật M&A</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showValuation}
                    onChange={(e) => setShowValuation(e.target.checked)}
                    className="w-5 h-5 text-[#C4A35A] rounded focus:ring-[#C4A35A] cursor-pointer"
                  />
                </div>

                {showValuation && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Định giá / Khoảng giá hiển thị (VI)</label>
                      <input
                        type="text"
                        value={valuationDisplay}
                        onChange={(e) => setValuationDisplay(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Định giá / Khoảng giá hiển thị (EN)</label>
                      <input
                        type="text"
                        value={valuationDisplayEn}
                        onChange={(e) => setValuationDisplayEn(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                        placeholder="VD: 1,200 Billion VND"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PDF Teaser File Upload */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 font-serif border-b border-gray-100 pb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#C4A35A]" />
                  Project Teaser PDF
                </h2>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100/80 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-xs font-semibold text-gray-700">Tải lên file Teaser PDF</div>
                  <div className="text-[11px] text-gray-400 mt-1">Đã đóng sẵn watermark logo (Tối đa 15MB)</div>
                </div>
              </div>

              {/* Visibility Options */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 font-serif border-b border-gray-100 pb-3">Cấu hình Hiển thị</h2>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Dự án Tâm điểm (Homepage)</span>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 text-[#C4A35A] rounded focus:ring-[#C4A35A] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Trạng thái Đăng bài</label>
                  <select
                    value={publishStatus}
                    onChange={(e) => setPublishStatus(e.target.value as PublishStatus)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  >
                    <option value="published">Công khai (Published)</option>
                    <option value="draft">Bản nháp (Draft)</option>
                    <option value="hidden">Ẩn bài (Hidden)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export function CreateProjectClient(props: CreateProjectClientProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Đang tải...</div>}>
      <CreateProjectForm {...props} />
    </Suspense>
  );
}
