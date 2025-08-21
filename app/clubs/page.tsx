import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Users, Globe } from "lucide-react"
import { SiInstagram } from '@icons-pack/react-simple-icons'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { getAllClubs, parseClubInstagram } from "@/lib/supabase"
import Footer from "@/components/footer"

export default async function ClubsPage() {
  const { success, clubs } = await getAllClubs()
  const clubsData = success && clubs ? clubs : []

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Tüm Kulüplerimiz
          </h1>
          <p className="max-w-3xl text-muted-foreground text-lg">
            Okuldaki tüm kulüpleri keşfedin ve ilginizi çeken alanlarda aktif olun.
          </p>
        </div>

        {/* Clubs Grid */}
        {clubsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubsData.map((club) => {
              // Logo'yu veritabanından al, yoksa placeholder kullan
              const logoPath = club.logo || "/placeholder.svg"
              const instagrams = parseClubInstagram(club.instagram)
              
              return (
                <Card key={club.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={logoPath}
                      alt={club.title || "Kulüp Logosu"}
                      fill
                      className="object-cover"
                    />
                  </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {club.code && (
                      <Badge variant="secondary" className="text-xs">
                        {club.code}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    {club.title || "Kulüp Adı"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-muted-foreground line-clamp-3">
                    {club.description || "Kulüp açıklaması mevcut değil."}
                  </p>
                  
                  {/* Contact info preview */}
                  <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                    {club.owners && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="truncate">{club.owners.split(',')[0]}</span>
                      </div>
                    )}
                    {instagrams.length > 0 && (
                      <div className="flex items-center gap-1">
                        <SiInstagram className="h-3 w-3" />
                        <span className="truncate">@{instagrams[0].replace(/^@/, '')}</span>
                      </div>
                    )}
                    {club.urls && (
                      <Globe className="h-3 w-3" />
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href={`/clubs/${club.id}`} passHref className="w-full">
                    <Button variant="outline" className="w-full">
                      Detayları Gör <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Henüz Kulüp Yok</h3>
            <p className="text-muted-foreground max-w-md">
              Şu anda hiç kulüp kaydedilmemiş. Yakında yeni kulüpler eklenecek.
            </p>
          </div>
        )}
        
      </main>
      <Footer/>
    </div>
  )
}
