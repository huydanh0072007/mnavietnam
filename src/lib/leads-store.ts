import { getSupabaseServerClient, isSupabaseConfigured } from './supabase/server';

export interface LeadItem {
  id: string;
  lead_type: 'interest' | 'submission';
  full_name: string;
  organization: string;
  email: string;
  phone: string;
  role_title?: string;
  message?: string;
  project_name_location?: string;
  preferred_deal_type?: string;
  estimated_scale?: string;
  attachment_url?: string;
  signature_url?: string;
  related_project_title?: string;
  status: string;
  assigned_admin: string;
  internal_notes: { text: string; author: string; timestamp: string }[];
  audit_logs?: { action: string; file_url?: string; timestamp: string }[];
  is_active?: boolean;
  created_at: string;
}

export async function getLeads(): Promise<LeadItem[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not configured. Returning empty leads list.');
    return [];
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return data as LeadItem[];
}

export async function addLead(leadData: Omit<LeadItem, 'id' | 'created_at' | 'status' | 'assigned_admin' | 'internal_notes'>): Promise<LeadItem | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServerClient();
  
  // Create a clean insert object
  const insertData = {
    ...leadData,
    id: `L-${Date.now().toString().slice(-6)}`, // generate basic ID
  };

  const { data, error } = await supabase
    .from('leads')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error('Error adding lead:', error);
    return null;
  }

  return data as LeadItem;
}

export async function updateLead(id: string, updates: Partial<LeadItem>): Promise<LeadItem | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating lead:', error);
    return null;
  }

  return data as LeadItem;
}

export async function deleteLead(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lead:', error);
    return false;
  }

  return true;
}
