"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, CheckCircle, XCircle, Calendar, User, BookOpen, Hash, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { verifyCertificateUnified, UnifiedCertificate } from "@/lib/supabase"

export default function CertificateVerificationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [certificate, setCertificate] = useState<UnifiedCertificate | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Lütfen bir sertifika UID'si veya file ID'si girin")
      return
    }

    setIsLoading(true)
    setError(null)
    setCertificate(null)

    try {
      const result = await verifyCertificateUnified(searchQuery.trim())

      if (result.success && result.certificate) {
        setCertificate(result.certificate)
      } else {
        setError(result.error || "Sertifika doğrulanamadı")
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">
                  Sertifika Doğrulama
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Sertifika Doğrulama Sistemi
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Sertifika ID'si veya hash değeri ile sertifikaların geçerliliğini doğrulayın.
                  <br />
                  <span className="text-sm">
                    Eski sistem URL'leri (/cert) ve yeni sistem (/certificates) desteklenmektedir.
                  </span>
                </p>
              </div>

              <div className="w-full max-w-md space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Sertifika UID veya File ID girin..."
                    className="w-full bg-background pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>

                <Button onClick={handleSearch} disabled={isLoading} className="w-full">
                  {isLoading ? "Doğrulanıyor..." : "Sertifikayı Doğrula"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              {error && (
                <Alert className="mb-6 border-destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {certificate && (
                <Card className="mb-8 border-2 border-green-200 bg-green-50/50">
                  <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-green-100 p-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-green-800">
                        Sertifika Doğrulandı ✓
                      </CardTitle>
                      <CardDescription className="text-green-700">
                        Bu sertifika geçerli ve aktif durumda
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* PDF Sertifika için PDF Görüntüleme */}
                    {certificate.type === 'pdf' && certificate.pdf_link && (
                      <div className="mb-6">
                        <div className="bg-muted rounded-lg p-4">
                          <h3 className="font-semibold mb-2">PDF Sertifika</h3>
                          <iframe
                            src={certificate.pdf_link}
                            className="w-full h-96 border rounded"
                            title="Sertifika PDF"
                          />
                          <div className="mt-2">
                            <a
                              href={certificate.pdf_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              PDF'i Yeni Sekmede Aç
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {certificate.type === 'pdf' ? 'Verilen Kişi' : 'Verilen Kişi'}
                            </p>
                            <p className="font-semibold">{certificate.given}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {certificate.type === 'pdf' ? 'Sertifika Adı' : 'Başlık'}
                            </p>
                            <p className="font-semibold">
                              {certificate.type === 'pdf' ? certificate.cert_name : certificate.head}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Tarih
                            </p>
                            <p className="font-semibold">
                              {certificate.date ? formatDate(certificate.date) : 'Belirtilmemiş'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {certificate.type === 'pdf' ? 'UID' : 'File ID'}
                            </p>
                            <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                              {certificate.type === 'pdf' ? certificate.uid : certificate.file_id}
                            </p>
                          </div>
                        </div>

                        {certificate.type === 'pdf' && certificate.from && (
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Veren Kurum
                              </p>
                              <p className="font-semibold">{certificate.from}</p>
                            </div>
                          </div>
                        )}

                        {certificate.type === 'standard' && certificate.creator && (
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Oluşturan
                              </p>
                              <p className="font-semibold">{certificate.creator}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Oluşturulma Tarihi
                            </p>
                            <p className="font-semibold">
                              {formatDate(certificate.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {certificate.type === 'pdf' ? 'PDF Sertifika' : 'Standart Sertifika'}
                        </Badge>
                        <Badge variant="outline">
                          Doğrulandı
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/certificates/${certificate.type === 'pdf' ? certificate.uid : certificate.file_id}`}>
                            Detay Sayfasını Görüntüle
                          </Link>
                        </Button>
                        {certificate.type === 'pdf' && certificate.pdf_link && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={certificate.pdf_link} target="_blank" rel="noopener noreferrer">
                              PDF'i Aç
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!certificate && !error && (
                <div className="text-center py-12">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto mb-4 w-48 h-32 bg-muted rounded-lg flex items-center justify-center">
                      <Shield className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Sertifika Doğrulama
                    </h3>
                    <p className="text-muted-foreground">
                      Doğrulamak istediğiniz sertifikanın ID'sini veya hash değerini yukarıdaki alana girin.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-12 space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Nasıl Çalışır?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="text-center">
                      <div className="mx-auto rounded-full bg-primary/10 p-2 w-fit">
                        <Search className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">1. Sertifika Bilgisi</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Sertifika UID (PDF sertifikalar için) veya File ID (standart sertifikalar için) girin.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="text-center">
                      <div className="mx-auto rounded-full bg-primary/10 p-2 w-fit">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">2. Doğrulama</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Sistem hem PDF'li hem de standart sertifikaları tek sorgudan kontrol eder.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="text-center">
                      <div className="mx-auto rounded-full bg-primary/10 p-2 w-fit">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">3. Sonuç</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Sertifika bilgileri görüntülenir. PDF'li sertifikalar için PDF de renderlanır.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer/>
      </main>
    </div>
  )
}
