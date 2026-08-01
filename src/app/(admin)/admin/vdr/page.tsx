'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ShieldAlert, Search, FileSignature, CheckCircle2, XCircle, Download, Eye, AlertCircle } from 'lucide-react';


interface NDASignature {
  id: string;
  project_code: string;
  full_name: string;
  org: string;
  email: string;
  ip_address: string;
  user_agent: string;
  agreed_to_pdpd: boolean;
  signed_at: string;
  status: string;
  signature_url?: string;
  internal_notes?: any[];
}

export default function VDRManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [signatures, setSignatures] = useState<NDASignature[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, projectFilter, startDate, endDate]);

  // Modal States
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    sigId: string;
    action: 'approve' | 'reject' | 'revoke';
    fullName: string;
  } | null>(null);

  const [signatureModal, setSignatureModal] = useState<{
    isOpen: boolean;
    signatureUrl?: string;
    fullName: string;
  } | null>(null);

  const fetchSignatures = () => {
    fetch('/api/leads', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          const ndaList = data
            .filter(l => l.lead_type === 'interest' && ['nda_sent', 'due_diligence', 'closed_won', 'rejected'].includes(l.status))
            .map(l => ({
              id: l.id,
              project_code: l.related_project_title?.split(' ')[0] || 'Unknown',
              full_name: l.full_name,
              org: l.organization,
              email: l.email,
              ip_address: l.ip_address || 'Hidden for privacy',
              user_agent: l.user_agent || 'Hidden for privacy',
              agreed_to_pdpd: true,
              signed_at: l.created_at,
              status: l.status === 'due_diligence' || l.status === 'closed_won' 
                ? 'approved' 
                : l.status === 'rejected' 
                  ? 'rejected' 
                  : 'pending',
              signature_url: l.signature_url,
              internal_notes: l.internal_notes || []
            }));
          setSignatures(ndaList);
        }
      });
  };

  React.useEffect(() => {
    fetchSignatures();
  }, []);

  const projectCodes = React.useMemo(() => {
    const codes = new Set<string>();
    signatures.forEach(s => {
      if (s.project_code) codes.add(s.project_code);
    });
    return Array.from(codes).sort();
  }, [signatures]);

  const triggerUpdateStatus = (sigId: string, fullName: string, action: 'approve' | 'reject' | 'revoke') => {
    setConfirmModal({
      isOpen: true,
      sigId,
      action,
      fullName
    });
  };

  const handleConfirmUpdate = async () => {
    if (!confirmModal) return;
    const { sigId, action } = confirmModal;
    setConfirmModal(null);
    setUpdatingId(sigId);

    const sig = signatures.find(s => s.id === sigId);
    if (!sig) return;

    let targetLeadStatus: string = 'nda_sent';
    let actionText = '';
    
    if (action === 'approve') {
      targetLeadStatus = 'due_diligence';
      actionText = 'Duyệt quyền truy cập VDR';
    } else if (action === 'reject') {
      targetLeadStatus = 'rejected';
      actionText = 'Từ chối quyền truy cập VDR';
    } else if (action === 'revoke') {
      targetLeadStatus = 'nda_sent';
      actionText = 'Thu hồi quyền truy cập VDR';
    }

    const timestamp = new Date().toLocaleString('vi-VN');
    const newNote = {
      text: `Admin thực hiện: ${actionText} lúc ${timestamp}`,
      author: 'Super Admin',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    const updatedNotes = [...(sig.internal_notes || []), newNote];

    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sigId,
          updates: {
            status: targetLeadStatus,
            internal_notes: updatedNotes
          }
        })
      });

      if (res.ok) {
        setSignatures(prev => prev.map(s => {
          if (s.id === sigId) {
            return {
              ...s,
              status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending',
              internal_notes: updatedNotes
            };
          }
          return s;
        }));
        toast.success(`Đã ${action === 'approve' ? 'duyệt' : action === 'reject' ? 'từ chối' : 'thu hồi'} quyền truy cập VDR thành công!`);
      } else {
        toast.error('Cập nhật trạng thái thất bại');
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi cập nhật');
    } finally {
      setUpdatingId(null);
    }
  };

  const openSignatureModal = (fullName: string, signatureUrl?: string) => {
    setSignatureModal({
      isOpen: true,
      signatureUrl,
      fullName
    });
  };

  const handleExportAuditCSV = () => {
    const headers = ['Mã Lead', 'Nhà đầu tư', 'Đơn vị', 'Email', 'Dự án yêu cầu', 'IP Address', 'Trạng thái', 'Thời gian ký'];
    const rows = filteredSignatures.map(s => [
      s.id,
      `"${s.full_name}"`,
      `"${s.org}"`,
      s.email,
      s.project_code,
      s.ip_address,
      s.status === 'approved' ? 'Đã cấp quyền' : s.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt',
      new Date(s.signed_at).toLocaleString('vi-VN')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VDR_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSignatures = signatures.filter(s => {
    const matchSearch = (s.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (s.project_code || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchProject = projectFilter === 'all' || s.project_code === projectFilter;
    
    let matchDateRange = true;
    if (startDate || endDate) {
      const date = new Date(s.signed_at);
      if (!isNaN(date.getTime())) {
        const dateStr = date.toISOString().split('T')[0];
        if (startDate && dateStr < startDate) matchDateRange = false;
        if (endDate && dateStr > endDate) matchDateRange = false;
      } else {
        matchDateRange = false;
      }
    }
    
    return matchSearch && matchProject && matchDateRange;
  });

  const totalPages = Math.ceil(filteredSignatures.length / itemsPerPage);
  const paginatedSignatures = filteredSignatures.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex-1 pb-16 bg-gray-50 min-h-screen">
      <AdminHeader 
        title="Quản lý Virtual Data Room (VDR)" 
        subtitle="Giám sát truy cập hồ sơ mật & Quản lý Thỏa thuận bảo mật (NDA)" 
      />

      <main className="px-8 py-8 space-y-6 max-w-7xl">
        
        {/* Security Banner */}
        <div className="bg-purple-900 text-white p-5 rounded-xl flex items-start gap-4 shadow-md">
          <ShieldAlert className="w-8 h-8 text-purple-300 shrink-0" />
          <div>
            <h3 className="font-bold text-lg font-serif">Chế độ Tuân thủ Nghị định 13/2023 & Luật Dữ liệu 2025</h3>
            <p className="text-sm text-purple-200 mt-1">Toàn bộ dữ liệu hiển thị bên dưới (bao gồm Email, CCCD) được lưu vết theo cơ chế băm (hashed) nhằm bảo vệ dữ liệu cá nhân của nhà đầu tư. Watermark tự động được kích hoạt cho mọi phiên tải xuống.</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Tìm kiếm theo Tên, Email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A35A] focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4A35A] text-gray-700 w-full sm:w-auto min-w-[150px]"
            >
              <option value="all">Tất cả dự án</option>
              {projectCodes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 w-full sm:w-auto">
              <span className="text-gray-500 font-medium">Từ</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent focus:outline-none text-gray-700 w-[115px]"
              />
              <span className="text-gray-500 font-medium">đến</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent focus:outline-none text-gray-700 w-[115px]"
              />
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="text-red-500 hover:text-red-700 font-semibold ml-1 shrink-0"
                  title="Xóa bộ lọc ngày"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button 
              onClick={handleExportAuditCSV}
              className="px-4 py-2 bg-[#0A1628] hover:bg-[#1E2D42] text-[#C4A35A] font-bold rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-[#C4A35A]" />
              Xuất Log Kiểm toán (CSV)
            </button>
          </div>
        </div>

        {/* NDA Signatures Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Danh sách Nhà đầu tư đã ký NDA</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500">
                  <th className="px-5 py-3 font-semibold">Nhà đầu tư</th>
                  <th className="px-5 py-3 font-semibold">Dự án yêu cầu</th>
                  <th className="px-5 py-3 font-semibold">Thông tin Lưu vết (Audit)</th>
                  <th className="px-5 py-3 font-semibold">Thời gian ký</th>
                  <th className="px-5 py-3 font-semibold text-center">Tình trạng</th>
                  <th className="px-5 py-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedSignatures.map((sig) => (
                  <tr key={sig.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{sig.full_name}</div>
                      <div className="text-sm text-gray-500">{sig.org}</div>
                      <div className="text-xs text-gray-400 mt-1">{sig.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {sig.project_code}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs text-gray-600 font-mono">IP: {sig.ip_address}</div>
                      <div className="text-xs text-gray-400 mt-1 max-w-[150px] truncate" title={sig.user_agent}>
                        {sig.user_agent}
                      </div>
                      {sig.agreed_to_pdpd && (
                        <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Đã đồng ý PDPD
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {new Date(sig.signed_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {sig.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3" /> Đã cấp quyền
                        </span>
                      )}
                      {sig.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700">
                          <AlertCircle className="w-3 h-3" /> Chờ duyệt
                        </span>
                      )}
                      {sig.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">
                          <XCircle className="w-3 h-3" /> Từ chối
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sig.status === 'pending' && (
                          <>
                            <button
                              disabled={updatingId !== null}
                              onClick={() => triggerUpdateStatus(sig.id, sig.full_name, 'approve')}
                              className="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              Duyệt
                            </button>
                            <button
                              disabled={updatingId !== null}
                              onClick={() => triggerUpdateStatus(sig.id, sig.full_name, 'reject')}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                        {sig.status === 'approved' && (
                          <button
                            disabled={updatingId !== null}
                            onClick={() => triggerUpdateStatus(sig.id, sig.full_name, 'revoke')}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                          >
                            Thu hồi quyền
                          </button>
                        )}
                        {sig.status === 'rejected' && (
                          <button
                            disabled={updatingId !== null}
                            onClick={() => triggerUpdateStatus(sig.id, sig.full_name, 'approve')}
                            className="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                          >
                            Cấp lại quyền
                          </button>
                        )}
                        
                        <button 
                          onClick={() => openSignatureModal(sig.full_name, sig.signature_url)}
                          className="p-2 text-gray-500 hover:text-[#C4A35A] transition-colors rounded-lg hover:bg-[#C4A35A]/10" 
                          title="Xem chữ ký tay"
                        >
                          {updatingId === sig.id ? (
                            <div className="w-5 h-5 border-2 border-[#C4A35A] border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FileSignature className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                Trang trước
              </button>
              <span className="font-semibold">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>

      </main>

      {/* CONFIRM ACTION MODAL */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#C4A35A]" />
                Xác nhận hành động VDR
              </h3>
              <button onClick={() => setConfirmModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 leading-relaxed">
                Bạn có chắc chắn muốn {
                  confirmModal.action === 'approve' ? <strong className="text-green-700">Duyệt cấp quyền</strong> : 
                  confirmModal.action === 'reject' ? <strong className="text-red-700">Từ chối quyền</strong> : 
                  <strong className="text-amber-700">Thu hồi quyền</strong>
                } truy cập hồ sơ mật VDR cho nhà đầu tư <strong className="text-gray-900">{confirmModal.fullName}</strong> không?
              </p>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleConfirmUpdate}
                className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors shadow-sm ${
                  confirmModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  confirmModal.action === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIGNATURE HANDWRITTEN VIEW MODAL */}
      {signatureModal && signatureModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900">Chữ ký tay của {signatureModal.fullName}</h3>
              <button onClick={() => setSignatureModal(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
              {signatureModal.signatureUrl ? (
                <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg p-4 flex justify-center items-center w-full">
                  <img 
                    src={signatureModal.signatureUrl} 
                    alt={`Chữ ký của ${signatureModal.fullName}`} 
                    className="max-h-48 object-contain" 
                  />
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <FileSignature className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  Không tìm thấy chữ ký
                </div>
              )}
            </div>
            <div className="flex justify-end p-4 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => setSignatureModal(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
