import { Metadata } from 'next'
import { verifyCertificateUnified } from '@/lib/supabase'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  
  try {
    const result = await verifyCertificateUnified(id)
    
    if (result.success && result.certificate) {
      const cert = result.certificate
      const title = `${cert.given} - ${cert.type === 'pdf' ? cert.cert_name : cert.head}`
      const description = `${cert.given} adlı kişiye verilen sertifika. ${cert.type === 'pdf' ? cert.from : cert.creator} tarafından düzenlenmiştir.`
      
      return {
        title: `${title} | Nevzat Ayaz Sertifika Doğrulama`,
        description,
        openGraph: {
          title,
          description,
          type: 'article',
          siteName: 'Nevzat Ayaz Anadolu Lisesi - Etkileşim Ağı',
          images: [
            {
              url: '/placeholder.svg?height=630&width=1200',
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: ['/placeholder.svg?height=630&width=1200'],
        },
        robots: {
          index: true,
          follow: true,
        },
      }
    }
  } catch (error) {
    console.error('Metadata generation error:', error)
  }

  return {
    title: 'Sertifika Bulunamadı | Nevzat Ayaz Sertifika Doğrulama',
    description: 'Aradığınız sertifika bulunamadı.',
  }
}

export default function CertificateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
