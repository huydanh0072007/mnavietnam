import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Bỏ qua các đường dẫn không cần chuyển hướng ngôn ngữ
  if (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Kiểm tra xem URL đã có locale chưa
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Nếu thiếu locale, tự động chuyển hướng về /vi (ngôn ngữ mặc định)
  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale;
    
    // e.g. incoming request is /du-an
    // The new URL is now /vi/du-an
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, `/admin/` and static files
  matcher: ['/((?!api|_next/static|_next/image|admin|favicon.ico|robots.txt|sitemap.xml).*)'],
};
