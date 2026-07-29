import { NextRequest, NextResponse } from 'next/server';
import { getLeads, updateLead } from '@/lib/leads-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead_id, action, file_url } = body;

    if (!lead_id || !action) {
      return NextResponse.json({ error: 'Missing lead_id or action' }, { status: 400 });
    }

    const leads = await getLeads();
    const lead = leads.find(l => l.id === lead_id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const newLog = {
      action,
      file_url,
      timestamp: new Date().toISOString(),
    };

    const updatedAuditLogs = [...(lead.audit_logs || []), newLog];
    
    await updateLead(lead_id, { audit_logs: updatedAuditLogs });

    return NextResponse.json({ success: true, audit_logs: updatedAuditLogs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to append audit log' }, { status: 500 });
  }
}
