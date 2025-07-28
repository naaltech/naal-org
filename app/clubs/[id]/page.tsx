import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Users, ExternalLink, Instagram, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { getClubById, parseClubUrls, parseClubInstagram } from "@/lib/supabase"
import { notFound } from "next/navigation"

interface ClubPageProps {
  params: {
    id: string
  }
}

export default async function ClubPage({ params }: ClubPageProps) {
  const resolvedParams = await params
  const clubId = parseInt(resolvedParams.id)
  if (isNaN(clubId)) {
    notFound()
  }

  const { success, club } = await getClubById(clubId)
  
  if (!success || !club) {
    notFound()
  }

  const urls = parseClubUrls(club.urls)
  const instagrams = parseClubInstagram(club.instagram)
  
  // Logo path: naal+kulüp_kodu.png
  const logoPath = club.code ? `/logos/naal${club.code}.png` : "/placeholder.svg"

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

        {/* Club Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Club Logo */}
          <div className="md:col-span-1">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
              <Image
                src={logoPath}
                alt={club.title || "Kulüp Logosu"}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Club Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {club.title || "Kulüp Adı"}
              </h1>
              {club.code && (
                <Badge variant="secondary" className="mb-4">
                  Kod: {club.code}
                </Badge>
              )}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {club.description || "Kulüp açıklaması mevcut değil."}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              {club.owners && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Yöneticiler:</span>
                  <span>{club.owners}</span>
                </div>
              )}
              
              {instagrams.length > 0 && (
                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Instagram:</span>
                  <div className="flex flex-wrap gap-2">
                    {instagrams.map((ig, index) => (
                      <a
                        key={index}
                        href={ig.startsWith('http') ? ig : `https://instagram.com/${ig}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        @{ig.replace(/^@/, '')}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Links */}
            {urls.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Ek Bağlantılar:</h3>
                <div className="flex flex-wrap gap-2">
                  {urls.map((url, index) => (
                    <a
                      key={index}
                      href={url.startsWith('http') ? url : `https://${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Bağlantı {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">Hakkında</TabsTrigger>
            <TabsTrigger value="contact">İletişim</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-6">
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-4">Kulüp Hakkında</h3>
              <p className="text-muted-foreground leading-relaxed">
                {club.description || "Bu kulüp hakkında detaylı bilgi henüz eklenmemiş."}
              </p>
              
              {club.code && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Kulüp Kodu</h4>
                  <p className="font-mono text-sm">{club.code}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="mt-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">İletişim Bilgileri</h3>
              
              <div className="grid gap-4">
                {club.owners && (
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Yöneticiler</h4>
                      <p className="text-muted-foreground">{club.owners}</p>
                    </div>
                  </div>
                )}

                {instagrams.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Instagram className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Instagram</h4>
                      <div className="space-y-1">
                        {instagrams.map((ig, index) => (
                          <a
                            key={index}
                            href={ig.startsWith('http') ? ig : `https://instagram.com/${ig}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-primary hover:underline"
                          >
                            @{ig.replace(/^@/, '')}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {urls.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <ExternalLink className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Ek Bağlantılar</h4>
                      <div className="space-y-1">
                        {urls.map((url, index) => (
                          <a
                            key={index}
                            href={url.startsWith('http') ? url : `https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-primary hover:underline"
                          >
                            {url}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
