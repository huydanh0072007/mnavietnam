import React from 'react';
import AdminProjectsClient from './AdminProjectsClient';
import { getProjects } from '@/lib/projects-store';

export const revalidate = 0; // Admin page should always be up to date

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return <AdminProjectsClient initialProjects={projects} />;
}
