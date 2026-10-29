import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Next.js 16'da middleware.ts yerine proxy.ts kullanılıyor (aynı işlev, yeni isim)

const MAIN_SITE_URL = 'https://naal.org.tr'

// Club code olarak değerlendirilmeyecek subdomain'ler
const RESERVED_SUBDOMAINS = new Set(['www', 'cert'])

// Supabase istemcisini sadece gerektiğinde ve bilgiler varsa oluştur
// (modül seviyesinde boş URL ile createClient hata fırlatır ve tüm istekleri bozar)
let supabase: SupabaseClient | null = null
function getSupabase() {
  if (supabase) return supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return null
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  })
  return supabase
}

// Host'tan subdomain'i çıkar (örn: ieee.naal.org.tr -> ieee). Ana domain için null döner.
function getSubdomain(hostname: string) {
  const host = hostname.split(':')[0].toLowerCase()
  const labels = host.split('.')
  // localhost'ta da test edilebilsin: ieee.localhost
  if (labels.length === 2 && labels[1] === 'localhost') return labels[0]
  // naal.org.tr gibi 3 parçalı domain'de subdomain yok
  if (labels.length <= 3) return null
  return labels[0]
}

// URL kısaltıcı: <club_code>.naal.org.tr/<path> -> url tablosundaki redirect adresi
async function handleShortUrl(clubCode: string, pathname: string) {
  const client = getSupabase()
  if (!client) return null

  try {
    const { data: club, error: clubError } = await client
      .from('clubs')
      .select('id')
      .eq('code', clubCode)
      .maybeSingle()

    // Böyle bir kulüp yoksa normal akışa devam et
    if (clubError || !club) return null

    // Path'i düzelt: başındaki /'yi kaldır
    const cleanPath = pathname.replace(/^\/+/, '')

    const { data: urlData, error: urlError } = await client
      .from('url')
      .select('redirect')
      .eq('club_code', clubCode)
      .eq('path', cleanPath)
      .maybeSingle()

    if (!urlError && urlData?.redirect) {
      return NextResponse.redirect(urlData.redirect)
    }

    // Kısa URL yoksa (kök dahil) kulübün kendi sayfasına yönlendir
    return NextResponse.redirect(`${MAIN_SITE_URL}/clubs/${club.id}`)
  } catch (error) {
    console.error('URL kısaltıcı hatası:', error)
    return null
  }
}

// cert.naal.org.tr -> sertifika doğrulama sayfaları
function handleCertSubdomain(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // /certificates ve eski sistem /cert URL'leri doğrudan geçer
  if (pathname.startsWith('/cert')) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()

  // Direkt ID ile geliyorsa (örn: /1234), /certificates/<id>'ye yönlendir
  const idPattern = /^\/([0-9a-zA-Z-]+)$/
  if (idPattern.test(pathname)) {
    url.pathname = `/certificates${pathname}`
    return NextResponse.redirect(url)
  }

  // Root ve diğer tüm path'ler için sertifika doğrulama sayfasına yönlendir
  url.pathname = '/certificates'
  return NextResponse.redirect(url)
}

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host')
  if (!hostname) return NextResponse.next()

  const subdomain = getSubdomain(hostname)
  if (!subdomain) return NextResponse.next()

  if (subdomain === 'cert') {
    return handleCertSubdomain(request)
  }

  if (!RESERVED_SUBDOMAINS.has(subdomain)) {
    const response = await handleShortUrl(subdomain, request.nextUrl.pathname)
    if (response) return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Aşağıdakiler hariç tüm path'ler:
     * - api (API route'ları)
     * - _next/static, _next/image (Next.js dosyaları)
     * - uzantılı dosyalar (favicon.ico, logo.png, robots.txt vb. public dosyaları)
     */
    '/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)',
  ],
}
