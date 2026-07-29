import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProjects, getProjectBySlug } from '@/lib/projects-store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { DonutChart, DonutSegment } from '@/components/ui/DonutChart';
import { DataRoomUnlock } from '@/components/ui/DataRoomUnlock';

export const revalidate = 60; // revalidate every 60 seconds

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    return {
      title: 'Không tìm thấy dự án | M$A International',
    };
  }

  const title = `${project.project_code}: ${project.title} | M$A International`;
  const description = `Cơ hội đầu tư M&A dự án ${project.title} tại ${project.province}. Quy mô: ${project.scale}. Hình thức: ${project.deal_type === 'buyout' ? 'Chuyển nhượng 100%' : 'Hợp tác đầu tư'}.`;

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
          alt: project.title,
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

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  
  if (!project || project.publish_status !== 'published') {
    notFound();
  }

  const allProjects = await getProjects();
  const relatedProjects = allProjects
    .filter(p => p.deal_type === project.deal_type && p.id !== project.id && p.publish_status === 'published')
    .slice(0, 3);

  const capitalStructureData: DonutSegment[] = project.deal_type === 'buyout' 
    ? [
        { label: 'Chuyển nhượng Cổ phần', value: 100, color: '#0A1628' },
      ]
    : [
        { label: 'Kêu gọi đầu tư (Capex)', value: 49, color: '#C4A35A' },
        { label: 'Chủ đầu tư đối ứng', value: 51, color: '#0A1628' },
      ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-[#6B7280] mb-8">
          <Link href="/" className="hover:text-[#1A1A2E]">Trang chủ</Link>
          <span className="mx-2">/</span> 
          <Link href="/danh-muc" className="hover:text-[#1A1A2E]">Danh mục dự án</Link>
          <span className="mx-2">/</span> 
          <span className="text-[#1A1A2E] font-medium">{project.project_code}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src={project.gallery_images[0]}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {project.gallery_images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {project.gallery_images.slice(1).map((img, idx) => (
                    <div key={idx} className="relative h-24 rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                      <Image
                        src={img}
                        alt={`${project.title} thumbnail ${idx + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#1A1A2E] mb-4">Tổng quan dự án</h2>
              <div className="prose max-w-none text-gray-700">
                <p>{project.description}</p>
              </div>
            </section>

            {/* Highlights */}
            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#1A1A2E] mb-4">Điểm nhấn đầu tư</h2>
              <ul className="space-y-4">
                {project.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-[#C4A35A] mt-1 text-xl">✓</span>
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Capital Structure Chart */}
            <section className="bg-white p-8 rounded-lg shadow-sm overflow-hidden">
              <h2 className="text-2xl font-serif font-bold text-[#1A1A2E] mb-8 text-center">Cơ cấu Vốn & Giao dịch</h2>
              <div className="bg-[#0A1628] rounded-xl py-12 px-4 shadow-inner">
                <DonutChart 
                  data={capitalStructureData} 
                  title={project.deal_type === 'buyout' ? 'M&A 100%' : 'Hợp tác 49%'} 
                  subtitle="Cơ cấu kỳ vọng" 
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm sticky top-24">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={project.deal_type === 'buyout' ? 'buyout' : 'jv'}>
                  {project.deal_type === 'buyout' ? 'Chuyển nhượng' : 'Hợp tác đầu tư'}
                </Badge>
                <Badge variant="status">{project.status_label}</Badge>
              </div>

              <h1 className="text-3xl font-serif font-bold text-[#1A1A2E] mb-2">{project.title}</h1>
              <div className="text-[#C4A35A] font-medium mb-6 text-lg">{project.project_code}</div>

              {/* Specs Table */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Vị trí</span>
                  <span className="font-medium text-right text-[#1A1A2E]">{project.district}, {project.province}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Quy mô</span>
                  <span className="font-medium text-right text-[#1A1A2E]">{project.scale}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Pháp lý</span>
                  <span className="font-medium text-right text-[#1A1A2E]">{project.legal_status_summary}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Hiện trạng</span>
                  <span className="font-medium text-right text-[#1A1A2E]">{project.current_status}</span>
                </div>
                {project.show_valuation && (
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Định giá / Tổng mức ĐT</span>
                    <span className="font-medium text-right text-[#1A1A2E]">{project.valuation_display}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Cấu trúc giao dịch</span>
                  <span className="font-medium text-right text-[#1A1A2E]">{project.capital_structure_summary}</span>
                </div>
              </div>
              <div className="mt-8">
                <DataRoomUnlock projectTitle={project.title} />
              </div>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-200">
            <h2 className="text-3xl font-serif font-bold text-[#1A1A2E] mb-8">Dự án tương tự</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
