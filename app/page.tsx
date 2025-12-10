import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import InstagramFeed from "@/components/instagram-feed"
import BannerSlider from "@/components/banner-slider"
import OfficialNewsSection from "@/components/official-news-section"
import StructuredData from "@/components/structured-data"

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col">
      <StructuredData />
      <Header />

      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4 max-w-5xl">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                <span style={{ color: '#2ea5d5' }}>Nevzat Ayaz Anadolu Lisesi</span><br/> Etkileşim Ağı
              </h1>
              <p className="max-w-3xl mx-auto text-muted-foreground text-lg md:text-xl lg:text-2xl">
                Öğrencileri etkinlikler, kulüpler ve ortak ilgi alanları aracılığıyla birbirine bağlıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Slider replacing Logo Scroller */}
      <BannerSlider />

      {/* Instagram Feed Section */}
      <InstagramFeed />

      {/* Official News Section */}
      <OfficialNewsSection />
      
      {/* Other Websites Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4 max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Diğer Websitelerimiz
              </h2>
              <p className="max-w-3xl mx-auto text-muted-foreground text-lg md:text-xl">
                Okulumuzun farklı alanlardaki projelerini ve etkinliklerini keşfedin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full max-w-6xl">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-center">
                    Teknoloji Kulübü
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Nevzat Ayaz Anadolu Lisesi Teknoloji Kulübü
                  </p>
                  <Link href="https://tech.naal.org.tr" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      tech.naal.org.tr
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-center">
                    Hackathon Turnuvası
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Nevzat Ayaz Anadolu Lisesi Hackathon Turnuvası
                  </p>
                  <Link href="https://hack.naal.org.tr" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      hack.naal.org.tr
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-center">
                    Fen Bilimleri Çalıştayı
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Nevzat Ayaz Anadolu Lisesi Fen Bilimleri Çalıştayı
                  </p>
                  <Link href="https://fbc.naal.org.tr" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      fbc.naal.org.tr
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-center">
                    Meclis Simülasyonu
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Nevzat Ayaz Anadolu Lisesi Meclis Simülasyonu
                  </p>
                  <Link href="https://meclis.naal.org.tr" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      meclis.naal.org.tr
                    </Button>
                  </Link>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>
      
      {/* Certificate Verification Section */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4 max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Sertifika Sistemi
              </h2>
              <p className="max-w-3xl mx-auto text-muted-foreground text-lg md:text-xl">
                Öğrenci sertifikalarının geçerliliğini hızlı ve güvenli bir şekilde doğrulayın.
              </p>
            </div>

            <div className="mt-12">
              <Link href="/certificates" passHref>
                <Button size="lg" className="gap-2 px-8 py-4 text-lg">
                  Sertifika Doğrula <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
