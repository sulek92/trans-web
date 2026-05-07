import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwt } from 'jose'

function getRoleFromToken(token: string): string {
  try {
    const claims = decodeJwt(token)
    return ((claims as Record<string, unknown>).role as string) || ''
  } catch {
    return ''
  }
}

const PROTECTED_PREFIXES = ['/admin', '/konto', '/zamowienia', '/panel']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  if (!isProtected) return NextResponse.next()

  const pbToken = req.cookies.get('pb_auth_token')?.value

  if (!pbToken) {
    const url = req.nextUrl.clone()
    url.pathname = '/logowanie'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/admin')) {
    const role = getRoleFromToken(pbToken)
    if (role !== 'admin' && role !== 'superadmin') {
      const url = req.nextUrl.clone()
      url.pathname = '/logowanie'
      url.searchParams.set('forbidden', '1')
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/konto/:path*',
    '/zamowienia/:path*',
    '/panel/:path*',
  ],
}
