import React from 'react';
import HomeClient from './HomeClient';
import { getProjects } from '@/lib/projects-store';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';
// We can define metadata or dynamic revalidation here if needed
export const revalidate = 60; // revalidate every 60 seconds

export default async function Home({ params }: { params: Promise<any> }) {
  const allProjects = await getProjects();
  // TODO: Use lang to select title/title_en inside the project cards later if needed
  const featuredProjects = allProjects
    .filter((p) => p.is_featured && p.publish_status === 'published')
    .sort((a, b) => a.featured_order - b.featured_order);

  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return <HomeClient featuredProjects={featuredProjects} lang={lang} dict={dict} />;
}
