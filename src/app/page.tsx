import React from 'react';
import HomeClient from './HomeClient';
import { getProjects } from '@/lib/projects-store';

// We can define metadata or dynamic revalidation here if needed
export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  const allProjects = await getProjects();
  const featuredProjects = allProjects
    .filter((p) => p.is_featured && p.publish_status === 'published')
    .sort((a, b) => a.featured_order - b.featured_order);

  return <HomeClient featuredProjects={featuredProjects} />;
}
