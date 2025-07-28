"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface OfficialNews {
  baslik: string
  url: string
  kaynak: string
  yayinTarihi: string
}

interface NewsResponse {
  success: boolean
  count: number
  data: OfficialNews[]
}

export default function OfficialNewsSection() {
  const [news, setNews] = useState<OfficialNews[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('https://news.naal.org.tr/api/haberler?format=json')
        const data: NewsResponse = await response.json()
        
        if (data.success) {
          // Son 6 haberi al
          setNews(data.data.slice(0, 6))
        }
      } catch (error) {
        console.error('Haberler yüklenirken hata oluştu:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-16 bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Okuldan Resmi Haberler</h2>
            <p className="text-muted-foreground">Haberler yükleniyor...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12 md:py-16 bg-muted/50">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Okuldan Resmi Haberler</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nevzat Ayaz Anadolu Lisesi'nden en güncel haberler ve duyurular
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-muted-foreground px-2 py-1 rounded-full" style={{ backgroundColor: '#cbebf7', color: '#226882' }}>
                    Resmi Haber 
                  </span>
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-3">
                  {item.baslik}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {item.kaynak}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="gap-1"
                    >
                      Devamını Oku
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {news.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Şu anda görüntülenecek haber bulunmuyor.</p>
          </div>
        )}
      </div>
    </section>
  )
}
