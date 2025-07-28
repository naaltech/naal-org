import { supabase, Certificate, CertificatePDF, UnifiedCertificate } from './supabase'

// Export UnifiedCertificate type
export type { UnifiedCertificate }

// PDF'li sertifika oluşturma
export async function createCertificatePDF(certificateData: {
  pdf_link: string
  given: string
  from: string
  date: string
  uid: string
  cert_name: string
}) {
  try {
    const { data, error } = await supabase
      .from('cert_pdf')
      .insert(certificateData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      certificate: data as CertificatePDF
    }
  } catch (error) {
    return {
      success: false,
      error: 'PDF sertifikası oluşturulurken hata oluştu'
    }
  }
}

// Standart sertifika oluşturma
export async function createCertificateStandard(certificateData: {
  creator: string
  head: string
  given: string
  date: string
  file_id: string
}) {
  try {
    const { data, error } = await supabase
      .from('cert')
      .insert(certificateData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      certificate: data as Certificate
    }
  } catch (error) {
    return {
      success: false,
      error: 'Standart sertifika oluşturulurken hata oluştu'
    }
  }
}

// UID oluşturma fonksiyonu
export function generateUID(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// File ID oluşturma fonksiyonu  
export function generateFileID(): string {
  return 'file_' + Math.random().toString(36).substr(2, 12)
}

// PDF sertifikalarını listeleme
export async function getPDFCertificates(limit = 50, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('cert_pdf')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return {
      success: true,
      certificates: data as CertificatePDF[]
    }
  } catch (error) {
    return {
      success: false,
      error: 'PDF sertifikaları getirilirken hata oluştu'
    }
  }
}

// Standart sertifikaları listeleme
export async function getStandardCertificates(limit = 50, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('cert')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return {
      success: true,
      certificates: data as Certificate[]
    }
  } catch (error) {
    return {
      success: false,
      error: 'Standart sertifikalar getirilirken hata oluştu'
    }
  }
}

// Tüm sertifikaları birleşik olarak listeleme
export async function getAllCertificatesUnified(limit = 50, offset = 0) {
  try {
    const pdfResult = await getPDFCertificates(Math.ceil(limit / 2), Math.ceil(offset / 2))
    const standardResult = await getStandardCertificates(Math.ceil(limit / 2), Math.ceil(offset / 2))

    const unifiedCertificates: UnifiedCertificate[] = []

    if (pdfResult.success && pdfResult.certificates) {
      pdfResult.certificates.forEach((cert: CertificatePDF) => {
        unifiedCertificates.push({
          id: cert.id,
          created_at: cert.created_at,
          given: cert.given,
          date: cert.date,
          cert_name: cert.cert_name,
          pdf_link: cert.pdf_link,
          from: cert.from,
          uid: cert.uid,
          type: 'pdf'
        })
      })
    }

    if (standardResult.success && standardResult.certificates) {
      standardResult.certificates.forEach((cert: Certificate) => {
        unifiedCertificates.push({
          id: cert.id,
          created_at: cert.created_at,
          given: cert.given,
          date: cert.date,
          head: cert.head,
          creator: cert.creator,
          file_id: cert.file_id,
          type: 'standard'
        })
      })
    }

    // Tarihe göre sırala
    unifiedCertificates.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return {
      success: true,
      certificates: unifiedCertificates
    }
  } catch (error) {
    return {
      success: false,
      error: 'Sertifikalar getirilirken hata oluştu'
    }
  }
}

// Sertifika istatistikleri
export async function getCertificateStats() {
  try {
    const { data: pdfData, error: pdfError, count: pdfCount } = await supabase
      .from('cert_pdf')
      .select('id', { count: 'exact' })

    const { data: standardData, error: standardError, count: standardCount } = await supabase
      .from('cert')
      .select('id', { count: 'exact' })

    if (pdfError || standardError) {
      throw new Error('İstatistikler getirilirken hata oluştu')
    }

    return {
      success: true,
      stats: {
        pdf_certificates: pdfCount || 0,
        standard_certificates: standardCount || 0,
        total: (pdfCount || 0) + (standardCount || 0)
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'İstatistikler getirilirken hata oluştu'
    }
  }
}
