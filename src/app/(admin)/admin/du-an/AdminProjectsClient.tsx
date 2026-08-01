'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Project } from '@/lib/types';
import { toggleProjectFeatured, toggleProjectPublishStatus, actionHideProject, bulkUpdateProjectPublishStatus, bulkHideProjects } from './actions';
import { formatDate } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Star, 
  Eye, 
  EyeOff, 
  Edit3, 
  FileDown,
  Loader2,
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';

export default function AdminProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [dealTypeFilter, setDealTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title_asc' | 'title_desc'>('newest');

  // Confirm Hide Modal State
  const [hideConfirmProject, setHideConfirmProject] = useState<Project | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, dealTypeFilter, statusFilter, startDate, endDate, sortBy]);

  // Filter projects (also filter out is_active === false)
  const filtered = projects.filter(p => {
    if (p.is_active === false) return false;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                        (p.project_code || '').toLowerCase().includes(search.toLowerCase()) ||
                        (p.province || '').toLowerCase().includes(search.toLowerCase());
    const matchDeal = dealTypeFilter === 'all' || p.deal_type === dealTypeFilter;
    const matchStatus = statusFilter === 'all' || p.publish_status === statusFilter;
    
    let matchDateRange = true;
    if (startDate || endDate) {
      const date = new Date(p.created_at);
      if (!isNaN(date.getTime())) {
        const dateStr = date.toISOString().split('T')[0];
        if (startDate && dateStr < startDate) matchDateRange = false;
        if (endDate && dateStr > endDate) matchDateRange = false;
      } else {
        matchDateRange = false;
      }
    }
    
    return matchSearch && matchDeal && matchStatus && matchDateRange;
  });

  // Sort projects after filtering
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === 'title_asc') {
      return a.title.localeCompare(b.title, 'vi');
    }
    if (sortBy === 'title_desc') {
      return b.title.localeCompare(a.title, 'vi');
    }
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedProjects = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Bulk Actions states & handlers
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const handleToggleSelectProject = (id: string, checked: boolean) => {
    setSelectedProjectIds(prev => checked ? [...prev, id] : prev.filter(item => item !== id));
  };

  const handleSelectAllProjects = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedProjects.map(p => p.id);
      setSelectedProjectIds(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedProjects.map(p => p.id);
      setSelectedProjectIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleBulkUpdatePublishStatus = async (newStatus: 'published' | 'hidden') => {
    if (selectedProjectIds.length === 0) return;
    if (!window.confirm(`Xác nhận đổi trạng thái hiển thị của ${selectedProjectIds.length} dự án đã chọn sang "${newStatus === 'published' ? 'Công khai' : 'Bị ẩn'}"?`)) return;

    setIsBulkProcessing(true);
    try {
      await bulkUpdateProjectPublishStatus(selectedProjectIds, newStatus);
      toast.success(`Đã cập nhật trạng thái hiển thị cho ${selectedProjectIds.length} dự án thành công!`);
      setSelectedProjectIds([]);
      // Update local state directly
      setProjects(prev => prev.map(p => selectedProjectIds.includes(p.id) ? { ...p, publish_status: newStatus } : p));
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi cập nhật hàng loạt.');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkHideProjects = async () => {
    if (selectedProjectIds.length === 0) return;
    if (!window.confirm(`Xác nhận ẩn/lưu trữ hàng loạt ${selectedProjectIds.length} dự án đã chọn?`)) return;

    setIsBulkProcessing(true);
    try {
      await bulkHideProjects(selectedProjectIds);
      toast.success(`Đã ẩn ${selectedProjectIds.length} dự án thành công!`);
      setSelectedProjectIds([]);
      // Update local state directly
      setProjects(prev => prev.map(p => selectedProjectIds.includes(p.id) ? { ...p, is_active: false, publish_status: 'hidden' as any } : p));
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi ẩn hàng loạt.');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Mã Dự án', 'Tên Dự án', 'Hình thức Giao dịch', 'Tỉnh/Thành', 'Quy mô', 'Hiện trạng', 'Trạng thái', 'Ngày tạo'];
    const rows = sorted.map(p => [
      p.project_code,
      `"${p.title.replace(/"/g, '""')}"`,
      p.deal_type === 'buyout' ? 'Chuyển nhượng 100%' : 'Hợp tác đầu tư',
      `"${p.province || ''}"`,
      `"${(p.scale || '').replace(/"/g, '""')}"`,
      `"${(p.current_status || '').replace(/"/g, '""')}"`,
      p.publish_status === 'published' ? 'Public' : 'Hidden',
      formatDate(p.created_at)
    ]);

    // Sử dụng \uFEFF ở đầu file CSV để Excel mở trực tiếp hiển thị Unicode tiếng Việt chuẩn
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MNA_Projects_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFeatured = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const newStatus = !project.is_featured;
    
    setLoadingId(`featured_${id}`);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, is_featured: newStatus } : p));
    
    try {
      await toggleProjectFeatured(id, newStatus);
    } catch (error) {
      console.error(error);
      setProjects(prev => prev.map(p => p.id === id ? { ...p, is_featured: project.is_featured } : p));
    } finally {
      setLoadingId(null);
    }
  };

  const handleTogglePublishStatus = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const newStatus = project.publish_status === 'published' ? 'hidden' : 'published';
    
    setLoadingId(`publish_${id}`);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, publish_status: newStatus } : p));
    
    try {
      await toggleProjectPublishStatus(id, newStatus);
    } catch (error) {
      console.error(error);
      setProjects(prev => prev.map(p => p.id === id ? { ...p, publish_status: project.publish_status } : p));
    } finally {
      setLoadingId(null);
    }
  };

  const handleConfirmHide = async () => {
    if (!hideConfirmProject) return;
    const id = hideConfirmProject.id;
    setLoadingId(`hide_${id}`);
    try {
      await actionHideProject(id);
      toast.success('Đã ẩn dự án thành công!');
      setProjects(prev => prev.filter(p => p.id !== id));
      setHideConfirmProject(null);
    } catch (error) {
      console.error(error);
      toast.error('Không thể ẩn dự án lúc này');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex-1 pb-16">
      <AdminHeader 
        title="Quản lý Danh mục Dự án" 
        subtitle="Đăng bài, chỉnh sửa, ẩn/hiện dự án, ghim Dự án Tâm điểm và cập nhật Teaser PDF" 
      />

      <main className="px-8 py-8 space-y-6 max-w-7xl">
        {/* Action Header */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
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

            {/* Sorting Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#C4A35A]"
            >
              <option value="newest">Mới nhất (Newest)</option>
              <option value="oldest">Cũ nhất (Oldest)</option>
              <option value="title_asc">Tên A-Z</option>
              <option value="title_desc">Tên Z-A</option>
            </select>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700">
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

          <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
            <button
              onClick={handleExportCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-md shrink-0 w-full sm:w-auto justify-center"
            >
              <FileDown className="w-4 h-4" />
              Xuất Excel (.CSV)
            </button>

            <Link
              href="/admin/du-an/taomoi"
              className="bg-[#C4A35A] hover:bg-[#b09048] text-[#0A1628] font-bold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-md shrink-0 w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              Đăng Dự án Mới
            </Link>
          </div>
        </div>

        {/* Floating Bulk Actions Bar */}
        {selectedProjectIds.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-50/80 border border-amber-200 p-4 rounded-xl shadow-sm animate-fadeIn mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-800">
                Đã chọn {selectedProjectIds.length} dự án
              </span>
              <button
                onClick={() => setSelectedProjectIds([])}
                className="text-xs text-gray-500 hover:text-gray-700 underline font-semibold"
              >
                Bỏ chọn
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              {isBulkProcessing && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mr-2 animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Đang xử lý...
                </div>
              )}
              <button
                onClick={() => handleBulkUpdatePublishStatus('published')}
                disabled={isBulkProcessing}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border border-emerald-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all disabled:opacity-50"
              >
                <Eye className="w-3.5 h-3.5" />
                Công khai hàng loạt
              </button>
              <button
                onClick={() => handleBulkUpdatePublishStatus('hidden')}
                disabled={isBulkProcessing}
                className="bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all disabled:opacity-50"
              >
                <EyeOff className="w-3.5 h-3.5" />
                Ẩn hiển thị hàng loạt
              </button>
              <button
                onClick={handleBulkHideProjects}
                disabled={isBulkProcessing}
                className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border border-red-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Ẩn & Lưu trữ hàng loạt
              </button>
            </div>
          </div>
        )}

        {/* Projects Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={paginatedProjects.length > 0 && paginatedProjects.every(p => selectedProjectIds.includes(p.id))}
                      onChange={(e) => handleSelectAllProjects(e.target.checked)}
                      className="w-4 h-4 text-[#C4A35A] rounded border-gray-300 focus:ring-[#C4A35A] cursor-pointer"
                    />
                  </th>
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
                  {paginatedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={selectedProjectIds.includes(project.id)}
                          onChange={(e) => handleToggleSelectProject(project.id, e.target.checked)}
                          className="w-4 h-4 text-[#C4A35A] rounded border-gray-300 focus:ring-[#C4A35A] cursor-pointer"
                        />
                      </td>
                      {/* Featured Star Toggle */}
                      <td className="py-4 px-6">
                      <button
                        onClick={() => toggleFeatured(project.id)}
                        disabled={loadingId === `featured_${project.id}`}
                        title={project.is_featured ? "Hủy ghim tâm điểm" : "Ghim dự án tâm điểm"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          project.is_featured ? 'text-[#C4A35A] bg-[#C4A35A]/10' : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        {loadingId === `featured_${project.id}` ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Star className="w-5 h-5 fill-current" />
                        )}
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
                        <a 
                          href={project.teaser_pdf.startsWith('http') ? project.teaser_pdf : `/uploads/${project.teaser_pdf}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium hover:underline"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          Xem PDF
                        </a>
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
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/du-an/${project.id}/sua`}
                          title="Chỉnh sửa dự án"
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-amber-50 hover:text-[#C4A35A] transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        {/* Toggle Publish Status */}
                        <button
                          onClick={() => handleTogglePublishStatus(project.id)}
                          disabled={loadingId === `publish_${project.id}`}
                          title={project.publish_status === 'published' ? "Ẩn bài" : "Công khai bài"}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          {loadingId === `publish_${project.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          ) : project.publish_status === 'published' ? (
                            <EyeOff className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Eye className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>

                        {/* View Public Page */}
                        <Link
                          href={`/du-an/${project.slug}`}
                          target="_blank"
                          title="Xem trang công khai"
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Hide Project Button (Soft Delete / Lưu trữ) */}
                        <button
                          onClick={() => setHideConfirmProject(project)}
                          title="Xóa/Lưu trữ dự án"
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                 ))}
                {paginatedProjects.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Không tìm thấy dự án phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Trang trước
              </button>
              <span className="font-medium">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </main>

      {/* CONFIRM HIDE MODAL */}
      {hideConfirmProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600 border-b border-gray-100 pb-3">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-gray-900">Xác nhận Xóa/Lưu trữ</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa/lưu trữ dự án <strong className="text-gray-900">"{hideConfirmProject.title}"</strong> ({hideConfirmProject.project_code}) không? 
              Dự án sẽ bị vô hiệu hóa hoàn toàn trong hệ thống và không thể xem trực tiếp.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setHideConfirmProject(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Hủy
              </button>
              <button 
                onClick={handleConfirmHide} 
                disabled={loadingId === `hide_${hideConfirmProject.id}`}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 shadow-sm"
              >
                {loadingId === `hide_${hideConfirmProject.id}` ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
