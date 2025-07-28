"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu, X, Mail, MapPin, Instagram, Twitter, Youtube } from "lucide-react"
import { useState, useEffect } from "react"
import { getAllClubs, type Club } from "@/lib/supabase"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [clubs, setClubs] = useState<Club[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCertSubdomain, setIsCertSubdomain] = useState(false)

  useEffect(() => {
    // Subdomain kontrolü
    if (typeof window !== 'undefined') {
      setIsCertSubdomain(window.location.hostname.startsWith('cert.'))
    }

    async function loadClubs() {
      const { success, clubs: clubsData } = await getAllClubs()
      if (success && clubsData) {
        setClubs(clubsData)
      }
      setIsLoading(false)
    }
    loadClubs()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      {/* Upper Header */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-2 text-sm">
            {/* Left side - Contact Info */}
            <div className="hidden md:flex items-center space-x-6 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>E-Posta: <a href="mailto:iletisim@naal.org.tr" className="hover:text-foreground transition-colors">iletisim@naal.org.tr</a></span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Konum: <a href="https://www.google.com/maps?q=İnkılap+Mah.+Yelkenciler+Sok.+NO:1+Ümraniye/İstanbul" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">İnkılap Mah. Yelkenciler Sok. NO:1 Ümraniye/İstanbul</a></span>
              </div>
            </div>

            {/* Right side - Social Media */}
            <div className="flex items-center space-x-3">
              <a 
                href="https://www.instagram.com/nevzatayazanadolulisesi_/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://x.com/NevzatAyazLise" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://www.youtube.com/@NaalRec" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={isCertSubdomain ? "/certificates" : "/"} className="flex items-center space-x-2">
          <span className="font-bold text-xl" style={{ color: '#2ea5d5' }}>
            {isCertSubdomain ? "cert.naal.org.tr" : "naal.org.tr"}
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {!isCertSubdomain && (
            <>
              <Link href="/instagram" passHref>
                <Button variant="ghost">Instagram Akışı</Button>
              </Link>
              <Link href="/student-email" passHref>
                <Button variant="ghost">Öğrenci E-posta</Button>
              </Link>
            </>
          )}
          <Link href="/certificates" passHref>
            <Button variant="ghost">Sertifika Doğrula</Button>
          </Link>

          {!isCertSubdomain && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Okul Kulüpleri <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!isLoading && clubs.map((club) => (
                  <DropdownMenuItem key={club.id}>
                    <Link href={`/clubs/${club.id}`} className="w-full">
                      {club.title || 'Kulüp Adı'}
                    </Link>
                  </DropdownMenuItem>
                ))}
                {clubs.length === 0 && !isLoading && (
                  <DropdownMenuItem disabled>
                    Henüz kulüp yok
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {isCertSubdomain && (
            <Button variant="outline" asChild>
              <a href="https://naal.org.tr" target="_blank" rel="noopener noreferrer">
                Ana Siteye Git
              </a>
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-background border-b md:hidden">
            <div className="container py-4 space-y-2">
              {!isCertSubdomain && (
                <>
                  <Link href="/instagram" passHref className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      Instagram Akışı
                    </Button>
                  </Link>
                  <Link href="/student-email" passHref className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      Öğrenci E-posta
                    </Button>
                  </Link>
                </>
              )}
              <Link href="/certificates" passHref className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Sertifika Doğrula
                </Button>
              </Link>

              {!isCertSubdomain && (
                <div className="pt-2 border-t">
                  <p className="px-4 py-2 text-sm font-medium text-muted-foreground">Okul Kulüpleri</p>
                  {!isLoading && clubs.map((club) => (
                    <Link key={club.id} href={`/clubs/${club.id}`} passHref className="block">
                      <Button variant="ghost" className="w-full justify-start pl-6">
                        {club.title || 'Kulüp Adı'}
                      </Button>
                    </Link>
                  ))}
                  {clubs.length === 0 && !isLoading && (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Henüz kulüp yok
                    </div>
                  )}
                </div>
              )}

              {isCertSubdomain && (
                <div className="pt-2 border-t">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://naal.org.tr" target="_blank" rel="noopener noreferrer">
                      Ana Siteye Git
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </header>
  )
}
