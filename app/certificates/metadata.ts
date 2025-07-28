import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sertifika Doğrulama - Nevzat Ayaz Anadolu Lisesi | Güvenli Belge Kontrolü',
  description: 'Nevzat Ayaz Anadolu Lisesi öğrenci sertifikalarını güvenli bir şekilde doğrulayın. UID veya File ID ile anında sertifika geçerliliğini kontrol edin.',
  keywords: 'sertifika doğrulama, NAAL sertifika, öğrenci belgesi, belge kontrolü, Nevzat Ayaz Anadolu Lisesi, güvenli doğrulama',
  openGraph: {
    title: 'Sertifika Doğrulama - Nevzat Ayaz Anadolu Lisesi',
    description: 'Öğrenci sertifikalarını güvenli bir şekilde doğrulayın. Anında sonuç alın.',
    url: 'https://naal.org.tr/certificates',
    type: 'website',
  },
  alternates: {
    canonical: 'https://naal.org.tr/certificates',
  },
  robots: {
    index: true,
    follow: true,
  }
}
