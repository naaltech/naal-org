import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  
  // Eğer subdomain cert. ile başlıyorsa
  if (hostname?.startsWith('cert.')) {
    const url = request.nextUrl.clone()
    const pathname = url.pathname
    
    // Eğer zaten /certificates ile başlıyorsa, doğrudan geç
    if (pathname.startsWith('/certificates')) {
      return NextResponse.next()
    }
    
    // Eğer /cert ile başlıyorsa, doğrudan geç (eski sistem URL'leri için)
    if (pathname.startsWith('/cert')) {
      return NextResponse.next()
    }
    
    // Root path ise sertifika doğrulama sayfasına yönlendir
    if (pathname === '/') {
      url.pathname = '/certificates'
      return NextResponse.redirect(url)
    }
    
    // Eğer direkt ID ile geliyorsa (örn: /1234 gibi), certificates/id'ye yönlendir
    const idPattern = /^\/([0-9a-zA-Z-]+)$/
    if (idPattern.test(pathname)) {
      url.pathname = `/certificates${pathname}`
      return NextResponse.redirect(url)
    }
    
    // Diğer tüm path'ler için sertifika doğrulama sayfasına yönlendir
    url.pathname = '/certificates'
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
