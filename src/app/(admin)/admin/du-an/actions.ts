'use server';

import { updateProject, addProject, deleteProject } from '@/lib/projects-store';
import { Project } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { validateSession, SESSION_COOKIE_NAME } from '@/lib/auth';

async function verifyAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie || !validateSession(sessionCookie)) {
    throw new Error('Unauthorized');
  }
}

export async function toggleProjectFeatured(id: string, is_featured: boolean) {
  await verifyAdminSession();
  await updateProject(id, { is_featured });
  revalidatePath('/admin/du-an');
  revalidatePath('/');
}

export async function toggleProjectPublishStatus(id: string, publish_status: string) {
  await verifyAdminSession();
  await updateProject(id, { publish_status: publish_status as any });
  revalidatePath('/admin/du-an');
  revalidatePath('/danh-muc');
  revalidatePath(`/du-an/[slug]`);
}

export async function createProjectAction(projectData: Partial<Project>) {
  await verifyAdminSession();
  await addProject(projectData);
  revalidatePath('/admin/du-an');
  revalidatePath('/danh-muc');
  revalidatePath('/');
}

export async function updateProjectAction(id: string, projectData: Partial<Project>) {
  await verifyAdminSession();
  await updateProject(id, projectData);
  revalidatePath('/admin/du-an');
  revalidatePath('/danh-muc');
  revalidatePath('/');
  revalidatePath(`/du-an/[slug]`);
}

export async function actionHideProject(id: string) {
  await verifyAdminSession();
  await updateProject(id, { is_active: false, publish_status: 'hidden' });
  revalidatePath('/admin/du-an');
  revalidatePath('/danh-muc');
  revalidatePath('/');
}

export async function bulkUpdateProjectPublishStatus(ids: string[], publish_status: string) {
  await verifyAdminSession();
  for (const id of ids) {
    await updateProject(id, { publish_status: publish_status as any });
  }
  revalidatePath('/admin/du-an');
  revalidatePath('/danh-muc');
  revalidatePath('/');
}

export async function bulkHideProjects(ids: string[]) {
  await verifyAdminSession();
  for (const id of ids) {
    await updateProject(id, { is_active: false, publish_status: 'hidden' });
  }
  revalidatePath('/admin/du-an');
  revalidatePath('/danh-muc');
  revalidatePath('/');
}
