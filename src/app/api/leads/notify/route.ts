import { NextRequest, NextResponse } from 'next/server';
import { validateSession, SESSION_COOKIE_NAME } from '@/lib/auth';
import { sendStatusUpdateToClient } from '@/lib/email-service';
import { getLeadStatusLabel } from '@/lib/utils';
import { getLeads } from '@/lib/leads-store';

export async function POST(request: NextRequest) {
  try {
    // Only admins can trigger this
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie || !validateSession(sessionCookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId, newStatus } = await request.json();
    
    if (!leadId || !newStatus) {
      return NextResponse.json({ error: 'Missing leadId or newStatus' }, { status: 400 });
    }

    // Get the lead to find the email
    const leads = await getLeads();
    const lead = leads.find((l: any) => l.id === leadId);

    if (!lead || !lead.email) {
      return NextResponse.json({ error: 'Lead not found or missing email' }, { status: 404 });
    }

    const newStatusLabel = getLeadStatusLabel(newStatus);
    const projectName = lead.project_name_location || 'Dự án (Chưa rõ)';
    
    await sendStatusUpdateToClient(lead.email, lead.full_name, projectName, newStatusLabel);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Lead notify error:', error);
    return NextResponse.json({ error: 'Failed to send notification email: ' + error.message }, { status: 500 });
  }
}
