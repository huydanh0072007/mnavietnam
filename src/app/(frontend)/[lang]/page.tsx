import React from 'react';
import HomeClient from './HomeClient';
import { getProjects } from '@/lib/projects-store';

// We can define metadata or dynamic revalidation here if needed
export const revalidate = 60; // revalidate every 60 seconds

export default async function Home({ params }: { params: { lang: string } }) {
  const allProjects = await getProjects();
  // TODO: Use lang to select title/title_en inside the project cards later if needed
  const featuredProjects = allProjects
    .filter((p) => p.is_featured && p.publish_status === 'published')
    .sort((a, b) => a.featured_order - b.featured_order);

  // If Next 15, params might be a Promise, but trying sync first.
  const lang = params?.lang || 'vi';

  return <HomeClient featuredProjects={featuredProjects} lang={lang} />;
}
