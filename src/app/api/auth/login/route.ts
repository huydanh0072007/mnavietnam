import { NextRequest, NextResponse } from 'next/server';
import {
  verifyCredentials,
  createSession,
  checkRateLimit,
  getClientIP,
  sanitizeInput,
  SESSION_COOKIE_NAME,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // Rate limit: max 5 login attempts per minute
    const rateLimit = checkRateLimit(ip, { windowMs: 60000, maxRequests: 5 });
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Quá nhiều lần thử. Vui lòng đợi ${retryAfter} giây.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfter) },
        }
      );
    }

    const body = await request.json();
    const email = sanitizeInput(body.email || '');
    const password = body.password || '';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập email và mật khẩu' },
        { status: 400 }
      );
    }

    // Verify credentials server-side
    const isValid = verifyCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Tài khoản hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    // Create session and set httpOnly cookie
    const sessionToken = createSession(email);

    const response = NextResponse.json({ success: true, message: 'Đăng nhập thành công' });
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
