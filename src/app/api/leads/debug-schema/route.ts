import { NextResponse } from 'next/server';
import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' });
  }

  const supabase = getSupabaseServerClient();
  const results: Record<string, any> = {};

  const baseLead = {
    id: 'L-DEBUG-' + Date.now().toString().slice(-4),
    lead_type: 'interest',
    full_name: 'Debug Test',
    organization: 'Debug Org',
    email: 'debug@test.com',
    phone: '0123456789',
    status: 'new'
  };

  // Test 1: Insert base fields
  try {
    const { error } = await supabase.from('leads').insert([baseLead]);
    results.base_insert = error ? { message: error.message, code: error.code } : 'SUCCESS';
    
    // Clean up
    if (!error) {
      await supabase.from('leads').delete().eq('id', baseLead.id);
    }
  } catch (err: any) {
    results.base_insert = { exception: err.message };
  }

  // Test 2: Insert with assigned_admin
  try {
    const id = baseLead.id + 'A';
    const { error } = await supabase.from('leads').insert([{
      ...baseLead,
      id,
      assigned_admin: 'Chưa gán'
    }]);
    results.assigned_admin = error ? { message: error.message, code: error.code } : 'SUCCESS';
    if (!error) await supabase.from('leads').delete().eq('id', id);
  } catch (err: any) {
    results.assigned_admin = { exception: err.message };
  }

  // Test 3: Insert with assigned_admin_id
  try {
    const id = baseLead.id + 'B';
    const { error } = await supabase.from('leads').insert([{
      ...baseLead,
      id,
      assigned_admin_id: '00000000-0000-0000-0000-000000000000'
    }]);
    results.assigned_admin_id = error ? { message: error.message, code: error.code } : 'SUCCESS';
    if (!error) await supabase.from('leads').delete().eq('id', id);
  } catch (err: any) {
    results.assigned_admin_id = { exception: err.message };
  }

  // Test 4: Insert with audit_logs
  try {
    const id = baseLead.id + 'C';
    const { error } = await supabase.from('leads').insert([{
      ...baseLead,
      id,
      audit_logs: []
    }]);
    results.audit_logs = error ? { message: error.message, code: error.code } : 'SUCCESS';
    if (!error) await supabase.from('leads').delete().eq('id', id);
  } catch (err: any) {
    results.audit_logs = { exception: err.message };
  }

  // Test 5: Insert with related_project_title
  try {
    const id = baseLead.id + 'D';
    const { error } = await supabase.from('leads').insert([{
      ...baseLead,
      id,
      related_project_title: 'Test Project'
    }]);
    results.related_project_title = error ? { message: error.message, code: error.code } : 'SUCCESS';
    if (!error) await supabase.from('leads').delete().eq('id', id);
  } catch (err: any) {
    results.related_project_title = { exception: err.message };
  }

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'no-store' }
  });
}
