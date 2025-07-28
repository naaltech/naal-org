import Script from 'next/script'

export default function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Nevzat Ayaz Anadolu Lisesi",
    "alternateName": "NAAL",
    "url": "https://naal.org.tr",
    "logo": "https://naal.org.tr/logo.png",
    "image": "https://naal.org.tr/og-image.png",
    "description": "Nevzat Ayaz Anadolu Lisesi öğrenci etkileşim platformu",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "İnkılap Mah. Yelkenciler Sok. NO:1",
      "addressLocality": "Ümraniye",
      "addressRegion": "İstanbul",
      "addressCountry": "TR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90-216-631-7644",
      "email": "iletisim@naal.org.tr",
      "contactType": "school administrator",
      "availableLanguage": "Turkish"
    },
    "sameAs": [
      "https://www.instagram.com/nevzatayazanadolulisesi_/",
      "https://x.com/NevzatAyazLise",
      "https://www.youtube.com/@NaalRec",
      "https://nevzatayazal.meb.k12.tr",
      "https://ogr.nevzatayazal.k12.tr/",
      "https://nevzatayazal.k12.tr/",
      "https://www.linkedin.com/school/nevzatayazlisesi/"
    ],
    "foundingDate": "1985",
    "areaServed": {
      "@type": "Place",
      "name": "İstanbul, Türkiye"
    }
  }

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nevzat Ayaz Anadolu Lisesi Etkileşim Ağı",
    "url": "https://naal.org.tr",
    "description": "Nevzat Ayaz Anadolu Lisesi öğrenci etkileşim platformu",
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "Nevzat Ayaz Anadolu Lisesi"
    }
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": "https://naal.org.tr"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Sertifika Doğrulama",
        "item": "https://naal.org.tr/certificates"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "İnstagram Akışı",
        "item": "https://naal.org.tr/instagram"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Kulüp İnstagram Hesapları",
        "item": "https://naal.org.tr/instagram/accounts"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Öğrenci E-Posta Talebi",
        "item": "https://naal.org.tr/student-email"
      },

    ]
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
    </>
  )
}
