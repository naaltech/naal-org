import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instagram Paylaşımları - Nevzat Ayaz Etkileşim Ağı',
  description: 'Nevzat Ayaz Anadolu Lisesi kulüplerinin Instagram paylaşımları. Tüm kulüp güncellemelerini takip edin.',
  keywords: 'instagram, kulüp paylaşımları, öğrenci içerikleri, sosyal medya, NAAL',
  openGraph: {
    title: 'Instagram Paylaşımları - Nevzat Ayaz Etkileşim Ağı',
    description: 'Kulüplerden en güncel Instagram paylaşımları',
    url: 'https://naal.org.tr/instagram',
  },
  alternates: {
    canonical: 'https://naal.org.tr/instagram',
  },
}

export default function InstagramLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
