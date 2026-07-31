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
  ShieldAlert,
  MessageSquare,
  Edit3
} from 'lucide-react';

export const revalidate = 0; // always dynamic for admin

function formatActivityTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

export default async function AdminDashboardPage() {
  const projects = await getProjects();
  const publishedProjects = projects.filter(p => p.publish_status === 'published');
  const featuredProjects = projects.filter(p => p.is_featured);

  const allLeads = await getLeads();
  const activeLeads = allLeads.filter(l => l.is_active !== false);

  const totalLeads = activeLeads.length;
  const newLeadsCount = activeLeads.filter(l => l.status === 'new' || l.status === 'draft_pending').length;
  const vdrCount = activeLeads.filter(l => ['nda_sent', 'due_diligence', 'closed_won'].includes(l.status)).length;

  // 1. Nhóm số lượng lead nhận được trong 6 tháng gần nhất từ activeLeads
  const now = new Date();
  const monthlyLeads: Array<{ year: number; month: number; label: string; count: number }> = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyLeads.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: `Tháng ${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`,
      count: 0
    });
  }

  activeLeads.forEach(lead => {
    if (!lead.created_at) return;
    const leadDate = new Date(lead.created_at);
    if (!isNaN(leadDate.getTime())) {
      const leadYear = leadDate.getFullYear();
      const leadMonth = leadDate.getMonth();
      const match = monthlyLeads.find(m => m.year === leadYear && m.month === leadMonth);
      if (match) {
        match.count += 1;
      }
    }
  });

  const maxCount = Math.max(...monthlyLeads.map(m => m.count), 1);

  // 2. Thu thập hoạt động gần đây từ dữ liệu thực tế
  interface Activity {
    id: string;
    type: 'lead_created' | 'lead_audit' | 'lead_note' | 'project_created' | 'project_updated';
    text: string;
    time: Date;
    link: string;
  }
  const activities: Activity[] = [];

  // Thu thập hoạt động từ leads
  allLeads.forEach(lead => {
    if (lead.is_active === false) return;
    
    // Tạo lead mới
    if (lead.created_at) {
      activities.push({
        id: `lead-create-${lead.id}`,
        type: 'lead_created',
        text: `Lead mới từ ${lead.full_name} - ${lead.organization}`,
        time: new Date(lead.created_at),
        link: '/admin/leads'
      });
    }

    // Sự kiện audit log (Trạng thái thay đổi trong VDR hoặc Leads)
    if (Array.isArray(lead.audit_logs)) {
      lead.audit_logs.forEach((log, index) => {
        if (log.timestamp) {
          activities.push({
            id: `lead-audit-${lead.id}-${index}`,
            type: 'lead_audit',
            text: `Cập nhật lead ${lead.full_name}: ${log.action}`,
            time: new Date(log.timestamp),
            link: '/admin/leads'
          });
        }
      });
    }

    // Ghi chú nội bộ
    if (Array.isArray(lead.internal_notes)) {
      lead.internal_notes.forEach((note, index) => {
        if (note.timestamp) {
          let dateStr = note.timestamp;
          if (!dateStr.includes('T') && dateStr.includes(' ')) {
            dateStr = dateStr.replace(' ', 'T') + ':00';
          }
          const noteTime = new Date(dateStr);
          if (!isNaN(noteTime.getTime())) {
            activities.push({
              id: `lead-note-${lead.id}-${index}`,
              type: 'lead_note',
              text: `Ghi chú cho lead ${lead.full_name}: "${note.text.length > 40 ? note.text.slice(0, 40) + '...' : note.text}"`,
              time: noteTime,
              link: '/admin/leads'
            });
          }
        }
      });
    }
  });

  // Thu thập hoạt động từ projects
  projects.forEach(project => {
    if (project.is_active === false) return;

    if (project.created_at) {
      activities.push({
        id: `project-create-${project.id}`,
        type: 'project_created',
        text: `Dự án mới: [${project.project_code}] - ${project.title}`,
        time: new Date(project.created_at),
        link: '/admin/du-an'
      });
    }

    if (project.updated_at && project.created_at) {
      const createdTime = new Date(project.created_at).getTime();
      const updatedTime = new Date(project.updated_at).getTime();
      if (Math.abs(updatedTime - createdTime) > 60000) {
        activities.push({
          id: `project-update-${project.id}`,
          type: 'project_updated',
          text: `Cập nhật dự án: [${project.project_code}] - ${project.title}`,
          time: new Date(project.updated_at),
          link: '/admin/du-an'
        });
      }
    }
  });

  const sortedActivities = activities
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 8);

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

        {/* Statistics Chart & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Monthly Lead Chart (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-serif">Thống kê Lead theo Tháng</h3>
                <p className="text-xs text-gray-500">Số lượng lead (Yêu cầu & Ký gửi) nhận được trong 6 tháng gần đây</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="inline-block w-3 h-3 bg-gradient-to-t from-[#0A1628] to-[#C4A35A] rounded-sm"></span>
                <span>Số lượng lead</span>
              </div>
            </div>

            <div className="flex items-end justify-between h-56 pt-6 pb-2 px-4 border-b border-gray-100 relative">
              {monthlyLeads.map((item, idx) => {
                const heightPercent = item.count > 0 ? (item.count / maxCount) * 100 : 4;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 group relative h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute bottom-[calc(heightPercent+10px)] mb-2 scale-0 group-hover:scale-100 transition-all duration-200 bg-[#0A1628] text-[#C4A35A] text-[10px] font-bold px-2 py-1 rounded shadow-md z-10 whitespace-nowrap pointer-events-none">
                      {item.count} Lead{item.count > 1 ? 's' : ''}
                    </div>
                    
                    {/* Bar graphic */}
                    <div 
                      style={{ height: `${heightPercent}%` }} 
                      className="w-10 sm:w-14 bg-gradient-to-t from-[#0A1628] to-[#C4A35A] rounded-t-md hover:from-[#C4A35A] hover:to-[#0A1628] transition-all duration-300 shadow-sm cursor-pointer relative"
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 group-hover:hidden">
                        {item.count}
                      </span>
                    </div>
                    
                    {/* Label */}
                    <span className="text-[10px] sm:text-xs text-gray-500 font-semibold mt-2.5">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activities (1 col) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
            <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 font-serif">Hoạt động Gần đây</h3>
                <span className="text-[9px] font-bold uppercase bg-amber-50 text-[#C4A35A] px-2 py-0.5 rounded border border-[#C4A35A]/20 tracking-wider">
                  Live Logs
                </span>
              </div>

              <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                {sortedActivities.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center py-8">Chưa có hoạt động nào.</div>
                ) : (
                  sortedActivities.map((act) => {
                    let IconComponent = Clock;
                    let iconColor = 'bg-gray-100 text-gray-600';
                    if (act.type === 'lead_created') {
                      IconComponent = Users;
                      iconColor = 'bg-[#C4A35A]/10 text-[#C4A35A]';
                    } else if (act.type === 'lead_audit') {
                      IconComponent = ShieldAlert;
                      iconColor = 'bg-purple-50 text-purple-700 border border-purple-100';
                    } else if (act.type === 'lead_note') {
                      IconComponent = MessageSquare;
                      iconColor = 'bg-blue-50 text-blue-700 border border-blue-100';
                    } else if (act.type === 'project_created') {
                      IconComponent = Building2;
                      iconColor = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
                    } else if (act.type === 'project_updated') {
                      IconComponent = Edit3;
                      iconColor = 'bg-amber-50 text-amber-700 border border-amber-100';
                    }

                    return (
                      <div key={act.id} className="flex gap-3 text-xs leading-relaxed items-start">
                        <div className={`p-1.5 rounded-lg shrink-0 ${iconColor}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={act.link} className="font-semibold text-gray-800 hover:text-[#C4A35A] transition-colors block truncate">
                            {act.text}
                          </Link>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{formatActivityTime(act.time)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-3 mt-4 text-center">
              <span className="text-[10px] text-gray-400">Tự động làm mới theo cơ sở dữ liệu thực</span>
            </div>
          </div>
        </div>

        {/* Existing Content Layout Grid (Now Secondary) */}
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
