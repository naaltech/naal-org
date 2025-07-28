import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nevzat Ayaz Anadolu Lisesi - İstanbul Ümraniye Lider Eğitim Kurumu',
  description: 'Nevzat Ayaz Anadolu Lisesi - 1985\'ten beri İstanbul Ümraniye\'de kaliteli eğitim. Öğrenci kulüpleri, etkinlikler, sertifika doğrulama. İnkılap Mah. Yelkenciler Sok.',
  keywords: 'Nevzat Ayaz Anadolu Lisesi, NAAL, İstanbul lise, Ümraniye eğitim, Anadolu Lisesi, öğrenci kulüpleri, lise etkinlikleri, sertifika doğrulama, İnkılap Mahallesi',
  openGraph: {
    title: 'Nevzat Ayaz Anadolu Lisesi - İstanbul Ümraniye',
    description: '1985\'ten beri kaliteli eğitim veren Nevzat Ayaz Anadolu Lisesi. Öğrenci kulüpleri, etkinlikler ve modern eğitim anlayışı.',
    url: 'https://naal.org.tr',
    siteName: 'Nevzat Ayaz Anadolu Lisesi',
    images: [
      {
        url: 'https://naal.org.tr/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nevzat Ayaz Anadolu Lisesi - İstanbul Ümraniye',
      }
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nevzat Ayaz Anadolu Lisesi - İstanbul Ümraniye',
    description: '1985\'ten beri kaliteli eğitim veren lider eğitim kurumu.',
    site: '@NevzatAyazLise',
    images: ['https://naal.org.tr/og-image.png'],
  },
  alternates: {
    canonical: 'https://naal.org.tr',
  },
}

export default function HomePage() {
  return null // Bu sadece metadata için
}
