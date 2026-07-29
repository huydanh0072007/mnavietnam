import { Project } from './types';
import { getSupabaseServerClient, isSupabaseConfigured } from './supabase/server';

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured. Returning empty projects list.');
    return [];
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('featured_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }

  return data as Project;
}

export async function addProject(project: Partial<Project>): Promise<Project | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();

  if (error) {
    console.error('Error adding project:', error);
    return null;
  }

  return data as Project;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  return data as Project;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }

  return true;
}
