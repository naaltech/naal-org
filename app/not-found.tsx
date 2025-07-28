import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, ArrowLeft, Search } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 md:px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* 404 Icon */}
          <div className="relative">
            <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">404</span>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Sayfa Bulunamadı
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
              URL'yi kontrol edin veya ana sayfaya dönün.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Ana Sayfaya Dön</CardTitle>
                <CardDescription>
                  Nevzat Ayaz Anadolu Lisesi ana sayfasına geri dönün
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Ana Sayfa
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Sertifika Ara</CardTitle>
                <CardDescription>
                  Sertifika doğrulama sayfasına gidin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/certificates">
                    <Search className="mr-2 h-4 w-4" />
                    Sertifika Doğrula
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hızlı Erişim</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/clubs">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kulüpler
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/instagram">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Instagram Akışı
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/student-email">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Öğrenci E-posta
                </Link>
              </Button>
            </div>
          </div>

          {/* Error Details */}
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Teknik Bilgi</CardTitle>
              <CardDescription>
                Bu hata hakkında daha fazla bilgi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Hata Kodu:</span>
                  <span className="ml-2 font-mono">404 Not Found</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Durum:</span>
                  <span className="ml-2">Sayfa bulunamadı</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Eğer bu hatayı sürekli alıyorsanız, lütfen website yönetimi ile iletişime geçin.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer/>
    </div>
  )
} 