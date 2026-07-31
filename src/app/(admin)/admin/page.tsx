import React from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getProjects } from '@/lib/projects-store';
import { getLeads } from '@/lib/leads-store';
import { formatDate, getLeadStatusLabel } from '@/lib/utils';
import { 
  Building2, 
  Users, 
  FileCheck2, 
  TrendingUp, 
  PlusCircle, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

export const revalidate = 0; // always dynamic for admin

export default async function AdminDashboardPage() {
  const projects = await getProjects();
  const publishedProjects = projects.filter(p => p.publish_status === 'published');
  const featuredProjects = projects.filter(p => p.is_featured);

  const allLeads = await getLeads();
  const activeLeads = allLeads.filter(l => l.is_active !== false);

  const totalLeads = activeLeads.length;
  const newLeadsCount = activeLeads.filter(l => l.status === 'new' || l.status === 'draft_pending').length;
  const vdrCount = activeLeads.filter(l => ['nda_sent', 'due_diligence', 'closed_won'].includes(l.status)).length;

  // Real statistics
  const stats = [
    {
      title: 'Tổng số Dự án',
      value: projects.length,
      sub: `${publishedProjects.length} đang công khai`,
      icon: Building2,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Tổng Lead thu thập',
      value: totalLeads,
      sub: 'Yêu cầu & Ký gửi',
      icon: Users,
      color: 'bg-[#C4A35A]/10 text-[#C4A35A]',
    },
    {
      title: 'Lead mới cần xử lý',
      value: newLeadsCount,
      sub: 'Cần liên hệ trong 24h',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      title: 'Dự án Tâm điểm',
      value: featuredProjects.length,
      sub: 'Hiển thị trang chủ',
      icon: FileCheck2,
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      title: 'Truy cập VDR',
      value: vdrCount,
      sub: 'Đã ký NDA điện tử',
      icon: ShieldAlert,
      color: 'bg-purple-500/10 text-purple-600',
    },
  ];

  const recentActiveLeads = activeLeads.slice(0, 5);

  return (
    <div className="flex-1 pb-16">
      <AdminHeader 
        title="Tổng quan Hệ thống" 
        subtitle="Bảng theo dõi dự án M&A và luồng quản lý Lead thu thập" 
      />

      <main className="px-8 py-8 space-y-8 max-w-7xl">
        {/* Quick Action Bar */}
        <div className="flex items-center justify-between bg-[#0A1628] text-white p-6 rounded-xl shadow-lg">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#C4A35A]">Chào mừng trở lại, Super Admin</h2>
            <p className="text-xs text-gray-300 mt-1">Hệ thống đang hoạt động bình thường trên hạ tầng Supabase Cloud.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/du-an/taomoi"
              className="bg-[#C4A35A] hover:bg-[#b09048] text-[#0A1628] font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              Thêm Dự án mới
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">{stat.title}</span>
                  <div className={`p-2.5 rounded-lg ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 font-serif mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 font-medium">{stat.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Leads Table (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-serif">Lead Thu thập Gần đây</h3>
                <p className="text-xs text-gray-500">Các yêu cầu thông tin và ký gửi mới nhất từ website</p>
              </div>
              <Link 
                href="/admin/leads" 
                className="text-xs font-bold text-[#C4A35A] hover:text-[#0A1628] flex items-center gap-1 transition-colors"
              >
                Xem tất cả ({totalLeads})
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Người gửi / Đơn vị</th>
                    <th className="py-3 px-4">Loại Lead</th>
                    <th className="py-3 px-4">Dự án quan tâm</th>
                    <th className="py-3 px-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentActiveLeads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">Không có lead nào gần đây.</td>
                    </tr>
                  ) : (
                    recentActiveLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900">{lead.full_name}</div>
                          <div className="text-xs text-gray-400">{lead.organization}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${
                            lead.lead_type === 'interest' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {lead.lead_type === 'interest' ? 'Nhà đầu tư' : 'Ký gửi dự án'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-gray-700 max-w-[200px] truncate">
                          {lead.related_project_title || lead.project_name_location || 'Dự án chung'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            lead.status === 'new' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                            lead.status === 'draft_pending' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {lead.status === 'new' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                            {getLeadStatusLabel(lead.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Published Projects List (1 col) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-serif">Dự án Đang Đăng</h3>
                <p className="text-xs text-gray-500">Hiển thị công khai trên website</p>
              </div>
              <Link href="/admin/du-an" className="text-xs font-bold text-[#C4A35A] hover:underline">
                Quản lý
              </Link>
            </div>

            <div className="space-y-4">
              {publishedProjects.slice(0, 4).map((p) => (
                <div key={p.id} className="p-3.5 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                        {p.project_code}
                      </span>
                      {p.is_featured && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#C4A35A] text-[#0A1628]">
                          Tâm điểm
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-gray-900 truncate mt-1">{p.title}</div>
                    <div className="text-[11px] text-gray-500">{p.province} • {p.scale}</div>
                  </div>
                  <span className="shrink-0 text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-800 rounded">
                    Public
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
