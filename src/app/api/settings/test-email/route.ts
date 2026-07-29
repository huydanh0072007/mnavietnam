import { NextResponse, NextRequest } from 'next/server';
import { validateSession, SESSION_COOKIE_NAME } from '@/lib/auth';
import { sendTestEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    // 1. Validate session cookie (Admin only)
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie || !validateSession(sessionCookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. CSRF Fix: Validate custom header
    const csrfHeader = request.headers.get('x-csrf-protection');
    if (csrfHeader !== '1') {
      return NextResponse.json({ error: 'CSRF token mismatch' }, { status: 403 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Thiếu địa chỉ email nhận' }, { status: 400 });
    }

    // Attempt to send email
    const info = await sendTestEmail(email);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      error: 'Lỗi gửi email: ' + (error.message || 'Không rõ') 
    }, { status: 500 });
  }
}
