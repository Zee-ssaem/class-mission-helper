import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일과 API 라우트는 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  // Supabase 세션 업데이트
  const response = await updateSession(request);

  // 학생 대시보드 보호 (로그인 페이지는 제외)
  if (pathname.startsWith('/student') && pathname !== '/login') {
    const studentName = request.cookies.get('student_name');
    if (!studentName) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 교사 대시보드 보호 (로그인 페이지는 제외)
  if (pathname.startsWith('/admin') && pathname !== '/login') {
    const admin = request.cookies.get('admin');
    if (!admin || admin.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

