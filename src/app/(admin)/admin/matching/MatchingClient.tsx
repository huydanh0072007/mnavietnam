'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { 
  Sparkles, 
  Search, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Scale, 
  Layers, 
  ArrowRight, 
  Check, 
  Loader2, 
  History, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LeadItem } from '@/lib/leads-store';
import { Project } from '@/lib/types';
import { actionRecordMatch } from './actions';

interface MatchingClientProps {
  initialLeads: LeadItem[];
  initialProjects: Project[];
}

const dealTypeLabels: Record<string, string> = {
  buyout: 'Mua đứt / Chuyển nhượng 100%',
  partial_transfer: 'Chuyển nhượng một phần',
  share_transfer: 'Chuyển nhượng cổ phần',
  joint_venture: 'Liên doanh',
  lease: 'Cho thuê đất/nhà xưởng',
};

const projectTypeLabels: Record<string, string> = {
  residential: 'Đất ở / Đô thị',
  resort: 'Bất động sản Nghỉ dưỡng',
  commercial: 'Thương mại / Văn phòng',
  industrial: 'Bất động sản Công nghiệp',
  logistics: 'Kho bãi / Logistics',
  hospitality: 'Khách sạn / Hospitality',
  healthcare: 'Y tế / Bệnh viện',
  education: 'Giáo dục / Trường học',
  energy: 'Năng lượng',
  agriculture: 'Nông nghiệp',
  other: 'Khác',
};

// Helper function to check if project province matches lead description/message
const hasProvinceInLead = (prov: string, loc?: string, messageText?: string) => {
  if (!prov) return false;
  const p = prov.toLowerCase().trim();
  const l = loc ? loc.toLowerCase() : '';
  const m = messageText ? messageText.toLowerCase() : '';
  
  // Direct matching
  if (l.includes(p) || m.includes(p)) return true;
  
  // Normalize strings to strip accents for robust matching (e.g. matching "ho chi minh" and "Hồ Chí Minh")
  const normalize = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();
  };

  const pNorm = normalize(p);
  if (!pNorm) return false;

  const lNorm = normalize(l);
  const mNorm = normalize(m);

  return lNorm.includes(pNorm) || mNorm.includes(pNorm);
};

