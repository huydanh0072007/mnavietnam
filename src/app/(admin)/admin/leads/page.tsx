'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { 
  Search, 
  Download, 
  MessageSquare, 
  Phone, 
  Mail, 
  Building2, 
  FileText, 
  AlertCircle,
  Send,
  X,
  ChevronRight,
  PlusCircle,
  EyeOff,
  Loader2,
  Upload,
  Trash2
} from 'lucide-react';
import { formatDate, getLeadStatusLabel } from '@/lib/utils';

interface LeadItem {
  id: string;
  lead_type: 'interest' | 'submission';
  full_name: string;
  organization: string;
  email: string;
  phone: string;
  role_title?: string;
  message?: string;
  project_name_location?: string;
  preferred_deal_type?: string;
  estimated_scale?: string;
  attachment_url?: string;
  related_project_title?: string;
  status: string;
  assigned_admin_id?: string;
  internal_notes: Array<{text: string; author: string; timestamp: string}>;
  audit_logs?: Array<{action: string; file_url?: string; timestamp: string}>;
  signature_url?: string;
  is_active?: boolean;
  created_at: string;
}

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [typeFilter, setTypeFilter] = useState<'all' | 'interest' | 'submission'>('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newNoteText, setNewNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingNewLead, setIsSubmittingNewLead] = useState(false);
  const [isHidingLead, setIsHidingLead] = useState(false);

  // Status Modal State
  const [statusModal, setStatusModal] = useState<{isOpen: boolean; leadId: string; newStatus: string; currentStatus: string} | null>(null);
  const [sendEmail, setSendEmail] = useState(true);

  React.useEffect(() => {
    setStatusFilter('all');
    setCurrentPage(1);
  }, [typeFilter]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, monthFilter, startDate, endDate]);

  // Confirm Hide Modal State
  const [showHideConfirm, setShowHideConfirm] = useState(false);

  // Create Lead Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    lead_type: 'interest' as 'interest' | 'submission',
    full_name: '',
    role_title: '',
    organization: '',
    phone: '',
    email: '',
    project_name_location: '',
    preferred_deal_type: 'buyout',
    estimated_scale: '',
    message: '',
    attachment_url: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const fetchLeads = () => {
    setIsLoading(true);
    fetch('/api/leads', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          // Filter out is_active === false
          const activeLeads = data.filter((l: LeadItem) => l.is_active !== false);
          setLeads(activeLeads);
          if (activeLeads.length > 0 && !selectedLead) {
            setSelectedLead(activeLeads[0]);
          }
        }
      })
      .finally(() => setIsLoading(false));
  };

  React.useEffect(() => {
    fetchLeads();
  }, []);

  // Filter out non-active leads first
  const activeLeadsOnly = leads.filter(l => l.is_active !== false);

  const availableMonths = React.useMemo(() => {
    const months = new Set<string>();
    activeLeadsOnly.forEach(l => {
      if (l.created_at) {
        const date = new Date(l.created_at);
        if (!isNaN(date.getTime())) {
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          months.add(`${month}/${year}`);
        }
      }
    });
    return Array.from(months).sort((a, b) => {
      const [monthA, yearA] = a.split('/').map(Number);
      const [monthB, yearB] = b.split('/').map(Number);
      return yearB - yearA || monthB - monthA;
    });
  }, [activeLeadsOnly]);

  const filteredLeads = activeLeadsOnly.filter(l => {
    const matchType = typeFilter === 'all' || l.lead_type === typeFilter;
    const matchSearch = (l.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (l.organization || '').toLowerCase().includes(search.toLowerCase()) ||
                        (l.phone || '').includes(search);
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    
    let matchMonth = true;
    if (monthFilter !== 'all') {
      const date = new Date(l.created_at);
      if (!isNaN(date.getTime())) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        matchMonth = `${month}/${year}` === monthFilter;
      } else {
        matchMonth = false;
      }
    }
    
    let matchDateRange = true;
    if (startDate || endDate) {
      const date = new Date(l.created_at);
      if (!isNaN(date.getTime())) {
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        if (startDate && dateStr < startDate) matchDateRange = false;
        if (endDate && dateStr > endDate) matchDateRange = false;
      } else {
        matchDateRange = false;
      }
    }
    
    return matchType && matchSearch && matchStatus && matchMonth && matchDateRange;
  });

  const totalPages = Math.ceil(filteredLeads.length / 20) || 1;
  const startIndex = (currentPage - 1) * 20;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + 20);

  // Bulk Actions states & handlers
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  const handleToggleSelectLead = (id: string, checked: boolean) => {
    setSelectedLeadIds(prev => checked ? [...prev, id] : prev.filter(item => item !== id));
  };

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedLeads.map(l => l.id);
      setSelectedLeadIds(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedLeads.map(l => l.id);
      setSelectedLeadIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleBulkUpdateStatus = async (newStatus: string) => {
    if (selectedLeadIds.length === 0) return;
    if (!window.confirm(`Xác nhận đổi trạng thái của ${selectedLeadIds.length} lead đã chọn sang "${getLeadStatusLabel(newStatus)}"?`)) return;

    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedLeadIds,
          updates: { status: newStatus }
        })
      });

      if (res.ok) {
        toast.success(`Đã đổi trạng thái cho ${selectedLeadIds.length} lead thành công!`);
        setSelectedLeadIds([]);
        fetchLeads();
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật hàng loạt.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể kết nối đến máy chủ.');
    }
  };

  const handleBulkArchive = async () => {
    if (selectedLeadIds.length === 0) return;
    if (!window.confirm(`Bạn có chắc chắn muốn ẩn/lưu trữ ${selectedLeadIds.length} lead đã chọn không?`)) return;

    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedLeadIds,
          updates: { is_active: false }
        })
      });

      if (res.ok) {
        toast.success(`Đã ẩn ${selectedLeadIds.length} lead thành công!`);
        setSelectedLeadIds([]);
        fetchLeads();
      } else {
        toast.error('Có lỗi xảy ra khi ẩn hàng loạt.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể kết nối đến máy chủ.');
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setCreateForm(prev => ({ ...prev, attachment_url: data.url }));
      } else {
        toast.error(data.error || 'Lỗi tải file');
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải file lên');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleCreateLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.full_name.trim() || !createForm.organization.trim() || !createForm.phone.trim() || !createForm.email.trim()) {
      toast.error('Vui lòng điền các trường bắt buộc (*)');
      return;
    }

    setIsSubmittingNewLead(true);
    try {
      let finalAttachmentUrl = createForm.attachment_url;
      if (selectedFile && !finalAttachmentUrl) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          finalAttachmentUrl = uploadData.url;
        }
      }

      const body = {
        ...createForm,
        attachment_url: finalAttachmentUrl,
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Tạo Lead mới thành công!');
        setShowCreateModal(false);
        setCreateForm({
          lead_type: 'interest',
          full_name: '',
          role_title: '',
          organization: '',
          phone: '',
          email: '',
          project_name_location: '',
          preferred_deal_type: 'buyout',
          estimated_scale: '',
          message: '',
          attachment_url: '',
        });
        setSelectedFile(null);
        fetchLeads();
      } else {
        toast.error(data.errors?.join(', ') || 'Không thể tạo Lead');
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setIsSubmittingNewLead(false);
    }
  };

  const [isDeletingLead, setIsDeletingLead] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    setIsDeletingLead(true);
    try {
      const res = await fetch(`/api/leads?id=${selectedLead.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('Đã xóa vĩnh viễn Lead thành công');
        setShowDeleteConfirm(false);
        const updatedList = leads.filter(l => l.id !== selectedLead.id);
        setLeads(updatedList);
        setSelectedLead(updatedList.length > 0 ? updatedList[0] : null);
      } else {
        toast.error('Không thể xóa Lead này');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi xử lý xóa Lead');
    } finally {
      setIsDeletingLead(false);
    }
  };

  const handleHideLead = async () => {
    if (!selectedLead) return;
    setIsHidingLead(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLead.id,
          updates: { is_active: false }
        })
      });

      if (res.ok) {
        setShowHideConfirm(false);
        const updatedList = leads.filter(l => l.id !== selectedLead.id);
        setLeads(updatedList);
        setSelectedLead(updatedList.length > 0 ? updatedList[0] : null);
      } else {
        toast.error('Không thể ẩn Lead này');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi xử lý ẩn Lead');
    } finally {
      setIsHidingLead(false);
    }
  };

  const handleStatusChange = (leadId: string, currentStatus: string, newStatus: string) => {
    setStatusModal({ isOpen: true, leadId, newStatus, currentStatus });
  };

  const confirmStatusUpdate = async () => {
    if (!statusModal) return;
    const { leadId, newStatus } = statusModal;
    
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
    
    try {
      let notesToAppend: any[] = [];
      
      if (sendEmail) {
        const newNote = {
          text: `Hệ thống sẽ gửi Email tự động đến khách hàng báo trạng thái: ${newStatus}`,
          author: 'Hệ thống (Auto)',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        };
        notesToAppend.push(newNote);
        
        const leadToUpdate = leads.find(l => l.id === leadId) || selectedLead;
        if (leadToUpdate) {
          const updatedNotes = [...(leadToUpdate.internal_notes || []), newNote];
          setLeads(prev => prev.map(l => l.id === leadId ? { ...l, internal_notes: updatedNotes } : l));
          if (selectedLead && selectedLead.id === leadId) {
            setSelectedLead(prev => prev ? { ...prev, internal_notes: updatedNotes } : null);
          }
        }
      }

      const updates: any = { status: newStatus };
      if (notesToAppend.length > 0) {
        const leadToUpdate = leads.find(l => l.id === leadId) || selectedLead;
        updates.internal_notes = [...(leadToUpdate?.internal_notes || []), ...notesToAppend];
      }

      await fetch('/api/leads', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, updates })
      });
      
      if (sendEmail) {
        await fetch('/api/leads/notify', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId, newStatus })
        });
      }
      
    } catch (err) {
      console.error(err);
    } finally {
      setStatusModal(null);
    }
  };

  const handleAddNote = async () => {
    if (!newNoteText.trim() || !selectedLead) return;
    const newNote = {
      text: newNoteText.trim(),
      author: 'Super Admin',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    const currentNotes = selectedLead.internal_notes || [];
    const updatedNotes = [...currentNotes, newNote];
    setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, internal_notes: updatedNotes } : l));
    setSelectedLead(prev => prev ? { ...prev, internal_notes: updatedNotes } : null);
    setNewNoteText('');
    
    try {
      await fetch('/api/leads', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead.id, updates: { internal_notes: updatedNotes } })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportExcel = () => {
    const headers = ['Mã Lead', 'Loại Lead', 'Họ tên', 'Đơn vị', 'Email', 'SĐT', 'Dự án / Nội dung', 'Trạng thái', 'Ngày tạo'];
    const rows = filteredLeads.map(l => [
      l.id,
      l.lead_type === 'interest' ? 'Nhà đầu tư' : 'Ký gửi dự án',
      `"${l.full_name}"`,
      `"${l.organization}"`,
      l.email,
      l.phone,
      `"${l.related_project_title || l.project_name_location || ''}"`,
      getLeadStatusLabel(l.status),
      formatDate(l.created_at)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MNA_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConvertToProject = () => {
    if (!selectedLead) return;
    const params = new URLSearchParams();
    if (selectedLead.project_name_location) params.set('title', selectedLead.project_name_location);
    if (selectedLead.preferred_deal_type) params.set('dealType', selectedLead.preferred_deal_type);
    if (selectedLead.estimated_scale) params.set('scale', selectedLead.estimated_scale);
    if (selectedLead.message) params.set('desc', selectedLead.message);
    router.push(`/admin/du-an/taomoi?${params.toString()}`);
  };

  return (
    <div className="flex-1 pb-16">
      <AdminHeader 
        title="Quản lý Lead Thu nhập" 
        subtitle="Tiếp nhận thông tin nhà đầu tư, xử lý luồng ký gửi và cập nhật tiến độ hợp tác" 
      />

      <main className="px-8 py-8 max-w-7xl space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-semibold">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Tất cả ({activeLeadsOnly.length})
              </button>
              <button
                onClick={() => setTypeFilter('interest')}
                className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'interest' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Nhà đầu tư ({activeLeadsOnly.filter(l => l.lead_type === 'interest').length})
              </button>
              <button
                onClick={() => setTypeFilter('submission')}
                className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'submission' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Ký gửi dự án ({activeLeadsOnly.filter(l => l.lead_type === 'submission').length})
              </button>
            </div>

            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên, quỹ, SĐT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#C4A35A]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4A35A] min-w-[150px] text-gray-700"
            >
              <option value="all">Tất cả trạng thái</option>
              {typeFilter === 'all' || typeFilter === 'interest' ? (
                <optgroup label="Nhà đầu tư">
                  <option value="new">Mới (New)</option>
                  <option value="contacted">Đã liên hệ (Contacted)</option>
                  <option value="nda_sent">Đang gửi NDA (NDA Sent)</option>
                  <option value="due_diligence">Đang thẩm định (Due Diligence)</option>
                  <option value="closed_won">Đóng deal (Closed Won)</option>
                  <option value="closed_lost">Không thành công (Closed Lost)</option>
                </optgroup>
              ) : null}
              {typeFilter === 'all' || typeFilter === 'submission' ? (
                <optgroup label="Ký gửi dự án">
                  <option value="draft_pending">Draft chờ thẩm định</option>
                  <option value="in_progress">Đang làm việc offline</option>
                  <option value="published">Đã lên bài (Published)</option>
                  <option value="rejected">Từ chối ký gửi</option>
                </optgroup>
              ) : null}
            </select>

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4A35A] min-w-[150px] text-gray-700"
            >
              <option value="all">Tất cả tháng</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700">
              <span className="text-xs text-gray-500 font-medium">Từ</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent focus:outline-none text-xs text-gray-700 w-[115px]"
              />
              <span className="text-xs text-gray-500 font-medium">đến</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent focus:outline-none text-xs text-gray-700 w-[115px]"
              />
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold ml-1 shrink-0"
                  title="Xóa bộ lọc ngày"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#C4A35A] hover:bg-[#b09048] text-[#0A1628] font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all shadow-md shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Tạo Lead Mới
            </button>

            <button
              onClick={handleExportExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all shadow-md shrink-0"
            >
              <Download className="w-4 h-4" />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Floating Bulk Actions Bar */}
        {selectedLeadIds.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-50/80 border border-amber-200 p-4 rounded-xl shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-800">
                Đã chọn {selectedLeadIds.length} lead
              </span>
              <button
                onClick={() => setSelectedLeadIds([])}
                className="text-xs text-gray-500 hover:text-gray-700 underline font-semibold"
              >
                Bỏ chọn
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkUpdateStatus(e.target.value);
                    e.target.value = '';
                  }
                }}
                value=""
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#C4A35A] text-gray-700 font-semibold cursor-pointer"
              >
                <option value="" disabled>Đổi trạng thái hàng loạt...</option>
                {typeFilter === 'interest' ? (
                  <>
                    <option value="new">Mới tiếp nhận (New)</option>
                    <option value="contacted">Đã liên hệ</option>
                    <option value="nda_sent">Đã ký NDA</option>
                    <option value="due_diligence">Đang thẩm định</option>
                    <option value="closed_won">Giao dịch thành công</option>
                    <option value="closed_lost">Không thành công</option>
                  </>
                ) : typeFilter === 'submission' ? (
                  <>
                    <option value="draft_pending">Chờ duyệt</option>
                    <option value="in_progress">Đang xử lý / Đánh giá</option>
                    <option value="published">Đã xuất bản (Live)</option>
                    <option value="rejected">Từ chối</option>
                  </>
                ) : (
                  <>
                    <option value="new">Mới tiếp nhận (New)</option>
                    <option value="contacted">Đã liên hệ</option>
                    <option value="nda_sent">Đã ký NDA</option>
                    <option value="due_diligence">Đang thẩm định</option>
                    <option value="closed_won">Giao dịch thành công</option>
                    <option value="closed_lost">Không thành công</option>
                    <option value="draft_pending">Chờ duyệt (Ký gửi)</option>
                    <option value="in_progress">Đang xử lý (Ký gửi)</option>
                    <option value="published">Đã xuất bản (Ký gửi)</option>
                    <option value="rejected">Từ chối (Ký gửi)</option>
                  </>
                )}
              </select>

              <button
                onClick={handleBulkArchive}
                className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Ẩn hàng loạt
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Leads List */}
          <div className={`lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100 ${mobileView === 'detail' ? 'hidden lg:block' : 'block'}`}>
            <div className="p-4 bg-gray-50/80 border-b border-gray-200 text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={paginatedLeads.length > 0 && paginatedLeads.every(l => selectedLeadIds.includes(l.id))}
                  onChange={(e) => handleSelectAllChange(e.target.checked)}
                  className="w-4 h-4 text-[#C4A35A] rounded border-gray-300 focus:ring-[#C4A35A] cursor-pointer"
                />
                <span>Danh sách Lead ({filteredLeads.length})</span>
              </div>
              {selectedLeadIds.length > 0 && (
                <span className="text-[10px] bg-[#C4A35A]/20 text-[#C4A35A] px-2 py-0.5 rounded font-mono">
                  Đang chọn {selectedLeadIds.length}
                </span>
              )}
            </div>

            <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
              {isLoading ? (
                <div className="p-8 text-center text-gray-400">Đang tải danh sách...</div>
              ) : paginatedLeads.length === 0 ? (
                <div className="p-8 text-center text-gray-400">Không có dữ liệu Lead</div>
              ) : (
                paginatedLeads.map((lead) => {
                  const isSelected = selectedLead?.id === lead.id;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setMobileView('detail');
                      }}
                      className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                        isSelected ? 'bg-amber-50/70 border-l-4 border-[#C4A35A]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.includes(lead.id)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleToggleSelectLead(lead.id, e.target.checked)}
                            className="w-4 h-4 text-[#C4A35A] rounded border-gray-300 focus:ring-[#C4A35A] cursor-pointer mr-0.5"
                          />
                          <span className="font-mono text-xs font-bold text-gray-500">{lead.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lead.lead_type === 'interest' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {lead.lead_type === 'interest' ? 'NĐT' : 'Ký gửi'}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">{formatDate(lead.created_at)}</span>
                      </div>

                      <div className="font-bold text-sm text-gray-900">{lead.full_name}</div>
                      <div className="text-xs text-gray-500 truncate">{lead.organization}</div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          lead.status === 'new' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          lead.status === 'draft_pending' ? 'bg-purple-100 text-purple-800' :
                          lead.status === 'nda_sent' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {getLeadStatusLabel(lead.status)}
                        </span>

                        <ChevronRight className={`w-4 h-4 text-gray-400 ${isSelected ? 'text-[#C4A35A] translate-x-1' : ''} transition-transform`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trang trước
                </button>
                <span>
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>

          <div className={`lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
            {selectedLead ? (
              <>
                {/* Back button on mobile */}
                <button
                  onClick={() => setMobileView('list')}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 border border-gray-200 rounded-md px-3 py-1.5 bg-white lg:hidden mb-4 shadow-sm"
                >
                  ← Quay lại danh sách
                </button>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-gray-400">{selectedLead.id}</span>
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        selectedLead.lead_type === 'interest' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {selectedLead.lead_type === 'interest' ? 'Lead Yêu cầu Thông tin NĐT' : 'Lead Ký gửi Dự án'}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold font-serif text-gray-900">{selectedLead.full_name}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedLead.role_title || 'Đại diện'} • {selectedLead.organization}</p>
                    
                    {selectedLead.lead_type === 'submission' && (
                      <button
                        onClick={handleConvertToProject}
                        className="mt-3 bg-[#C4A35A] hover:bg-[#b09048] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm"
                      >
                        + Tạo Dự án từ Lead này
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 text-right w-full">
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Trạng thái</label>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => handleStatusChange(selectedLead.id, selectedLead.status, e.target.value)}
                        className="bg-white border border-gray-300 font-bold text-xs rounded px-2.5 py-1.5 text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                      >
                        {selectedLead.lead_type === 'interest' ? (
                          <>
                            <option value="new">Mới (New)</option>
                            <option value="contacted">Đã liên hệ (Contacted)</option>
                            <option value="nda_sent">Đang gửi NDA (NDA Sent)</option>
                            <option value="due_diligence">Đang thẩm định (Due Diligence)</option>
                            <option value="closed_won">Đóng deal (Closed Won)</option>
                            <option value="closed_lost">Không thành công (Closed Lost)</option>
                          </>
                        ) : (
                          <>
                            <option value="draft_pending">Draft chờ thẩm định</option>
                            <option value="in_progress">Đang làm việc offline</option>
                            <option value="published">Đã lên bài (Published)</option>
                            <option value="rejected">Từ chối ký gửi</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowHideConfirm(true)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                        title="Ẩn Lead khỏi hệ thống"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        Ẩn Lead
                      </button>

                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                        title="Xóa vĩnh viễn Lead này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Xóa Lead
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#C4A35A] shrink-0" />
                    <div>
                      <div className="text-[11px] text-gray-400">Số điện thoại</div>
                      <a href={`tel:${selectedLead.phone}`} className="text-xs font-bold text-gray-900 hover:underline">{selectedLead.phone}</a>
                    </div>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#C4A35A] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] text-gray-400">Email liên hệ</div>
                      <a href={`mailto:${selectedLead.email}`} className="text-xs font-bold text-gray-900 hover:underline truncate block">{selectedLead.email}</a>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-2">
                  <div className="text-xs font-bold uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#C4A35A]" />
                    {selectedLead.lead_type === 'interest' ? 'Dự án Quan tâm:' : 'Thông tin Ký gửi:'}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {selectedLead.related_project_title || selectedLead.project_name_location || 'Dự án chung'}
                  </div>
                  {selectedLead.preferred_deal_type && (
                    <div className="text-xs text-gray-600">
                      Loại hình mong muốn: <strong className="text-gray-900">{selectedLead.preferred_deal_type === 'buyout' ? 'Chuyển nhượng' : 'Hợp tác đầu tư'}</strong> • Quy mô: <strong className="text-gray-900">{selectedLead.estimated_scale}</strong>
                    </div>
                  )}
                </div>

                {selectedLead.message && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Lời nhắn / Nhu cầu cụ thể:</h3>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                      {selectedLead.message}
                    </div>
                  </div>
                )}

                {/* Documents Viewer */}
                {(selectedLead.attachment_url || selectedLead.signature_url) && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C4A35A]" />
                      Tài liệu đính kèm
                    </h3>
                    <div className="flex flex-col gap-2">
                      {selectedLead.attachment_url && (
                        <a href={selectedLead.attachment_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group">
                          <span className="text-sm font-semibold text-gray-800">Tài liệu đính kèm (Teaser/Profile)</span>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-800" />
                        </a>
                      )}
                      {selectedLead.signature_url && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <span className="text-xs font-bold text-gray-500 mb-2 block">Chữ ký NDA điện tử</span>
                          <div className="bg-white border border-dashed border-gray-300 rounded-md p-2 flex justify-center">
                            <img src={selectedLead.signature_url} alt="Chữ ký" className="h-16 object-contain filter invert" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Internal Notes Section */}
                <div className="border-t border-gray-100 pt-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#C4A35A]" />
                    Ghi chú Nội bộ ({(selectedLead.internal_notes || []).length})
                  </h3>

                  {/* Notes Timeline */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {(selectedLead.internal_notes || []).length > 0 ? (
                      selectedLead.internal_notes.map((note, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg text-xs space-y-1">
                          <div className="flex items-center justify-between text-gray-400 font-medium">
                            <span>{note.author}</span>
                            <span>{note.timestamp}</span>
                          </div>
                          <p className="text-gray-800 font-medium">{note.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400 italic">Chưa có ghi chú nội bộ cho Lead này.</div>
                    )}
                  </div>

                  {/* Add Note Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Thêm ghi chú xử lý nội bộ..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                    />
                    <button
                      onClick={handleAddNote}
                      className="bg-[#0A1628] hover:bg-[#1E2D42] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-[#C4A35A]" />
                      Ghi chú
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-gray-400">Chọn 1 Lead ở danh sách bên trái để xem chi tiết.</div>
            )}
          </div>
        </div>
      </main>

      {/* CREATE LEAD MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 font-serif text-lg flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#C4A35A]" />
                Tạo Lead Khách hàng Mới
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLeadSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Loại Lead *</label>
                  <select
                    value={createForm.lead_type}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, lead_type: e.target.value as any }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  >
                    <option value="interest">Nhà đầu tư (Quan tâm dự án)</option>
                    <option value="submission">Ký gửi dự án (Chủ sở hữu)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={createForm.full_name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Chức danh</label>
                  <input
                    type="text"
                    placeholder="VD: Giám đốc Đầu tư"
                    value={createForm.role_title}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, role_title: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Đơn vị / Tổ chức *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Tập đoàn ABC"
                    value={createForm.organization}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0901234567"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email liên hệ *</label>
                  <input
                    type="email"
                    required
                    placeholder="VD: contact@example.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Tên dự án quan tâm / Ký gửi</label>
                  <input
                    type="text"
                    placeholder="VD: Khu đô thị MNA Long Thành"
                    value={createForm.project_name_location}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, project_name_location: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Hình thức giao dịch</label>
                  <select
                    value={createForm.preferred_deal_type}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, preferred_deal_type: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  >
                    <option value="buyout">Chuyển nhượng toàn phần (100%)</option>
                    <option value="joint_venture">Hợp tác đầu tư / Liên doanh</option>
                    <option value="share_transfer">Chuyển nhượng cổ phần</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Quy mô ước tính</label>
                <input
                  type="text"
                  placeholder="VD: 50 ha hoặc Capex 1.000 Tỷ"
                  value={createForm.estimated_scale}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, estimated_scale: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nội dung / Ghi chú chi tiết</label>
                <textarea
                  rows={3}
                  placeholder="Nhu cầu chi tiết của nhà đầu tư hoặc thông tin sơ bộ dự án..."
                  value={createForm.message}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Tài liệu đính kèm (Teaser / Profile PDF / Doc)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setSelectedFile(f);
                        handleFileUpload(f);
                      }
                    }}
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  {isUploadingFile && <Loader2 className="w-5 h-5 animate-spin text-[#C4A35A] shrink-0" />}
                </div>
                {createForm.attachment_url && (
                  <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    ✓ Đã tải file: <a href={createForm.attachment_url} target="_blank" rel="noreferrer" className="underline truncate max-w-xs">{createForm.attachment_url}</a>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNewLead || isUploadingFile}
                  className="bg-[#0A1628] hover:bg-[#1E2D42] text-white font-bold px-5 py-2 rounded-lg text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmittingNewLead ? <Loader2 className="w-4 h-4 animate-spin text-[#C4A35A]" /> : <Send className="w-4 h-4 text-[#C4A35A]" />}
                  Tạo Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM HIDE LEAD MODAL */}
      {showHideConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-gray-900">Xác nhận Ẩn Lead</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bạn có chắc chắn muốn ẩn Lead của <strong className="text-gray-900">{selectedLead?.full_name}</strong> không? 
              Lead bị ẩn sẽ không còn hiển thị trên danh sách quản trị.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowHideConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Hủy
              </button>
              <button 
                onClick={handleHideLead} 
                disabled={isHidingLead}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"
              >
                {isHidingLead ? <Loader2 className="w-4 h-4 animate-spin" /> : <EyeOff className="w-4 h-4" />}
                Xác nhận Ẩn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE LEAD MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-gray-900">Xóa vĩnh viễn Lead</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bạn có chắc chắn muốn <strong className="text-red-600">xóa vĩnh viễn</strong> Lead của <strong className="text-gray-900">{selectedLead?.full_name}</strong> không? 
              Thao tác này sẽ xóa hoàn toàn dữ liệu khỏi cơ sở dữ liệu và không thể khôi phục.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Hủy
              </button>
              <button 
                onClick={handleDeleteLead} 
                disabled={isDeletingLead}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"
              >
                {isDeletingLead ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Status Update Modal */}
      {statusModal && statusModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#C4A35A]" />
                Xác nhận chuyển trạng thái
              </h3>
              <button onClick={() => setStatusModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">
                Bạn đang chuyển trạng thái Lead từ <strong className="text-gray-900">{getLeadStatusLabel(statusModal.currentStatus)}</strong> sang <strong className="text-[#C4A35A]">{getLeadStatusLabel(statusModal.newStatus)}</strong>.
              </p>
              
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center h-5">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-[#C4A35A] border-gray-300 rounded focus:ring-[#C4A35A]"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">Gửi Email thông báo (Mock)</span>
                  <span className="text-xs text-gray-500">Hệ thống sẽ ghi chú "Đã gửi email" vào lịch sử.</span>
                </div>
              </label>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => setStatusModal(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={confirmStatusUpdate}
                className="px-4 py-2 text-sm font-bold text-white bg-[#0A1628] hover:bg-[#1E2D42] rounded-lg transition-colors shadow-sm"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
