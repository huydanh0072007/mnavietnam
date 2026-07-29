import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, sanitizeInput, validateSession, SESSION_COOKIE_NAME } from '@/lib/auth';
import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { getLeads, addLead, updateLead } from '@/lib/leads-store';
import { sendLeadNotificationToAdmin } from '@/lib/email-service';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';

// Turnstile verification (Cloudflare anti-spam)
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    return false;
  }
}

// Helper to save files to public/uploads
async function saveUploadedFile(file: File): Promise<string> {
  const ext = path.extname(file.name).toLowerCase();
  
  // Security: Whitelist file extensions and MIME types
  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg'];
  const ALLOWED_MIME_TYPES = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png',
    'image/jpeg'
  ];

  if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Định dạng file không được phép: ${ext}`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '_');
  const uniqueName = `${base}_${Date.now()}${ext}`;
  const filePath = path.join(uploadDir, uniqueName);
  
  await writeFile(filePath, buffer);
  return `/uploads/${uniqueName}`;
}

export async function GET(request: NextRequest) {
  try {
    // Only admins can get leads
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie || !validateSession(sessionCookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leads = await getLeads();
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Only admins can update leads
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie || !validateSession(sessionCookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, updates } = body;
    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 });
    }

    const updated = await updateLead(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(ip, { windowMs: 60000, maxRequests: 5 });
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json({ success: false, errors: [`Vui lòng đợi ${retryAfter} giây.`] }, { status: 429 });
    }

    const contentType = request.headers.get('content-type') || '';
    let body: any = {};
    let attachmentFile: File | null = null;
    let signatureBase64: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      body = {
        lead_type: 'submission',
        full_name: formData.get('full_name'),
        organization: formData.get('organization'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        role_title: formData.get('role_title'),
        project_name_location: formData.get('project_name_location'),
        preferred_deal_type: formData.get('preferred_deal_type'),
        estimated_scale: formData.get('estimated_scale'),
        message: formData.get('message'),
        turnstile_token: formData.get('turnstile_token'),
      };
      attachmentFile = formData.get('attachment') as File | null;
    } else {
      try {
        body = await request.json();
        signatureBase64 = body.signature_base64 || null;
      } catch {
        return NextResponse.json({ success: false, errors: ['Dữ liệu không hợp lệ'] }, { status: 400 });
      }
    }

    const sanitizedBody = {
      lead_type: body.lead_type === 'submission' ? 'submission' : 'interest',
      full_name: sanitizeInput(body.full_name || ''),
      organization: sanitizeInput(body.organization || ''),
      email: sanitizeInput(body.email || ''),
      phone: sanitizeInput(body.phone || 'N/A'),
      role_title: body.role_title ? sanitizeInput(body.role_title) : undefined,
      message: body.message ? sanitizeInput(body.message).slice(0, 2000) : undefined,
      project_name_location: body.project_name_location ? sanitizeInput(body.project_name_location) : undefined,
      preferred_deal_type: body.preferred_deal_type ? sanitizeInput(body.preferred_deal_type) : undefined,
      estimated_scale: body.estimated_scale ? sanitizeInput(body.estimated_scale) : undefined,
      related_project_title: body.project_title ? sanitizeInput(body.project_title) : undefined,
      turnstile_token: body.turnstile_token,
    };

    const errors: string[] = [];
    if (!sanitizedBody.full_name) errors.push('Vui lòng nhập họ và tên');
    if (!sanitizedBody.email) errors.push('Vui lòng nhập email');

    if (errors.length > 0) return NextResponse.json({ success: false, errors }, { status: 400 });

    if (sanitizedBody.turnstile_token) {
      const verified = await verifyTurnstile(sanitizedBody.turnstile_token, ip);
      if (!verified) return NextResponse.json({ success: false, errors: ['Xác thực anti-spam không thành công.'] }, { status: 400 });
    }

    let attachment_url;
    let signature_url;

    if (attachmentFile && attachmentFile.size > 0) {
      attachment_url = await saveUploadedFile(attachmentFile);
    }

    if (signatureBase64) {
      const base64Data = signatureBase64.replace(/^data:image\/png;base64,/, "");
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
      const fileName = `sig_${Date.now()}.png`;
      require('fs').writeFileSync(path.join(uploadDir, fileName), base64Data, 'base64');
      signature_url = `/uploads/${fileName}`;
    }

    const leadDataToSave = {
      ...sanitizedBody,
      attachment_url,
      signature_url,
      status: sanitizedBody.lead_type === 'submission' ? 'draft_pending' : 'new',
      assigned_admin: 'Chưa gán',
      internal_notes: sanitizedBody.lead_type === 'submission' ? [
        {
          text: 'Hệ thống đã gửi Email xác nhận tự động tới Chủ dự án.',
          author: 'Hệ thống (Auto)',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ] : [],
      audit_logs: []
    };
    
    // Fallback to local JSON store
    const newLead = await addLead(leadDataToSave as any);

    if (!newLead) {
      throw new Error('Failed to create lead');
    }

    // Try to send email notification to admin (non-blocking)
    sendLeadNotificationToAdmin(newLead).catch((err) => {
      console.error('Failed to send admin notification email:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Thông tin đã được ghi nhận thành công.',
      lead_id: newLead.id,
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ success: false, errors: ['Đã có lỗi xảy ra. Vui lòng thử lại sau.'] }, { status: 500 });
  }
}
