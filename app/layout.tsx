import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://naal.org.tr'),
  title: {
    default: 'Nevzat Ayaz Anadolu Lisesi - Etkileşim Ağı',
    template: '%s | Nevzat Ayaz Anadolu Lisesi'
  },
  description: 'Nevzat Ayaz Anadolu Lisesi Etkileşim Ağı - Öğrencileri etkinlikler, kulüpler ve ortak ilgi alanları aracılığıyla birbirine bağlıyoruz.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  keywords: [
    'Nevzat Ayaz Anadolu Lisesi',
    'NAAL',
    'İstanbul Anadolu Lisesi',
    'Ümraniye Lise',
    'Öğrenci Kulüpleri',
    'Sertifika Doğrulama',
    'Eğitim',
    'Lise Etkinlikleri',
    'İnkılap Mahallesi',
    'Yelkenciler Sokak',
    'Nevzat Ayaz',
    'Anadolu Lisesi İstanbul'
  ],
  authors: [{ name: 'Nevzat Ayaz Anadolu Lisesi' }],
  creator: 'Nevzat Ayaz Anadolu Lisesi',
  publisher: 'Nevzat Ayaz Anadolu Lisesi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://naal.org.tr',
    title: 'Nevzat Ayaz Anadolu Lisesi - Etkileşim Ağı',
    description: 'Öğrencileri etkinlikler, kulüpler ve ortak ilgi alanları aracılığıyla birbirine bağlıyoruz.',
    siteName: 'Nevzat Ayaz Anadolu Lisesi',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Nevzat Ayaz Anadolu Lisesi'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nevzat Ayaz Anadolu Lisesi - Etkileşim Ağı',
    description: 'Öğrencileri etkinlikler, kulüpler ve ortak ilgi alanları aracılığıyla birbirine bağlıyoruz.',
    site: '@NevzatAyazLise',
    creator: '@NevzatAyazLise',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://naal.org.tr',
  },
  category: 'education',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <head>
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        <link rel="canonical" href="https://naal.org.tr" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="antialiased min-w-0 w-full">{children}</body>
    </html>
  )
}
