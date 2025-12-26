import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase konfigürasyonu
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  const pathname = request.nextUrl.pathname
  
  // URL kısaltıcı entegrasyonu - Önce bunu kontrol et
  if (hostname) {
    try {
      // Tüm club code'larını getir
      const { data: clubsData, error: clubsError } = await supabase
        .from('clubs')
        .select('code')
        .not('code', 'is', null)
      
      if (!clubsError && clubsData) {
        const clubCodes = clubsData.map((club: { code: string | null }) => club.code).filter(Boolean) as string[]
        
        // Hostname'in herhangi bir club code'unu içerip içermediğini kontrol et
        const matchedClubCode = clubCodes.find(code => 
          hostname.includes(code) || hostname.startsWith(`${code}.`)
        )
        
        if (matchedClubCode) {
          // Path'i düzelt: başındaki /'yi kaldır
          const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname
          
          // URL tablosundan redirect URL'yi bul
          const { data: urlData, error: urlError } = await supabase
            .from('url')
            .select('redirect')
            .eq('club_code', matchedClubCode)
            .eq('path', cleanPath)
            .single()
          
          if (!urlError && urlData && urlData.redirect) {
            // Redirect URL'ye yönlendir
            return NextResponse.redirect(urlData.redirect)
          } else {
            // URL bulunamazsa, ana siteye yönlendir
            return NextResponse.redirect('https://naal.org.tr')
          }
        }
      }
    } catch (error) {
      console.error('URL kısaltıcı hatası:', error)
    }
  }
  
  // Eğer subdomain cert. ile başlıyorsa
  if (hostname?.startsWith('cert.')) {
    const url = request.nextUrl.clone()
    
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