export default function MatchingClient({ initialLeads, initialProjects }: MatchingClientProps) {
  const router = useRouter();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    leadId: string;
    leadName: string;
    projectId: string;
    projectCode: string;
    projectTitle: string;
  } | null>(null);

  // Filter leads based on search query (by full_name or organization)
  const filteredLeads = initialLeads.filter((lead) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      lead.full_name?.toLowerCase().includes(q) || 
      lead.organization?.toLowerCase().includes(q)
    );
  });

  // Get currently selected lead
  const selectedLead = initialLeads.find((l) => l.id === selectedLeadId);

  // AI Smart Matching: Calculate matching scores for all projects based on selected lead
  const matchedProjects = React.useMemo(() => {
    if (!selectedLead) return [];

    return initialProjects.map((project) => {
      // 1. Deal Type Matching (+50%)
      const isDealTypeMatch = project.deal_type === selectedLead.preferred_deal_type;
      const dealScore = isDealTypeMatch ? 50 : 0;

      // 2. Province Matching (+50%)
      const isProvinceMatch = hasProvinceInLead(
        project.province,
        selectedLead.project_name_location,
        selectedLead.message
      );
      const provinceScore = isProvinceMatch ? 50 : 0;

      const totalScore = dealScore + provinceScore;

      return {
        ...project,
        matchScore: totalScore,
        isDealTypeMatch,
        isProvinceMatch,
      };
    }).sort((a, b) => b.matchScore - a.matchScore); // Sort by highest score first
  }, [selectedLead, initialProjects]);

  // Check if project has already been introduced to the selected lead
  const isAlreadyIntroduced = (projectCode: string) => {
    if (!selectedLead) return false;
    return selectedLead.internal_notes?.some(
      (note) =>
        note.author === 'Hệ thống Matching' &&
        note.text.includes(projectCode)
    );
  };

  // Get match history for selected lead
  const matchHistory = React.useMemo(() => {
    if (!selectedLead || !selectedLead.internal_notes) return [];
    return selectedLead.internal_notes
      .filter((note) => note.author === 'Hệ thống Matching')
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp)); // Latest first
  }, [selectedLead]);

  const handleIntroduceClick = (project: Project) => {
    if (!selectedLead) return;
    setConfirmModal({
      leadId: selectedLead.id,
      leadName: selectedLead.full_name,
      projectId: project.id,
      projectCode: project.project_code,
      projectTitle: project.title,
    });
  };

  const handleConfirmIntroduce = () => {
    if (!confirmModal || !selectedLead) return;
    
    const { leadId, projectCode, projectTitle, projectId } = confirmModal;
    setLoadingProjectId(projectId);
    setConfirmModal(null);

    startTransition(async () => {
      try {
        const res = await actionRecordMatch(
          leadId,
          projectCode,
          projectTitle,
          selectedLead.internal_notes || []
        );

        if (res.success) {
          toast.success('Giới thiệu dự án thành công!');
          router.refresh();
        } else {
          toast.error('Không thể cập nhật lịch sử khớp lệnh: ' + res.error);
        }
      } catch (err: any) {
        toast.error('Lỗi xảy ra trong quá trình xử lý: ' + err.message);
      } finally {
        setLoadingProjectId(null);
      }
    });
  };

  return (
    <div className="flex-1 pb-16 bg-gray-50 min-h-screen">
      <AdminHeader 
        title="Khớp lệnh (Matching) Nhà đầu tư & Dự án" 
        subtitle="Hệ thống tự động chấm điểm và xếp hạng dự án tối ưu dựa trên Khẩu vị đầu tư" 
      />

      <main className="px-8 py-8 max-w-7xl mx-auto space-y-6">
        
        {/* Intro Banner */}
        <div className="bg-gradient-to-r from-[#0A1628] to-[#1a2f4c] text-white p-6 rounded-xl flex items-start gap-4 shadow-md border border-gray-800">
          <div className="bg-[#C4A35A]/10 p-3 rounded-lg shrink-0 border border-[#C4A35A]/20">
            <Sparkles className="w-8 h-8 text-[#C4A35A]" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-serif text-[#C4A35A]">AI Smart Matching Engine v1.0</h3>
            <p className="text-sm text-gray-300 mt-1 max-w-3xl leading-relaxed">
              Trang web phân tích khẩu vị của các Nhà đầu tư hoạt động dựa trên các quy tắc: Khớp Loại giao dịch (deal_type) cộng 50 điểm, khớp vị trí Tỉnh thành (được đề cập trong ghi chú của nhà đầu tư) cộng 50 điểm. Kết quả trả về danh sách dự án xếp từ độ ưu tiên từ cao xuống thấp.
            </p>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (4/12): Investor Leads List */}
          <div className="lg:col-span-4 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h4 className="font-serif font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
                <span>Danh sách Nhà đầu tư</span>
                <span className="text-xs bg-[#0A1628] text-white px-2 py-0.5 rounded-full font-sans">
                  {filteredLeads.length}
                </span>
              </h4>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tên, đơn vị..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#C4A35A] focus:ring-1 focus:ring-[#C4A35A] placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[650px] divide-y divide-gray-100">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const isSelected = lead.id === selectedLeadId;
                  return (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`w-full text-left p-4 transition-colors flex flex-col gap-1.5 focus:outline-none ${
                        isSelected 
                          ? 'bg-[#C4A35A]/10 border-l-4 border-[#C4A35A]' 
                          : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-gray-900 text-sm leading-tight">
                          {lead.full_name || 'Khách hàng ẩn danh'}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase font-medium shrink-0 mt-0.5">
                          {lead.id}
                        </span>
                      </div>
                      
                      {lead.organization && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Building2 className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                          <span className="truncate">{lead.organization}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {lead.preferred_deal_type && (
                          <span className="inline-block text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium border border-blue-100">
                            {dealTypeLabels[lead.preferred_deal_type] || lead.preferred_deal_type}
                          </span>
                        )}
                        {lead.estimated_scale && (
                          <span className="inline-block text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium border border-amber-100">
                            {lead.estimated_scale}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center">
                  <User className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-xs">Không tìm thấy Nhà đầu tư nào</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (8/12): Matching Engine Detail */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Case: Not Selected Lead */}
            {!selectedLead ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[600px]">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-gray-900 font-bold font-serif text-lg mb-2">Chưa chọn Nhà đầu tư</h4>
                <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
                  Vui lòng click chọn một Nhà đầu tư từ danh sách bên trái để tiến hành phân tích, chấm điểm AI Smart Matching và giới thiệu dự án.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Chọn một mục từ danh sách bên trái</span>
                </div>
              </div>
            ) : (
              /* Case: Lead Selected */
              <div className="space-y-6">
                
                {/* 1. KHẨU VỊ ĐẦU TƯ CỦA KHÁCH HÀNG */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-[#0A1628] text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] tracking-wider uppercase font-semibold text-[#C4A35A]">Khẩu vị đầu tư</span>
                      <h3 className="font-serif font-bold text-lg mt-0.5">{selectedLead.full_name}</h3>
                    </div>
                    {selectedLead.organization && (
                      <span className="text-xs px-2.5 py-1 bg-white/10 rounded-full border border-white/10 max-w-[200px] truncate">
                        {selectedLead.organization}
                      </span>
                    )}
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-3.5">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin cơ bản</h4>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Họ và tên</div>
                          <div className="font-medium text-gray-900">{selectedLead.full_name}</div>
                        </div>
                      </div>

                      {selectedLead.organization && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Đơn vị / Tổ chức</div>
                            <div className="font-medium text-gray-900">{selectedLead.organization}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Số điện thoại</div>
                          <div className="font-medium text-gray-900">{selectedLead.phone || 'Chưa cung cấp'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Địa chỉ Email</div>
                          <div className="font-medium text-gray-900">{selectedLead.email || 'Chưa cung cấp'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Criteria Info */}
                    <div className="space-y-3.5">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiêu chí đầu tư</h4>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0">
                          <Layers className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Hình thức giao dịch ưu tiên</div>
                          <div className="font-bold text-blue-700">
                            {selectedLead.preferred_deal_type 
                              ? (dealTypeLabels[selectedLead.preferred_deal_type] || selectedLead.preferred_deal_type)
                              : 'Tất cả hình thức'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0">
                          <Scale className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Quy mô đầu tư mong muốn</div>
                          <div className="font-bold text-amber-700">
                            {selectedLead.estimated_scale || 'Chưa xác định'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Khu vực / Dự án mong muốn</div>
                          <div className="font-medium text-gray-900 italic">
                            {selectedLead.project_name_location || 'Bất kỳ địa điểm nào'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Field (Full Width) */}
                  {selectedLead.message && (
                    <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                      <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase">Lời nhắn / Yêu cầu chi tiết</div>
                          <p className="text-sm text-gray-700 mt-1 leading-relaxed whitespace-pre-line font-medium italic">
                            "{selectedLead.message}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2 & 3. DANH SÁCH DỰ ÁN ĐỀ XUẤT TƯƠNG THÍCH (AI SMART MATCHING) */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#C4A35A]" />
                      <h3 className="font-serif font-bold text-gray-900 text-base">Đề xuất Dự án thông minh</h3>
                    </div>
                    <span className="text-xs text-gray-500">
                      Tìm thấy {matchedProjects.length} dự án phù hợp
                    </span>
                  </div>

                  {matchedProjects.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {matchedProjects.map((project) => {
                        const score = project.matchScore;
                        const introduced = isAlreadyIntroduced(project.project_code);
                        const loading = loadingProjectId === project.id;
                        
                        return (
                          <div 
                            key={project.id} 
                            className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                              score === 100 
                                ? 'bg-green-50/10' 
                                : score === 50 
                                  ? 'bg-amber-50/10' 
                                  : 'bg-transparent'
                            }`}
                          >
                            {/* Project Information */}
                            <div className="space-y-1.5 max-w-xl">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                  {project.project_code}
                                </span>
                                <h4 className="font-bold text-gray-900 text-sm hover:text-[#C4A35A] transition-colors leading-tight">
                                  {project.title}
                                </h4>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500">
                                <span>
                                  <strong>Loại hình:</strong> {projectTypeLabels[project.project_type] || project.project_type}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden md:inline"></span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                  <span>{project.province}</span>
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden md:inline"></span>
                                <span>
                                  <strong>Quy mô:</strong> {project.scale}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mt-2 pt-1">
                                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-medium">
                                  {dealTypeLabels[project.deal_type] || project.deal_type}
                                </span>
                                
                                {project.is_featured && (
                                  <span className="text-[10px] bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-0.5 rounded font-medium">
                                    Nổi bật
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Scoring & Actions */}
                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 border-dashed border-gray-100 pt-3 md:pt-0">
                              
                              {/* Match Score Badge */}
                              <div className="text-right">
                                <div className="text-[10px] text-gray-400 font-medium">Điểm tương thích</div>
                                <div className="mt-0.5">
                                  {score === 100 ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-100 text-green-800 px-2.5 py-1 rounded-full border border-green-200">
                                      100% Khớp hoàn toàn
                                    </span>
                                  ) : score === 50 ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200">
                                      50% Khớp một phần
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">
                                      0% Chưa khớp
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Action Button */}
                              <div>
                                {introduced ? (
                                  <button
                                    disabled
                                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-gray-100 text-gray-400 border border-gray-200 px-3.5 py-2 rounded-lg cursor-not-allowed"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    Đã giới thiệu
                                  </button>
                                ) : (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleIntroduceClick(project)}
                                    disabled={loading || isPending}
                                    className="border border-[#C4A35A] bg-[#C4A35A]/5 hover:bg-[#C4A35A] hover:text-[#1A1A2E] text-[#a38541] font-semibold text-xs py-2 px-3.5 h-9"
                                  >
                                    {loading ? (
                                      <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                        Đang lưu...
                                      </>
                                    ) : (
                                      'Giới thiệu Dự án'
                                    )}
                                  </Button>
                                )}
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Không có dự án nào có sẵn trong hệ thống.</p>
                    </div>
                  )}
                </div>

                {/* 4. KHUNG LỊCH SỬ GIỚI THIỆU */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                    <History className="w-5 h-5 text-gray-500" />
                    <h3 className="font-serif font-bold text-gray-900 text-base">Lịch sử Giới thiệu</h3>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-sans">
                      {matchHistory.length}
                    </span>
                  </div>

                  <div className="p-6">
                    {matchHistory.length > 0 ? (
                      <div className="space-y-4">
                        {matchHistory.map((note, index) => (
                          <div 
                            key={index}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 relative overflow-hidden"
                          >
                            {/* Decorative left accent */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C4A35A]"></div>
                            
                            <div className="flex-1 pl-2">
                              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                                {note.text}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                                <span>
                                  Tác vụ: <strong className="text-gray-500">{note.author}</strong>
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>{note.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-400 flex flex-col items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
                        <p className="text-xs">Chưa giới thiệu bất kỳ dự án nào cho nhà đầu tư này.</p>
                        <p className="text-[10px] text-gray-400 mt-1 max-w-[280px]">
                          Danh sách dự án giới thiệu thành công qua Hệ thống Matching sẽ được lưu vết tại đây.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </main>

      {/* CONFIRM DIALOG (MODAL) */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#C4A35A]" />
              <h3 className="font-serif font-bold text-gray-900 text-base">Xác nhận giới thiệu</h3>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                Bạn có chắc chắn muốn giới thiệu dự án <strong className="text-gray-900 font-bold">{confirmModal.projectCode}</strong> cho nhà đầu tư <strong className="text-gray-900 font-bold">{confirmModal.leadName}</strong>?
              </p>
              
              <div className="mt-4 bg-gray-50 p-3.5 rounded-lg border border-gray-100 text-xs space-y-1.5">
                <div>
                  <strong className="text-gray-500">Mã dự án:</strong> {confirmModal.projectCode}
                </div>
                <div>
                  <strong className="text-gray-500">Tiêu đề:</strong> {confirmModal.projectTitle}
                </div>
                <div>
                  <strong className="text-gray-500">Nhà đầu tư:</strong> {confirmModal.leadName}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setConfirmModal(null)}
                className="text-gray-700 hover:bg-gray-200 border-none font-medium h-9 text-xs px-4"
              >
                Hủy bỏ
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmIntroduce}
                className="font-bold bg-[#C4A35A] text-[#1A1A2E] hover:bg-[#a38541] h-9 text-xs px-4 rounded-sm shadow-sm"
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
