"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Instagram, ExternalLink, ArrowLeft, Users, LinkIcon } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getAllClubs, parseClubInstagram, Club } from "@/lib/supabase"

export default function InstagramAccountsPage() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchClubs() {
      console.log('Kulüpler çekiliyor...')
      const { success, clubs: clubsData } = await getAllClubs()
      console.log('Kulüpler result:', { success, clubsData })
      
      if (success && clubsData) {
        // Sadece Instagram hesabı olan kulüpleri filtrele
        const clubsWithInstagram = clubsData.filter(club => {
          const instagramAccounts = parseClubInstagram(club.instagram)
          return instagramAccounts.length > 0
        })
        console.log('Instagram hesabı olan kulüpler:', clubsWithInstagram.length)
        setClubs(clubsWithInstagram)
      } else {
        console.log('Kulüpler çekilemedi')
      }
      setIsLoading(false)
    }

    fetchClubs()
  }, [])

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 py-12">
          <div className="container max-w-4xl mx-auto px-4 md:px-6">
            <div className="text-center">
              <Instagram className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Kulüp Instagram Hesapları</h1>
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      
      <div className="flex-1 py-12">
        <div className="container max-w-4xl mx-auto px-4 md:px-6">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/instagram" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-3">
                <LinkIcon className="h-8 w-8" style={{ color: '#2ea5d5' }} />
                <div>
                  <h1 className="text-3xl font-bold">Kulüp Instagram Hesapları</h1>
                  <p className="text-muted-foreground">
                    {clubs.length} kulübün Instagram hesapları
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-6 border">
              <Instagram className="h-12 w-12 mx-auto mb-4" style={{ color: '#2ea5d5' }} />
              <h2 className="text-xl font-semibold mb-2">Tüm Kulüplerimizi Takip Edin</h2>
              <p className="text-muted-foreground mb-4">
                Okulumuzun aktif kulüplerinin Instagram hesaplarını keşfedin ve takip edin
              </p>
              <div className="flex justify-center">
                <Link
                  href="https://www.instagram.com/nevzatayazanadolulisesi_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full hover:from-pink-600 hover:to-orange-500 transition-all"
                >
                  <Instagram className="h-4 w-4" />
                  Resmi Okul Hesabımız
                </Link>
              </div>
            </div>
          </div>

          {/* Clubs List */}
          {clubs.length === 0 ? (
            <div className="text-center py-16">
              <Instagram className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Henüz Instagram hesabı bulunmuyor</h2>
              <p className="text-muted-foreground mb-6">
                Kulüplerimizin Instagram hesapları burada görünecek
              </p>
              <Link href="/clubs">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Tüm Kulüpleri Gör
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {clubs.map((club) => {
                const instagramAccounts = parseClubInstagram(club.instagram)
                
                return (
                  <Card key={club.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Club Logo */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-200 dark:border-pink-800">
                            <Image
                              src={club.logo || "/placeholder.svg"}
                              alt={`${club.title} logo`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Club Info */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-3">
                            <h3 className="text-xl font-bold mb-1">
                              {club.title || 'Kulüp Adı'}
                            </h3>
                            {club.description && (
                              <p className="text-muted-foreground text-sm line-clamp-2">
                                {club.description}
                              </p>
                            )}
                          </div>

                          {/* Instagram Accounts */}
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground mb-2">
                              Instagram Hesapları:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {instagramAccounts.map((account, index) => {
                                // Instagram URL'sini temizle ve username'i çıkar
                                const username = account.replace(/https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '')
                                const cleanUrl = account.startsWith('http') ? account : `https://instagram.com/${account}`
                                
                                return (
                                  <Link
                                    key={index}
                                    href={cleanUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all hover:scale-105"
                                  >
                                    <Instagram className="h-4 w-4" />
                                    @{username}
                                    <ExternalLink className="h-3 w-3" />
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Club Link */}
                        <div className="flex-shrink-0">
                          <Link href={`/clubs/${club.id}`}>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Users className="h-4 w-4" />
                              Kulüp Sayfası
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Kulübünüzün Instagram Hesabı Eksik mi?</h3>
              <p className="text-muted-foreground mb-4">
                Kulüp yöneticileri Instagram hesaplarını eklemek için bizimle iletişime geçebilir
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/clubs">
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    Tüm Kulüpler
                  </Button>
                </Link>
                <Link href="/instagram">
                  <Button className="gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram Paylaşımları
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {clubs.length} kulübün Instagram hesapları listeleniyor
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
