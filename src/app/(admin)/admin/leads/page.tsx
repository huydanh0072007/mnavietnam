'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { 
  Search, 
  Filter, 
  Download, 
  MessageSquare, 
  Phone, 
  Mail, 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Send,
  User,
  Tag,
  X,
  ChevronRight
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
  created_at: string;
}


export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'interest' | 'submission'>('all');
  const [search, setSearch] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Status Modal State
  const [statusModal, setStatusModal] = useState<{isOpen: boolean; leadId: string; newStatus: string; currentStatus: string} | null>(null);
  const [sendEmail, setSendEmail] = useState(true);

  React.useEffect(() => {
    fetch('/api/leads', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          setLeads(data);
          if (data.length > 0) setSelectedLead(data[0]);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredLeads = leads.filter(l => {
    const matchType = typeFilter === 'all' || l.lead_type === typeFilter;
    const matchSearch = l.full_name.toLowerCase().includes(search.toLowerCase()) ||
                        l.organization.toLowerCase().includes(search.toLowerCase()) ||
                        l.phone.includes(search);
    return matchType && matchSearch;
  });

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
          const updatedNotes = [...leadToUpdate.internal_notes, newNote];
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
      
      // Send email if selected
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

    const updatedNotes = [...selectedLead.internal_notes, newNote];
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-semibold">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Tất cả ({leads.length})
              </button>
              <button
                onClick={() => setTypeFilter('interest')}
                className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'interest' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Nhà đầu tư ({leads.filter(l => l.lead_type === 'interest').length})
              </button>
              <button
                onClick={() => setTypeFilter('submission')}
                className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'submission' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Ký gửi dự án ({leads.filter(l => l.lead_type === 'submission').length})
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
          </div>

          <button
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all shadow-md shrink-0"
          >
            <Download className="w-4 h-4" />
            Xuất Excel (.CSV)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
            <div className="p-4 bg-gray-50/80 border-b border-gray-200 text-xs font-bold uppercase text-gray-500 tracking-wider">
              Danh sách Lead ({filteredLeads.length})
            </div>

            <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
              {filteredLeads.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                      isSelected ? 'bg-amber-50/70 border-l-4 border-[#C4A35A]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
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
              })}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            {selectedLead ? (
              <>
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

                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 text-right">
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Cập nhật Trạng thái</label>
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
                          <span className="text-sm font-semibold text-gray-800">Tài liệu dự án (Teaser/Profile)</span>
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

                {/* Audit Logs / Activity History */}
                {selectedLead.audit_logs && selectedLead.audit_logs.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 border-t border-gray-200 pt-4">Lịch sử Hoạt động (Audit Log)</h3>
                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                      {selectedLead.audit_logs.map((log, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-blue-100 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded border border-gray-200 shadow-sm text-sm">
                            <div className="font-semibold text-gray-800 mb-1">{log.action}</div>
                            {log.file_url && <a href={log.file_url} className="text-xs text-blue-600 hover:underline break-all mb-1 block" target="_blank" rel="noopener noreferrer">Xem file</a>}
                            <time className="text-xs font-medium text-gray-400">{new Date(log.timestamp).toLocaleString('vi-VN')}</time>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internal Notes Section */}
                <div className="border-t border-gray-100 pt-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#C4A35A]" />
                    Ghi chú Nội bộ ({selectedLead.internal_notes.length})
                  </h3>

                  {/* Notes Timeline */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedLead.internal_notes.length > 0 ? (
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
                  <span className="text-xs text-gray-500">Hệ thống sẽ ghi chú "Đã gửi email" vào lịch sử (tính năng gửi email thật sẽ cập nhật sau).</span>
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
