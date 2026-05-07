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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminPath = pathname.startsWith('/admin')

  const pbToken = req.cookies.get('pb_auth_token')?.value

  if (isAdminPath && !pbToken) {
    const url = req.nextUrl.clone()
    url.pathname = '/logowanie'
    url.searchParams.set('forbidden', '1')
    return NextResponse.redirect(url)
  }

  if (isAdminPath && pbToken) {
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
  matcher: ['/admin/:path*'],
}
