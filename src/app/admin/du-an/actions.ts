'use server';

import { updateProject, addProject } from '@/lib/projects-store';
import { Project } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function toggleProjectFeatured(id: string, is_featured: boolean) {
  await updateProject(id, { is_featured });
  revalidatePath('/admin/du-an');
  revalidatePath('/');
}

export async function toggleProjectPublishStatus(id: string, publish_status: string) {
  await updateProject(id, { publish_status: publish_status as any });
  revalidatePath('/admin/du-an');
  revalidatePath('/danh-muc');
  revalidatePath(`/du-an/[slug]`);
}

export async function createProjectAction(projectData: Partial<Project>) {
  await addProject(projectData);
  revalidatePath('/admin/du-an');
  revalidatePath('/danh-muc');
  revalidatePath('/');
}
