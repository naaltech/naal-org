import { createClient } from '@supabase/supabase-js'

// Supabase konfigürasyonu
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if we have valid credentials
const hasValidCredentials = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// PDF'li sertifika tipi tanımı
export interface CertificatePDF {
  id: number
  created_at: string
  pdf_link: string
  given: string
  from: string
  date: string
  uid: string
  cert_name: string
}

// PDF'siz sertifika tipi tanımı
export interface Certificate {
  id: number
  created_at: string
  creator: string
  head: string
  given: string
  date: string
  file_id: string
}

// Birleşik sertifika tipi
export interface UnifiedCertificate {
  id: number
  created_at: string
  given: string
  date: string
  cert_name?: string
  head?: string
  creator?: string
  pdf_link?: string
  from?: string
  uid?: string
  file_id?: string
  type: 'pdf' | 'standard'
}

// PDF'li sertifika doğrulama fonksiyonu
export async function verifyCertificatePDF(uid: string) {
  try {
    const { data, error } = await supabase
      .from('cert_pdf')
      .select('*')
      .eq('uid', uid)
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      certificate: data as CertificatePDF,
      type: 'pdf' as const
    }
  } catch (error) {
    return {
      success: false,
      error: 'PDF sertifikası bulunamadı veya geçersiz'
    }
  }
}

// PDF'siz sertifika doğrulama fonksiyonu
export async function verifyCertificateStandard(fileId: string) {
  try {
    const { data, error } = await supabase
      .from('cert')
      .select('*')
      .eq('file_id', fileId)
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      certificate: data as Certificate,
      type: 'standard' as const
    }
  } catch (error) {
    return {
      success: false,
      error: 'Standart sertifika bulunamadı veya geçersiz'
    }
  }
}

// Birleşik sertifika doğrulama fonksiyonu
export async function verifyCertificateUnified(identifier: string) {
  // Önce PDF sertifikalarında ara (uid ile)
  const pdfResult = await verifyCertificatePDF(identifier)
  if (pdfResult.success) {
    const cert = pdfResult.certificate as CertificatePDF
    return {
      success: true,
      certificate: {
        id: cert.id,
        created_at: cert.created_at,
        given: cert.given,
        date: cert.date,
        cert_name: cert.cert_name,
        pdf_link: cert.pdf_link,
        from: cert.from,
        uid: cert.uid,
        type: 'pdf' as const
      } as UnifiedCertificate
    }
  }

  // PDF bulunamazsa standart sertifikalarda ara (file_id ile)
  const standardResult = await verifyCertificateStandard(identifier)
  if (standardResult.success) {
    const cert = standardResult.certificate as Certificate
    return {
      success: true,
      certificate: {
        id: cert.id,
        created_at: cert.created_at,
        given: cert.given,
        date: cert.date,
        head: cert.head,
        creator: cert.creator,
        file_id: cert.file_id,
        type: 'standard' as const
      } as UnifiedCertificate
    }
  }

  // Eğer identifier sayısal ise, ID ile arama yap (eski sistem entegrasyonu için)
  // if (/^\d+$/.test(identifier)) {
  //   const idResult = await verifyCertificateById(parseInt(identifier))
  //   if (idResult.success) {
  //     return idResult
  //   }
  // }

  return {
    success: false,
    error: 'Sertifika bulunamadı veya geçersiz'
  }
}

// ID ile sertifika doğrulama fonksiyonu (eski sistem entegrasyonu için)
export async function verifyCertificateById(id: number) {
  try {
    // Önce PDF sertifikalarında ara
    const { data: pdfData, error: pdfError } = await supabase
      .from('cert_pdf')
      .select('*')
      .eq('id', id)
      .single()

    if (!pdfError && pdfData) {
      return {
        success: true,
        certificate: {
          id: pdfData.id,
          created_at: pdfData.created_at,
          given: pdfData.given,
          date: pdfData.date,
          cert_name: pdfData.cert_name,
          pdf_link: pdfData.pdf_link,
          from: pdfData.from,
          uid: pdfData.uid,
          type: 'pdf' as const
        } as UnifiedCertificate
      }
    }

    // PDF bulunamazsa standart sertifikalarda ara
    const { data: standardData, error: standardError } = await supabase
      .from('cert')
      .select('*')
      .eq('id', id)
      .single()

    if (!standardError && standardData) {
      return {
        success: true,
        certificate: {
          id: standardData.id,
          created_at: standardData.created_at,
          given: standardData.given,
          date: standardData.date,
          head: standardData.head,
          creator: standardData.creator,
          file_id: standardData.file_id,
          type: 'standard' as const
        } as UnifiedCertificate
      }
    }

    return {
      success: false,
      error: 'Sertifika bulunamadı'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Sertifika aranırken hata oluştu'
    }
  }
}

// Kulüp tipi tanımı
export interface Club {
  id: number
  created_at: string
  code: string | null
  description: string | null
  instagram: string | null
  owners: string | null
  logo: string | null
  title: string | null
  urls: string | null
}

// Instagram post tipi tanımı
export interface InstagramPost {
  id: number
  created_at: string
  name: string | null
  user_name: string | null
  time: string | null
  description: string | null
  image_links: { links: string[] } | null
  post_link: string | null
}

