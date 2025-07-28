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

      {/* Certificate Verification Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4 max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Sertifika Doğrulama
              </h2>
              <p className="max-w-3xl mx-auto text-muted-foreground text-lg md:text-xl">
                Öğrenci sertifikalarının geçerliliğini hızlı ve güvenli bir şekilde doğrulayın.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-6xl">
              <Card className="text-center border-0 shadow-lg h-full">
                <CardHeader className="pb-4">
                  <div className="mx-auto rounded-full bg-green-100 p-4 w-fit mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Güvenli Doğrulama</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Güvenli veritabanı teknolojisiyle sertifika doğrulama
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg h-full">
                <CardHeader className="pb-4">
                  <div className="mx-auto rounded-full bg-blue-100 p-4 w-fit mb-4">
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Hızlı Kontrol</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sertifika UID veya File ID ile anında doğrulama yapın
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg h-full">
                <CardHeader className="pb-4">
                  <div className="mx-auto rounded-full bg-purple-100 p-4 w-fit mb-4">
                    <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Şeffaf Sistem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tüm sertifika bilgileri şeffaf ve erişilebilir
                  </p>
                </CardContent>
              </Card>
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
