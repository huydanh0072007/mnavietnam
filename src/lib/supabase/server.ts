import { createClient } from '@supabase/supabase-js';

export function isSupabaseConfigured(): boolean {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return !!rawUrl && 
    rawUrl !== 'your_supabase_url' && 
    !!rawKey && 
    rawKey !== 'your_service_role_key';
}

// Server client with admin privileges (service role key)
// Only use in API routes and server components
export function getSupabaseServerClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const supabaseUrl = isSupabaseConfigured() ? rawUrl! : 'https://placeholder-project.supabase.co';
  const supabaseServiceKey = isSupabaseConfigured() ? rawKey! : 'placeholder-service-key';

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: (url, options) => {
        return fetch(url, { ...options, cache: 'no-store' });
      },
    },
  });
}
