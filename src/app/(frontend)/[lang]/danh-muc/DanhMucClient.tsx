'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Project } from '@/lib/types';
import { SearchX, SlidersHorizontal } from 'lucide-react';

// Helper components
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { ShimmerLine } from '@/components/animations/ShimmerLine';

import { MasterDataItem, MdProvince } from '@/lib/master-data-store';

interface DanhMucContentProps {
  initialProjects: Project[];
  categories: MasterDataItem[];
  provinces: MdProvince[];
  dict: any;
  lang?: string;
}

export function DanhMucContent({ initialProjects, categories, provinces, dict, lang }: DanhMucContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const dealTypeFilter = searchParams.get('deal_type') || 'all';
  const projectTypeFilter = searchParams.get('category') || 'all';
  const provinceFilter = searchParams.get('province') || 'all';
  
  const [localSearch, setLocalSearch] = useState(searchParams.get('q') || '');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (localSearch !== (searchParams.get('q') || '')) {
        updateFilter('q', localSearch);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [localSearch]);

  const filteredProjects = useMemo(() => {
    const searchLower = localSearch.toLowerCase();
    return initialProjects.filter((project) => {
      const matchDealType = dealTypeFilter === 'all' || project.deal_type === dealTypeFilter;
      const matchProjectType = projectTypeFilter === 'all' || project.project_type === projectTypeFilter;
      const matchProvince = provinceFilter === 'all' || project.province === provinceFilter;
      const matchSearch = project.title.toLowerCase().includes(searchLower) || 
                          project.project_code.toLowerCase().includes(searchLower);

      return matchDealType && matchProjectType && matchProvince && matchSearch;
    });
  }, [initialProjects, dealTypeFilter, projectTypeFilter, provinceFilter, localSearch]);

  // Filter active provinces based on available projects (or just show all active provinces)
  // We'll show all provinces from Master Data for better UX
  const activeProvinces = provinces;

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-12">
          <div className="text-sm text-[#6B7280] mb-4">
            {dict.navigation.home} <span className="mx-2">/</span> <span className="text-[#1A1A2E] font-medium">{dict.navigation.projects}</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#1A1A2E] mb-4">{dict.projects.title}</h1>
          <p className="text-[#6B7280] max-w-2xl">
            {dict.projects.description}
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg p-3 text-sm font-semibold text-[#1A1A2E] shadow-sm active:bg-gray-50 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C4A35A]" />
            {showFiltersMobile ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
        </div>

        {/* Filters */}
        <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-10 sticky top-24 z-30 lg:block ${showFiltersMobile ? 'block' : 'hidden'}`}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Deal Type Toggle */}
            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                className={`px-6 py-2 text-sm font-medium rounded-sm transition-colors ${dealTypeFilter === 'all' ? 'bg-white shadow-sm text-[#1A1A2E]' : 'text-gray-500 hover:text-[#1A1A2E]'}`}
                onClick={() => updateFilter('deal_type', 'all')}
              >
                {dict.projects.filter_all}
              </button>
              <button
                className={`px-6 py-2 text-sm font-medium rounded-sm transition-colors ${dealTypeFilter === 'buyout' ? 'bg-[#DC2626] text-white shadow-sm' : 'text-gray-500 hover:text-[#1A1A2E]'}`}
                onClick={() => updateFilter('deal_type', 'buyout')}
              >
                {dict.projects.filter_buyout}
              </button>
              <button
                className={`px-6 py-2 text-sm font-medium rounded-sm transition-colors ${dealTypeFilter === 'joint_venture' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-gray-500 hover:text-[#1A1A2E]'}`}
                onClick={() => updateFilter('deal_type', 'joint_venture')}
              >
                {dict.projects.filter_jv}
              </button>
            </div>

            <div className="flex-grow flex flex-col md:flex-row gap-4">
              <select 
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-md focus:ring-[#C4A35A] focus:border-[#C4A35A] block p-2.5"
                value={projectTypeFilter}
                onChange={(e) => updateFilter('category', e.target.value)}
              >
                <option value="all">{dict.projects.filter_type}</option>
                {categories.filter(c => c.category === 'project_type').map(c => (
                  <option key={c.key} value={c.key}>{(lang === 'en' && c.label_en) ? c.label_en : c.label}</option>
                ))}
              </select>

              <select 
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-md focus:ring-[#C4A35A] focus:border-[#C4A35A] block p-2.5"
                value={provinceFilter}
                onChange={(e) => updateFilter('province', e.target.value)}
              >
                <option value="all">{dict.projects.filter_province}</option>
                {activeProvinces.map(prov => (
                  <option key={prov.code} value={prov.name}>{prov.name}</option>
                ))}
              </select>

              <input 
                type="text" 
                placeholder={dict.projects.search_placeholder} 
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-md focus:ring-[#C4A35A] focus:border-[#C4A35A] block p-2.5"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 text-[#6B7280]">
          {dict.projects.showing} <strong>{filteredProjects.length}</strong> {dict.projects.matching}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-[#1A1A2E] mb-3">{dict.projects.not_found_title}</h3>
            <p className="text-gray-500 max-w-md text-center">{dict.projects.not_found_desc}</p>
            <button 
              className="mt-8 px-6 py-2.5 bg-[#1A1A2E] text-white text-sm font-medium rounded-lg hover:bg-[#C4A35A] transition-colors shadow-md"
              onClick={() => {
                setLocalSearch('');
                router.replace('?', { scroll: false });
              }}
            >
              {dict.projects.clear_filters}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function DanhMucLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
