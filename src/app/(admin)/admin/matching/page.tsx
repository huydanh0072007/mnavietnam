import React from 'react';
import { getLeads } from '@/lib/leads-store';
import { getProjects } from '@/lib/projects-store';
import MatchingClient from './MatchingClient';

export const metadata = {
  title: 'Khớp lệnh (Matching) - CMS Admin MNA Vietnam',
};

export default async function MatchingPage() {
  const allLeads = await getLeads();
  const allProjects = await getProjects();

  // Filter leads to get only investor leads (lead_type === 'interest' and is_active !== false)
  const leads = allLeads.filter(
    (lead) => lead.lead_type === 'interest' && lead.is_active !== false
  );

  // Filter projects to get only published projects (publish_status === 'published' and is_active !== false)
  const projects = allProjects.filter(
    (project) => project.publish_status === 'published' && project.is_active !== false
  );

  return <MatchingClient initialLeads={leads} initialProjects={projects} />;
}
