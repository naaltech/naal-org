import { defineMiddleware } from 'astro:middleware'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const MAIN_SITE_URL = 'https://naal.org.tr'

// Club code olarak değerlendirilmeyecek subdomain'ler
const RESERVED_SUBDOMAINS = new Set(['www', 'cert'])

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-DNS-Prefetch-Control': 'on',
}

// Ana domain'deki sayfalar CDN'de kısa süre tutulur, süre dolunca eski kopya
// verilirken yenisi arka planda hazırlanır. Yeni deploy önbelleği temizler.
const CDN_CACHE_CONTROL = 'public, durable, s-maxage=60, stale-while-revalidate=600'

// Önbellekten dönen yanıtta middleware çalışmaz, subdomain'ler birbirine karışmamalı.
const CDN_CACHE_KEY = 'query,header=Host'

// Supabase istemcisini sadece gerektiğinde ve bilgiler varsa oluştur
// (modül seviyesinde boş URL ile createClient hata fırlatır ve tüm istekleri bozar)
let supabase: SupabaseClient | null = null
function getSupabase() {
  if (supabase) return supabase
  const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return null
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  })
  return supabase
}

function redirect(location: string) {
  return new Response(null, { status: 307, headers: { Location: location } })
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
      .select('*')
      .eq('code', clubCode)
      .maybeSingle()

    // Böyle bir kulüp yoksa ya da dizinde kapatıldıysa normal akışa devam et
    if (clubError || !club || club.is_active === false) return null

    // Path'i düzelt: başındaki /'yi kaldır
    const cleanPath = pathname.replace(/^\/+/, '')

    const { data: urlData, error: urlError } = await client
      .from('url')
      .select('redirect')
      .eq('club_code', clubCode)
      .eq('path', cleanPath)
      .maybeSingle()

    if (!urlError && urlData?.redirect) {
      return redirect(urlData.redirect)
    }

    // Kısa URL yoksa (kök dahil) kulübün kendi sayfasına yönlendir
    return redirect(`${MAIN_SITE_URL}/clubs/${club.id}`)
  } catch (error) {
    console.error('URL kısaltıcı hatası:', error)
    return null
  }
}

// cert.naal.org.tr -> sertifika doğrulama sayfaları
function handleCertSubdomain(pathname: string) {
  // /certificates ve eski sistem /cert URL'leri doğrudan geçer
  if (pathname.startsWith('/cert')) return null

  // Direkt ID ile geliyorsa (örn: /1234), /certificates/<id>'ye yönlendir
  if (/^\/([0-9a-zA-Z-]+)$/.test(pathname)) {
    return redirect(`/certificates${pathname}`)
  }

  // Root ve diğer tüm path'ler için sertifika doğrulama sayfasına yönlendir
  return redirect('/certificates')
}

function getHostname(request: Request) {
  return request.headers.get('host') ?? new URL(request.url).host
}

// Sertifika sonuçları her zaman güncel veriden gelmeli.
function isCacheable(request: Request, pathname: string, status: number) {
  return (
    request.method === 'GET' &&
    status === 200 &&
    !pathname.startsWith('/cert') &&
    !getSubdomain(getHostname(request))
  )
}

async function handleSubdomain(request: Request, pathname: string) {
  // Uzantılı dosyalar (favicon.ico, logo.png, robots.txt vb.) ve Astro dosyaları yönlendirilmez
  if (pathname.startsWith('/_') || /\.[^/]+$/.test(pathname)) return null

  const subdomain = getSubdomain(getHostname(request))
  if (!subdomain) return null

  if (subdomain === 'cert') return handleCertSubdomain(pathname)
  if (RESERVED_SUBDOMAINS.has(subdomain)) return null

  return handleShortUrl(subdomain, pathname)
}

export const onRequest = defineMiddleware(async (context, next) => {
  const response =
    (await handleSubdomain(context.request, context.url.pathname)) ?? (await next())

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(name, value)
  }

  response.headers.set('Netlify-Vary', CDN_CACHE_KEY)
  if (isCacheable(context.request, context.url.pathname, response.status)) {
    response.headers.set('Netlify-CDN-Cache-Control', CDN_CACHE_CONTROL)
  }

  return response
})
