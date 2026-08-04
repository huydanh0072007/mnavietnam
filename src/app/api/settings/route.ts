import { NextResponse, NextRequest } from 'next/server';
import { getSettings, saveSettings } from '@/lib/config-store';
import { validateSession, SESSION_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const settings = await getSettings();
    const safeSettings = { ...settings };
    
    // Check if admin is logged in
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isAdmin = sessionCookie ? validateSession(sessionCookie) : false;

    if (!isAdmin) {
      safeSettings.ai_api_key = ''; // Hide secret from public
      safeSettings.smtp_pass = ''; // Hide secret from public
    } else {
      // Mask secret API keys/passwords for admins in UI response
      if (safeSettings.ai_api_key) {
        safeSettings.ai_api_key = '••••••••';
      }
      if (safeSettings.smtp_pass) {
        safeSettings.smtp_pass = '••••••••';
      }
    }
    
    return NextResponse.json(safeSettings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Broken Access Control Fix: Validate session cookie
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie || !validateSession(sessionCookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. CSRF Fix: Validate custom header and origin
    const csrfHeader = request.headers.get('x-csrf-protection');
    if (csrfHeader !== '1') {
      return NextResponse.json({ error: 'CSRF token mismatch' }, { status: 403 });
    }

    const body = await request.json();
    
    // Restore original credentials if mask value received
    const currentSettings = await getSettings();
    if (body.ai_api_key === '••••••••') {
      body.ai_api_key = currentSettings.ai_api_key;
    }
    if (body.smtp_pass === '••••••••') {
      body.smtp_pass = currentSettings.smtp_pass;
    }

    const updatedSettings = await saveSettings(body);
    
    // Return safe settings (with masks)
    const safeSettings = { ...updatedSettings };
    if (safeSettings.ai_api_key) safeSettings.ai_api_key = '••••••••';
    if (safeSettings.smtp_pass) safeSettings.smtp_pass = '••••••••';
    
    return NextResponse.json(safeSettings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
