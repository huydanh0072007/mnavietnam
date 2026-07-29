import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = 
  !!rawUrl && 
  rawUrl !== 'your_supabase_url' && 
  !!rawKey && 
  rawKey !== 'your_supabase_anon_key';

const supabaseUrl = isConfigured ? rawUrl : 'https://placeholder-project.supabase.co';
const supabaseAnonKey = isConfigured ? rawKey : 'placeholder-anon-key';

// Browser client (public, uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For use in React components
export function getSupabaseBrowserClient() {
  return supabase;
}

export { isConfigured as isSupabaseConfigured };
