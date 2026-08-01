import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProjects, getProjectBySlug } from '@/lib/projects-store';
import { Badge } from '@/components/ui/Badge';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { DonutChart, DonutSegment } from '@/components/ui/DonutChart';
import { DataRoomUnlock } from '@/components/ui/DataRoomUnlock';
import { ProjectGallery } from '@/components/ui/ProjectGallery';
import viDict from '@/dictionaries/vi.json';
import enDict from '@/dictionaries/en.json';
import { getDictionary } from '@/lib/get-dictionary';

export const revalidate = 60; // revalidate every 60 seconds

type PageParams = Promise<any>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug, lang } = await params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    return {
      title: lang === 'en' ? 'Project not found | M$A International' : 'Không tìm thấy dự án | M$A International',
    };
  }

  const pTitle = lang === 'en' ? (project.title_en || project.title) : project.title;
  const title = `${project.project_code}: ${pTitle} | M$A International`;
  
  const pProvince = project.province; // No translated provinces yet
  const pScale = lang === 'en' ? (project.scale_en || project.scale) : project.scale;
  
  const dealTypeStrVi = project.deal_type === 'buyout' ? 'Chuyển nhượng 100%' : 'Hợp tác đầu tư';
  const dealTypeStrEn = project.deal_type === 'buyout' ? '100% Transfer' : 'Joint Venture';
  
  const description = lang === 'en' 
    ? `M&A investment opportunity: ${pTitle} in ${pProvince}. Scale: ${pScale}. Deal type: ${dealTypeStrEn}.`
    : `Cơ hội đầu tư M&A dự án ${pTitle} tại ${pProvince}. Quy mô: ${pScale}. Hình thức: ${dealTypeStrVi}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: project.gallery_images[0] || '/hero-bg.jpg',
          width: 1200,
          height: 630,
          alt: pTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project.gallery_images[0] || '/hero-bg.jpg'],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: PageParams }) {
  const { slug, lang } = await params;
  const project = await getProjectBySlug(slug);
  const dict = await getDictionary(lang as any);
  const isEn = lang === 'en';
  
  if (!project || project.publish_status !== 'published') {
    notFound();
  }

  const allProjects = await getProjects();
  const relatedProjects = allProjects
    .filter(p => p.deal_type === project.deal_type && p.id !== project.id && p.publish_status === 'published')
    .slice(0, 3);

  const capitalStructureData: DonutSegment[] = project.deal_type === 'buyout' 
    ? [
        { label: isEn ? 'Share Transfer' : 'Chuyển nhượng Cổ phần', value: 100, color: '#0A1628' },
      ]
    : [
        { label: isEn ? 'Investment Call (Capex)' : 'Kêu gọi đầu tư (Capex)', value: 49, color: '#C4A35A' },
        { label: isEn ? 'Counterpart Developer' : 'Chủ đầu tư đối ứng', value: 51, color: '#0A1628' },
      ];

  const pTitle = isEn ? (project.title_en || project.title) : project.title;
  const pDesc = isEn ? (project.description_en || project.description) : project.description;
  const pStatus = isEn ? (project.status_label_en || project.status_label) : project.status_label;
  const pScale = isEn ? (project.scale_en || project.scale) : project.scale;
  const pLegal = isEn ? (project.legal_status_summary_en || project.legal_status_summary) : project.legal_status_summary;
  const pCurrent = isEn ? (project.current_status_en || project.current_status) : project.current_status;
  const pValuation = isEn ? (project.valuation_display_en || project.valuation_display) : project.valuation_display;
  const pCapital = isEn ? (project.capital_structure_summary_en || project.capital_structure_summary) : project.capital_structure_summary;
  const pHighlights = isEn && project.highlights_en && project.highlights_en.length > 0 ? project.highlights_en : project.highlights;

  const dealTypeBadgeText = isEn 
    ? (project.deal_type === 'buyout' ? 'Buyout' : 'Joint Venture')
    : (project.deal_type === 'buyout' ? 'Chuyển nhượng' : 'Hợp tác đầu tư');

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-[#6B7280] mb-8">
          <Link href={`/${lang}`} className="hover:text-[#1A1A2E]">{dict.navigation.home}</Link>
          <span className="mx-2">/</span> 
          <Link href={`/${lang}/danh-muc`} className="hover:text-[#1A1A2E]">{dict.navigation.projects}</Link>
          <span className="mx-2">/</span> 
          <span className="text-[#1A1A2E] font-medium">{project.project_code}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery */}
            <ProjectGallery images={project.gallery_images} title={pTitle} />

            {/* Description */}
            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#1A1A2E] mb-4">
                {dict.project_detail.specs}
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p>{pDesc}</p>
              </div>
            </section>

            {/* Highlights */}
            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#1A1A2E] mb-4">
                {dict.project_detail.highlights}
              </h2>
              <ul className="space-y-4">
                {pHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-[#C4A35A] mt-1 text-xl">✓</span>
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Capital Structure Chart */}
            <section className="bg-white p-8 rounded-lg shadow-sm overflow-hidden">
              <h2 className="text-2xl font-serif font-bold text-[#1A1A2E] mb-8 text-center">
                {dict.project_detail.deal_type} & {dict.project_detail.scale}
              </h2>
              <div className="bg-[#0A1628] rounded-xl py-12 px-4 shadow-inner">
                <DonutChart 
                  data={capitalStructureData} 
                  title={project.deal_type === 'buyout' ? 'M&A 100%' : (isEn ? 'JV 49%' : 'Hợp tác 49%')} 
                  subtitle={isEn ? 'Expected Structure' : 'Cơ cấu kỳ vọng'} 
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm sticky top-24">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={project.deal_type === 'buyout' ? 'buyout' : 'jv'}>
                  {dealTypeBadgeText}
                </Badge>
                <Badge variant="status">{pStatus}</Badge>
              </div>

              <h1 className="text-3xl font-serif font-bold text-[#1A1A2E] mb-2">{pTitle}</h1>
              <div className="text-[#C4A35A] font-medium mb-6 text-lg">{project.project_code}</div>

              {/* Specs Table */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">{dict.project_detail.location}</span>
                  <span className="font-medium text-right text-[#1A1A2E]">{project.province}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">{dict.project_detail.scale}</span>
                  <span className="font-medium text-right text-[#1A1A2E]">{pScale}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">{dict.project_detail.legal_status}</span>
                  <span className="font-medium text-right text-[#1A1A2E]">{pLegal}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">{dict.project_detail.current_status}</span>
                  <span className="font-medium text-right text-[#1A1A2E]">{pCurrent}</span>
                </div>
                {project.show_valuation && (
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">{dict.project_detail.valuation}</span>
                    <span className="font-medium text-right text-[#1A1A2E]">{pValuation}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">{dict.project_detail.deal_type}</span>
                  <span className="font-medium text-right text-[#1A1A2E]">{pCapital}</span>
                </div>
              </div>
              <div className="mt-8">
                <DataRoomUnlock projectTitle={pTitle} dict={dict} lang={lang} />
              </div>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-200">
            <h2 className="text-3xl font-serif font-bold text-[#1A1A2E] mb-8">
              {dict.project_detail.related}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map(p => (
                <ProjectCard key={p.id} project={p} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