// Tüm kulüpleri getir
export async function getAllClubs() {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('title', { ascending: true })

    if (error) {
      throw error
    }

    return {
      success: true,
      clubs: data as Club[]
    }
  } catch (error) {
    return {
      success: false,
      error: 'Kulüpler yüklenirken hata oluştu'
    }
  }
}

// ID ile kulüp getir
export async function getClubById(id: number) {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      club: data as Club
    }
  } catch (error) {
    return {
      success: false,
      error: 'Kulüp bulunamadı'
    }
  }
}

// Kulüp URL'lerini parse et (virgülle ayrılmış)
export function parseClubUrls(urls: string | null): string[] {
  if (!urls) return []
  return urls.split(',').map(url => url.trim()).filter(url => url.length > 0)
}

// Kulüp Instagram hesaplarını parse et (virgülle ayrılmış)
export function parseClubInstagram(instagram: string | null): string[] {
  if (!instagram) return []
  return instagram.split(',').map(ig => ig.trim()).filter(ig => ig.length > 0)
}

// Kulüp özelinde Instagram postlarını getir
export async function getInstagramPostsByClub(clubInstagramAccounts: string[], limit: number = 8) {
  try {
    if (clubInstagramAccounts.length === 0) {
      return {
        success: true,
        posts: [],
        totalCount: 0
      }
    }

    // @ işaretini kaldır ve küçük harfe çevir
    const cleanAccounts = clubInstagramAccounts.map(account => 
      account.replace(/^@/, '').toLowerCase()
    )

    const { data, error, count } = await supabase
      .from('posts_instagram')
      .select('*', { count: 'exact' })
      .in('user_name', cleanAccounts)
      .order('time', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return {
      success: true,
      posts: data as InstagramPost[],
      totalCount: count || 0
    }
  } catch (error) {
    return {
      success: false,
      error: 'Instagram postları yüklenirken hata oluştu',
      posts: [],
      totalCount: 0
    }
  }
}

// Instagram postlarını getir - pagination desteği ile
export async function getInstagramPosts(limit: number = 10, offset: number = 0) {
  try {
    const { data, error, count } = await supabase
      .from('posts_instagram')
      .select('*', { count: 'exact' })
      .order('time', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return {
      success: true,
      posts: data as InstagramPost[],
      totalCount: count || 0,
      hasMore: (offset + limit) < (count || 0)
    }
  } catch (error) {
    return {
      success: false,
      error: 'Instagram postları yüklenirken hata oluştu',
      posts: [],
      totalCount: 0,
      hasMore: false
    }
  }
}

// Tek bir Instagram postunu ID ile getir
export async function getInstagramPostById(id: number) {
  try {
    const { data, error } = await supabase
      .from('posts_instagram')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      post: data as InstagramPost
    }
  } catch (error) {
    return {
      success: false,
      error: 'Instagram postu bulunamadı',
      post: null
    }
  }
}

// Instagram post ekle
export async function addInstagramPost(post: Omit<InstagramPost, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('posts_instagram')
      .insert([post])
      .select()
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      post: data as InstagramPost
    }
  } catch (error) {
    return {
      success: false,
      error: 'Instagram post eklenirken hata oluştu'
    }
  }
}

// Instagram post güncelle
export async function updateInstagramPost(id: number, updates: Partial<Omit<InstagramPost, 'id' | 'created_at'>>) {
  try {
    const { data, error } = await supabase
      .from('posts_instagram')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      post: data as InstagramPost
    }
  } catch (error) {
    return {
      success: false,
      error: 'Instagram post güncellenirken hata oluştu'
    }
  }
}

// Instagram post sil
export async function deleteInstagramPost(id: number) {
  try {
    const { error } = await supabase
      .from('posts_instagram')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: 'Instagram post silinirken hata oluştu'
    }
  }
}

// Instagram post resim linklerini parse et
export function parseInstagramImages(imageLinks: { links: string[] } | null): string[] {
  if (!imageLinks || !imageLinks.links) return []
  return imageLinks.links.filter(link => link && link.trim().length > 0)
}

// URL kısaltıcı için interface
export interface ShortUrl {
  id: number
  created_at: string
  club_code: string | null
  path: string | null
  redirect: string | null
}

// Club code ve path'e göre URL bulma fonksiyonu
export async function getShortUrlByClubCodeAndPath(clubCode: string, path: string) {
  try {
    const { data, error } = await supabase
      .from('url')
      .select('*')
      .eq('club_code', clubCode)
      .eq('path', path)
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      shortUrl: data as ShortUrl
    }
  } catch (error) {
    return {
      success: false,
      error: 'URL bulunamadı'
    }
  }
}

// Tüm club code'larını getirme fonksiyonu
export async function getAllClubCodes() {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select('code')
      .not('code', 'is', null)

    if (error) {
      throw error
    }

    return {
      success: true,
      clubCodes: data.map((club: { code: string | null }) => club.code).filter(Boolean) as string[]
    }
  } catch (error) {
    return {
      success: false,
      error: 'Club code\'ları getirilemedi'
    }
  }
}
