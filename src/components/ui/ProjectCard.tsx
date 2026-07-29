import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/types';
import { Badge } from './Badge';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link href={`/du-an/${project.slug}`} className="group block h-full">
      <div className="bg-[#0F1D2F] rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(196,163,90,0.15)] border border-[#1e2f47] group-hover:border-[#C4A35A]/50">
        <div className="relative h-64 w-full overflow-hidden bg-gray-800">
          {project.gallery_images[0] && (
            <Image
              src={project.gallery_images[0]}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={project.deal_type === 'buyout' ? 'buyout' : 'jv'}>
              {project.deal_type === 'buyout' ? 'Chuyển nhượng' : 'Hợp tác đầu tư'}
            </Badge>
            <Badge variant="status">{project.status_label}</Badge>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="text-[#C4A35A] text-sm font-semibold mb-2">{project.province}</div>
          <h3 className="text-xl font-serif font-bold text-[#E8E6E1] mb-3 line-clamp-2 group-hover:text-[#C4A35A] transition-colors">
            {project.title}
          </h3>
          <div className="text-[#6B7280] text-sm mb-4 space-y-2 flex-grow">
            <p><strong>Quy mô:</strong> {project.scale}</p>
            {project.highlights[0] && (
              <p className="line-clamp-2">
                <span className="text-[#C4A35A] mr-2">✓</span>
                {project.highlights[0]}
              </p>
            )}
          </div>
          <div className="pt-4 border-t border-gray-700 mt-auto flex items-center justify-between text-sm">
            <span className="text-[#E8E6E1]">Chi tiết dự án</span>
            <span className="text-[#C4A35A] group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
