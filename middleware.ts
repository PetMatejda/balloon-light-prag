import { NextRequest, NextResponse } from 'next/server'

const locales = ['cs', 'en', 'hu', 'es', 'it', 'de']
const defaultLocale = 'cs'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip if pathname starts with /_next, /api, or is a static file
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Always use default locale (Czech) for root path
    // Users can manually switch language if needed
    const locale = defaultLocale

    // Handle root path
    if (pathname === '/') {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }

    // e.g. incoming request is /products
    // The new URL is now /cs/products
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    )
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|images|.*\\..*).*)',
  ],
}
