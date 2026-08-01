import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/types';
import { Badge } from './Badge';
import { Check, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  lang?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, lang = 'vi' }) => {
  const isEn = lang === 'en';
  const displayTitle = isEn && project.title_en ? project.title_en : project.title;
  const displayStatus = isEn && project.status_label_en ? project.status_label_en : project.status_label;
  const displayScale = isEn && project.scale_en ? project.scale_en : project.scale;
  const displayHighlights = isEn && project.highlights_en?.length ? project.highlights_en : project.highlights;
  
  const dealTypeLabel = project.deal_type === 'buyout' 
    ? (isEn ? 'Buyout' : 'Chuyển nhượng') 
    : (isEn ? 'Joint Venture' : 'Hợp tác đầu tư');

  const scaleLabel = isEn ? 'Scale' : 'Quy mô';
  const detailsLabel = isEn ? 'Project Details' : 'Chi tiết dự án';

  return (
    <Link href={`/${lang}/du-an/${project.slug}`} className="group block h-full">
      <div className="bg-dark-surface rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(196,163,90,0.15)] border border-[#1e2f47] group-hover:border-gold/50">
        <div className="relative h-64 w-full overflow-hidden bg-gray-800">
          {project.gallery_images[0] && (
            <Image
              src={project.gallery_images[0]}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 pr-4">
            <Badge variant={project.deal_type === 'buyout' ? 'buyout' : 'jv'}>
              {dealTypeLabel}
            </Badge>
            <Badge variant="status">{displayStatus}</Badge>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="text-gold text-sm font-semibold mb-2">{project.province}</div>
          <h3 className="text-xl font-serif font-bold text-text-on-dark mb-3 line-clamp-2 group-hover:text-gold transition-colors">
            {displayTitle}
          </h3>
          <div className="text-gray-400 text-sm mb-4 space-y-2 flex-grow">
            <p><strong>{scaleLabel}:</strong> {displayScale}</p>
            {displayHighlights[0] && (
              <p className="line-clamp-2 flex items-start gap-1">
                <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{displayHighlights[0]}</span>
              </p>
            )}
          </div>
          <div className="pt-4 border-t border-gray-700 mt-auto flex items-center justify-between text-sm">
            <span className="text-text-on-dark">{detailsLabel}</span>
            <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};
