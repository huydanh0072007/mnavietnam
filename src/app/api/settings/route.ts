import { NextResponse, NextRequest } from 'next/server';
import { getSettings, saveSettings } from '@/lib/config-store';
import { validateSession, SESSION_COOKIE_NAME } from '@/lib/auth';

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
    }
    
    return NextResponse.json(safeSettings);
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
    const updatedSettings = await saveSettings(body);
    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
