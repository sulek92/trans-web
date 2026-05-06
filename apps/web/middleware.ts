import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple RBAC gate: protect /admin routes by a user role stored in cookies
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminPath = pathname.startsWith('/admin')

  // Require a login token for admin access
  const pbToken = req.cookies.get('pb_auth_token')?.value
  // Try to read a role from cookies. Fallback to empty string.
  const role = req.cookies.get('pb_user_role')?.value || ''

  // If admin path and no token or not an authorized role, redirect
  if (isAdminPath && (!pbToken || (role !== 'admin' && role !== 'superadmin'))) {
    // Redirect unauthenticated/unauthorized users away from admin area
    const url = req.nextUrl.clone()
    url.pathname = '/logowanie' // redirect to login
    url.searchParams.set('forbidden', '1')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Apply this middleware to admin-related paths
  matcher: ['/admin/:path*'],
}
