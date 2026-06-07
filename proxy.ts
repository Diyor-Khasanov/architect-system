import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PATHS = [
  '/audit-logs',
  '/daily-reports',
  '/dashboard',
  '/files',
  '/help-requests',
  '/monthly-reports',
  '/notifications',
  '/profile',
  '/projects',
  '/tasks',
  '/team',
  '/users',
]

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  const hasAuthMode = request.cookies.has('auth_mode')
  const hasAuthValue = request.cookies.has('auth_value')

  if (hasAuthMode && hasAuthValue) {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/login'
  loginUrl.searchParams.set('next', pathname)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
