import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isConfigured = 
  !!rawUrl && 
  rawUrl !== 'your_supabase_url' && 
  !!rawKey && 
  rawKey !== 'your_service_role_key';

const supabaseUrl = isConfigured ? rawUrl : 'https://placeholder-project.supabase.co';
const supabaseServiceKey = isConfigured ? rawKey : 'placeholder-service-key';

// Server client with admin privileges (service role key)
// Only use in API routes and server components
export function getSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { isConfigured as isSupabaseConfigured };
