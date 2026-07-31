'use client';

import React, { useState } from 'react';
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
}

export default function VDRManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [signatures, setSignatures] = useState<NDASignature[]>([]);

  React.useEffect(() => {
    fetch('/api/leads', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          // Map leads with signatures or specific status to NDA list
          const ndaList = data
            .filter(l => l.lead_type === 'interest' && ['nda_sent', 'due_diligence', 'closed_won'].includes(l.status))
            .map(l => ({
              id: l.id,
              project_code: l.related_project_title?.split(' ')[0] || 'Unknown',
              full_name: l.full_name,
              org: l.organization,
              email: l.email,
              ip_address: 'Hidden for privacy',
              user_agent: 'Hidden for privacy',
              agreed_to_pdpd: true,
              signed_at: l.created_at,
              status: l.status === 'due_diligence' || l.status === 'closed_won' ? 'approved' : 'pending',
              signature_url: l.signature_url
            }));
          setSignatures(ndaList);
        }
      });
  }, []);

  const filteredSignatures = signatures.filter(s => 
    (s.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.project_code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Tìm kiếm theo Tên, Email hoặc Mã dự án..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A35A] focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              Xuất Log Kiểm toán (Audit)
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
                {filteredSignatures.map((sig) => (
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
                      <button className="p-2 text-gray-400 hover:text-[#C4A35A] transition-colors rounded-lg hover:bg-[#C4A35A]/10" title="Xem chữ ký tay">
                        <FileSignature className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
