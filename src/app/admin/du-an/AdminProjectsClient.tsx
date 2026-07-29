'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Project } from '@/lib/types';
import { toggleProjectFeatured, toggleProjectPublishStatus } from './actions';
import { 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  FileDown,
  Building2
} from 'lucide-react';

export default function AdminProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [dealTypeFilter, setDealTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter projects
  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                        p.project_code.toLowerCase().includes(search.toLowerCase()) ||
                        p.province.toLowerCase().includes(search.toLowerCase());
    const matchDeal = dealTypeFilter === 'all' || p.deal_type === dealTypeFilter;
    const matchStatus = statusFilter === 'all' || p.publish_status === statusFilter;
    return matchSearch && matchDeal && matchStatus;
  });

  const toggleFeatured = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const newStatus = !project.is_featured;
    
    // Optimistic UI update
    setProjects(prev => prev.map(p => p.id === id ? { ...p, is_featured: newStatus } : p));
    
    try {
      await toggleProjectFeatured(id, newStatus);
    } catch (error) {
      console.error(error);
      // Revert on error
      setProjects(prev => prev.map(p => p.id === id ? { ...p, is_featured: project.is_featured } : p));
    }
  };

  const handleTogglePublishStatus = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const newStatus = project.publish_status === 'published' ? 'hidden' : 'published';
    
    // Optimistic UI update
    setProjects(prev => prev.map(p => p.id === id ? { ...p, publish_status: newStatus } : p));
    
    try {
      await toggleProjectPublishStatus(id, newStatus);
    } catch (error) {
      console.error(error);
      // Revert on error
      setProjects(prev => prev.map(p => p.id === id ? { ...p, publish_status: project.publish_status } : p));
    }
  };

  return (
    <div className="flex-1 pb-16">
      <AdminHeader 
        title="Quản lý Danh mục Dự án" 
        subtitle="Đăng bài, ẩn/hiện dự án, ghim Dự án Tâm điểm và cập nhật Teaser PDF" 
      />

      <main className="px-8 py-8 space-y-6 max-w-7xl">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã hoặc tên dự án..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#C4A35A]"
              />
            </div>

            {/* Filter Deal Type */}
            <select
              value={dealTypeFilter}
              onChange={(e) => setDealTypeFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#C4A35A]"
            >
              <option value="all">Tất cả hình thức</option>
              <option value="buyout">Chuyển nhượng 100%</option>
              <option value="joint_venture">Hợp tác đầu tư</option>
            </select>

            {/* Filter Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#C4A35A]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đang công khai (Published)</option>
              <option value="draft">Nháp (Draft)</option>
              <option value="hidden">Đã ẩn (Hidden)</option>
            </select>
          </div>

          <Link
            href="/admin/du-an/taomoi"
            className="bg-[#C4A35A] hover:bg-[#b09048] text-[#0A1628] font-bold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-md shrink-0 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Đăng Dự án Mới
          </Link>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6">Tâm điểm</th>
                  <th className="py-4 px-6">Mã & Tên Dự án</th>
                  <th className="py-4 px-6">Loại Giao dịch</th>
                  <th className="py-4 px-6">Vị trí & Quy mô</th>
                  <th className="py-4 px-6">Teaser PDF</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Featured Star Toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleFeatured(project.id)}
                        title={project.is_featured ? "Hủy ghim tâm điểm" : "Ghim dự án tâm điểm"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          project.is_featured ? 'text-[#C4A35A] bg-[#C4A35A]/10' : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    </td>

                    {/* Code & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200">
                          {project.project_code}
                        </span>
                        <div>
                          <Link 
                            href={`/du-an/${project.slug}`} 
                            target="_blank"
                            className="font-bold text-gray-900 hover:text-[#C4A35A] transition-colors"
                          >
                            {project.title}
                          </Link>
                          <div className="text-xs text-gray-400 mt-0.5">{project.status_label}</div>
                        </div>
                      </div>
                    </td>

                    {/* Deal Type Badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${
                        project.deal_type === 'buyout' 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {project.deal_type === 'buyout' ? 'Chuyển nhượng 100%' : 'Hợp tác đầu tư'}
                      </span>
                    </td>

                    {/* Location & Scale */}
                    <td className="py-4 px-6">
                      <div className="text-xs font-medium text-gray-900">{project.province}</div>
                      <div className="text-xs text-gray-500">{project.scale}</div>
                    </td>

                    {/* Teaser PDF */}
                    <td className="py-4 px-6">
                      {project.teaser_pdf ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                          <FileDown className="w-3.5 h-3.5" />
                          Đã tải PDF
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 font-normal">Chưa có</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        project.publish_status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {project.publish_status === 'published' ? 'Public' : 'Hidden'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublishStatus(project.id)}
                          title={project.publish_status === 'published' ? "Ẩn bài" : "Công khai bài"}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                          {project.publish_status === 'published' ? (
                            <EyeOff className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Eye className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>

                        <Link
                          href={`/du-an/${project.slug}`}
                          target="_blank"
                          title="Xem trang công khai"
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
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
