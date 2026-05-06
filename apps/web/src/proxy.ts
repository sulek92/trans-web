import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'local-secret');

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isAccountRoute = pathname.startsWith('/konto');

  if (!isAdminRoute && !isAccountRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('pb_auth_token')?.value;
  if (!token) {
    const loginUrl = new URL('/logowanie', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (isAdminRoute && payload.role !== 'admin' && payload.role !== 'superadmin') {
      const loginUrl = new URL('/logowanie', request.url);
      loginUrl.searchParams.set('forbidden', '1');
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL('/logowanie', request.url);
    loginUrl.searchParams.set('expired', '1');
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/konto/:path*'],
};
