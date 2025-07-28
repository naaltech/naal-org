import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kulüp Instagram Hesapları - Nevzat Ayaz Etkileşim Ağı',
  description: 'Nevzat Ayaz Anadolu Lisesi kulüplerinin resmi Instagram hesapları. Tüm kulüpleri takip edin.',
  keywords: 'instagram hesapları, kulüp sosyal medya, NAAL kulüpler, instagram takip',
  openGraph: {
    title: 'Kulüp Instagram Hesapları - Nevzat Ayaz Etkileşim Ağı',
    description: 'Okulumuzun tüm kulüplerinin Instagram hesaplarını keşfedin',
    url: 'https://naal.org.tr/instagram/accounts',
  },
  alternates: {
    canonical: 'https://naal.org.tr/instagram/accounts',
  },
}

export default function InstagramAccountsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
