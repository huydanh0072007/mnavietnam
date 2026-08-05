import { NextResponse } from 'next/server';
import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' });
  }

  try {
    const supabase = getSupabaseServerClient();
    
    // Query pg_attribute to get column names of 'leads' table
    const { data, error } = await supabase
      .rpc('get_table_columns_debug'); // If rpc doesn't exist, we can use a raw sql trick or try a select with empty limit
      
    if (error) {
      // Fallback: try to select 1 row and inspect the keys
      const { data: selectData, error: selectError } = await supabase
        .from('leads')
        .select('*')
        .limit(1);
        
      if (selectError) {
        return NextResponse.json({ error: selectError.message });
      }
      
      const columns = selectData.length > 0 ? Object.keys(selectData[0]) : 'No rows found in table leads to inspect';
      return NextResponse.json({ 
        method: 'select_fallback', 
        columns, 
        sample: selectData[0] 
      });
    }

    return NextResponse.json({ columns: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
