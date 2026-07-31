'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { updateProjectAction } from '../../actions';
import { Project, DealType, ProjectType, PublishStatus } from '@/lib/types';
import { generateSlug } from '@/lib/utils';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  FileText,
  DollarSign,
  Languages,
  Loader2
} from 'lucide-react';
import { MasterDataItem, MdProvince } from '@/lib/master-data-store';

interface EditProjectClientProps {
  initialProject: Project;
  categories: MasterDataItem[];
  provinces: MdProvince[];
}

export function EditProjectClient({ initialProject, categories, provinces }: EditProjectClientProps) {
  const router = useRouter();

  const [projectCode, setProjectCode] = useState(initialProject.project_code || '');
  const [title, setTitle] = useState(initialProject.title || '');
  const [dealType, setDealType] = useState<DealType>(initialProject.deal_type || 'buyout');
  const [statusLabel, setStatusLabel] = useState(initialProject.status_label || 'Sẵn Sàng Giao Dịch');
  const [projectType, setProjectType] = useState<ProjectType>(initialProject.project_type || 'residential');
  const [province, setProvince] = useState(initialProject.province || 'Thành phố Hồ Chí Minh');
  const [scale, setScale] = useState(initialProject.scale || '');
  const [legalStatus, setLegalStatus] = useState(initialProject.legal_status_summary || '');
  const [currentStatus, setCurrentStatus] = useState(initialProject.current_status || '');
  const [valuationDisplay, setValuationDisplay] = useState(initialProject.valuation_display || '');
  const [showValuation, setShowValuation] = useState(!!initialProject.show_valuation);
  const [capitalStructure, setCapitalStructure] = useState(initialProject.capital_structure_summary || '');
  const [description, setDescription] = useState(initialProject.description || '');
  const [teaserPdfUrl, setTeaserPdfUrl] = useState(initialProject.teaser_pdf || '');
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [highlights, setHighlights] = useState<string[]>(initialProject.highlights || []);
  const [newHighlight, setNewHighlight] = useState('');
  const [isFeatured, setIsFeatured] = useState(!!initialProject.is_featured);

  // English Fields
  const [titleEn, setTitleEn] = useState(initialProject.title_en || '');
  const [statusLabelEn, setStatusLabelEn] = useState(initialProject.status_label_en || '');
  const [scaleEn, setScaleEn] = useState(initialProject.scale_en || '');
  const [legalStatusEn, setLegalStatusEn] = useState(initialProject.legal_status_summary_en || '');
  const [currentStatusEn, setCurrentStatusEn] = useState(initialProject.current_status_en || '');
  const [valuationDisplayEn, setValuationDisplayEn] = useState(initialProject.valuation_display_en || '');
  const [capitalStructureEn, setCapitalStructureEn] = useState(initialProject.capital_structure_summary_en || '');
  const [descriptionEn, setDescriptionEn] = useState(initialProject.description_en || '');
  const [highlightsEn, setHighlightsEn] = useState<string[]>(initialProject.highlights_en || []);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [publishStatus, setPublishStatus] = useState<PublishStatus>(initialProject.publish_status || 'published');

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

  const handlePdfFileUpload = async (file: File) => {
    setIsUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setTeaserPdfUrl(data.url);
      } else {
        alert(data.error || 'Lỗi khi tải file PDF');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi tải file');
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    try {
      const translateText = async (text: string) => {
        if (!text) return '';
        const res = await fetch('/api/admin/translate', {
          method: 'POST',
          credentials: 'include',
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

      if (highlights.length > 0 && highlightsEn.length !== highlights.length) {
        const translatedHLs = await Promise.all(highlights.map(h => translateText(h)));
        setHighlightsEn(translatedHLs);
      }
    } catch (error) {
      console.error('Translation failed:', error);
      alert('Không thể dịch tự động lúc này.');
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

    setIsSubmitting(true);

    const updatedProject: Partial<Project> = {
      project_code: projectCode,
      title,
      title_en: titleEn,
      slug: generateSlug(title),
      deal_type: dealType,
      status_label: statusLabel,
      status_label_en: statusLabelEn,
      project_type: projectType,
      province,
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
      teaser_pdf: teaserPdfUrl,
      is_featured: isFeatured,
      publish_status: publishStatus,
    };

    try {
      await updateProjectAction(initialProject.id, updatedProject);
      alert('Cập nhật dự án thành công!');
      router.push('/admin/du-an');
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi cập nhật dự án.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 pb-16">
      <AdminHeader 
        title={`Chỉnh sửa Dự án: ${initialProject.title}`} 
        subtitle={`Mã dự án: ${initialProject.project_code || initialProject.id}`} 
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
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-bold text-[#0A1628] bg-[#C4A35A] hover:bg-[#b09048] rounded-lg flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lưu Thay Đổi
              </button>
            </div>
          </div>

          {/* Form Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    >
                      <option value="">Chọn Tỉnh/Thành</option>
                      {provinces.map(p => (
                        <option key={p.code} value={p.name}>{p.name}</option>
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

            {/* Sidebar Controls */}
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

                <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100/80 transition-colors cursor-pointer block">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handlePdfFileUpload(f);
                    }}
                    className="hidden"
                  />
                  {isUploadingPdf ? (
                    <Loader2 className="w-8 h-8 text-[#C4A35A] mx-auto mb-2 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  )}
                  <div className="text-xs font-semibold text-gray-700">Tải lên file Teaser PDF mới</div>
                  <div className="text-[11px] text-gray-400 mt-1">Bucket 'attachments' / Tối đa 15MB</div>
                </label>

                {teaserPdfUrl && (
                  <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    ✓ File PDF hiện tại: <a href={teaserPdfUrl} target="_blank" rel="noreferrer" className="underline truncate max-w-xs">{teaserPdfUrl}</a>
                  </div>
                )}
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
