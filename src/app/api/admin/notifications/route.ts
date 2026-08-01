import { NextResponse, NextRequest } from 'next/server';
import { getNotifications, markAsRead, markAllAsRead } from '@/lib/notifications-store';
import { validateSession, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 1. Broken Access Control Fix: Validate session cookie
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie || !validateSession(sessionCookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await getNotifications();
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 1. Broken Access Control Fix: Validate session cookie
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie || !validateSession(sessionCookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, markAllRead } = body;

    if (markAllRead) {
      const success = await markAllAsRead();
      return NextResponse.json({ success });
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id or markAllRead parameter' }, { status: 400 });
    }

    const success = await markAsRead(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Failed to update notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
