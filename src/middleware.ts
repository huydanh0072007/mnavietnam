import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';

const enUrlMapping: Record<string, string> = {
  '/en/about': '/en/gioi-thieu',
  '/en/projects': '/en/danh-muc',
  '/en/submit': '/en/ky-gui',
  '/en/terms': '/en/dieu-khoan-su-dung',
  '/en/privacy': '/en/chinh-sach-bao-mat',
};

const missingLocaleEnMapping: Record<string, string> = {
  '/about': '/en/about',
  '/projects': '/en/projects',
  '/submit': '/en/submit',
  '/terms': '/en/terms',
  '/privacy': '/en/privacy',
};

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

  // 1. Check if it is a missing locale path that matches an English slug
  if (missingLocaleEnMapping[pathname]) {
    return NextResponse.redirect(new URL(`${missingLocaleEnMapping[pathname]}${request.nextUrl.search}`, request.url));
  }
  if (pathname.startsWith('/project/')) {
    const slug = pathname.slice('/project/'.length);
    return NextResponse.redirect(new URL(`/en/project/${slug}${request.nextUrl.search}`, request.url));
  }

  // 2. Check if it is an English slug that needs rewriting to its Vietnamese filesystem folder
  if (enUrlMapping[pathname]) {
    return NextResponse.rewrite(new URL(`${enUrlMapping[pathname]}${request.nextUrl.search}`, request.url));
  }
  if (pathname.startsWith('/en/project/')) {
    const slug = pathname.slice('/en/project/'.length);
    return NextResponse.rewrite(new URL(`/en/du-an/${slug}${request.nextUrl.search}`, request.url));
  }

  // 3. Regular missing locale check
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale;
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${request.nextUrl.search}`,
        request.url
      )
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, `/admin/` and static files
  matcher: ['/((?!api|_next/static|_next/image|admin|favicon.ico|robots.txt|sitemap.xml).*)'],
};
