import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple RBAC gate: protect /admin routes by a user role stored in cookies
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminPath = pathname.startsWith('/admin')

  // Try to read a role from cookies. Fallback to empty string.
  const role = req.cookies.get('role')?.value || ''

  if (isAdminPath && role !== 'admin') {
    // Redirect unauthenticated/unauthorized users away from admin area
    const url = req.nextUrl.clone()
    url.pathname = '/' // redirect to home; adjust as needed
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Apply this middleware to admin-related paths
  matcher: ['/admin/:path*'],
}
