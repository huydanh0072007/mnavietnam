import { NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: Record<string, unknown> = {};

  // Step 1: Check env vars
  diagnostics.supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL ? 
    process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...' : 'MISSING';
  diagnostics.service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY ? 
    process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...' : 'MISSING';
  diagnostics.is_configured = isSupabaseConfigured();

  if (!isSupabaseConfigured()) {
    return NextResponse.json(diagnostics);
  }

  // Step 2: Try to read settings
  const supabase = getSupabaseServerClient();
  
  const { data: readData, error: readError } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 'global')
    .single();
  
  diagnostics.read_data = readData;
  diagnostics.read_error = readError ? { message: readError.message, code: readError.code, details: readError.details } : null;
  diagnostics.row_exists = !!readData;

  // Step 3: Try to upsert a test value
  const testPhone = 'DEBUG_TEST_' + Date.now();
  const { data: writeData, error: writeError } = await supabase
    .from('settings')
    .upsert({ id: 'global', phone: testPhone }, { onConflict: 'id' })
    .select('id, phone')
    .single();

  diagnostics.write_test_phone = testPhone;
  diagnostics.write_data = writeData;
  diagnostics.write_error = writeError ? { message: writeError.message, code: writeError.code, details: writeError.details } : null;
  diagnostics.write_success = !writeError && writeData?.phone === testPhone;

  // Step 4: Read back to verify
  const { data: verifyData, error: verifyError } = await supabase
    .from('settings')
    .select('id, phone')
    .eq('id', 'global')
    .single();
  
  diagnostics.verify_data = verifyData;
  diagnostics.verify_error = verifyError ? { message: verifyError.message, code: verifyError.code } : null;
  diagnostics.verify_matches = verifyData?.phone === testPhone;

  return NextResponse.json(diagnostics, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
