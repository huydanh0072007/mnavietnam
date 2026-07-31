'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function actionRecordMatch(
  leadId: string,
  projectCode: string,
  projectTitle: string,
  currentNotes: any[]
) {
  try {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    // Format: YYYY-MM-DD HH:mm
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    
    const newNote = {
      text: `Đã giới thiệu đề xuất dự án: ${projectCode} — ${projectTitle}`,
      author: 'Hệ thống Matching',
      timestamp: timestamp,
    };

    // Filter out duplicates if any, though caller handles this. We just append.
    const updatedNotes = [...(currentNotes || []), newNote];

    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from('leads')
      .update({ internal_notes: updatedNotes })
      .eq('id', leadId);

    if (error) {
      console.error('Error updating lead notes in actionRecordMatch:', error);
      return { success: false, error: error.message };
    }

    // Revalidate paths to update cache data on front-end
    revalidatePath('/admin/matching');
    revalidatePath('/admin/leads');
    revalidatePath('/admin');

    return { success: true };
  } catch (error: any) {
    console.error('Exception in actionRecordMatch:', error);
    return { success: false, error: error?.message || 'Unknown error occurred' };
  }
}
