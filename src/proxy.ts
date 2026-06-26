import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_session')?.value ?? request.cookies.get('auth_token')?.value;
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Cookie: `admin_session=${token}` },
      });
      const json: { success?: boolean } = await res.json();
      if (!json.success) {
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('admin_session');
        response.cookies.delete('auth_token');
        return response;
      }
    } catch {
      // Worker unreachable — allow access in degraded mode
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
