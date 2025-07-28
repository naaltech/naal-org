"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, BookOpen, Shield, Share2, Download, ExternalLink, ArrowLeft, Linkedin, Twitter, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from "@/components/header"
import { verifyCertificateUnified, UnifiedCertificate } from "@/lib/supabase"

export default function CertificateDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [certificate, setCertificate] = useState<UnifiedCertificate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href)
    }
    
    const fetchCertificate = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const result = await verifyCertificateUnified(id)
        
        if (result.success && result.certificate) {
          setCertificate(result.certificate)
        } else {
          setError("Sertifika bulunamadı")
        }
      } catch (err) {
        setError("Sertifika yüklenirken hata oluştu")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCertificate()
  }, [id])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getLinkedInShareUrl = () => {
    const certificateUrl = encodeURIComponent(shareUrl)
    const title = encodeURIComponent(certificate?.cert_name || certificate?.head || 'Sertifika')
    return `https://www.linkedin.com/sharing/share-offsite/?url=${certificateUrl}&title=${title}`
  }

  const getTwitterShareUrl = () => {
    const text = encodeURIComponent(`${certificate?.cert_name || certificate?.head || 'Sertifika'} - Nevzat Ayaz Etkileşim Ağı üzerinden doğrulandı`)
    const url = encodeURIComponent(shareUrl)
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`
  }

  const getFacebookShareUrl = () => {
    const url = encodeURIComponent(shareUrl)
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Sertifika yükleniyor...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !certificate) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sertifika Bulunamadı</h1>
            <p className="text-muted-foreground mb-8">
              Aradığınız sertifika bulunamadı veya geçersiz.
            </p>
            <div className="space-x-4">
              <Link href="/certificates">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Sertifika Doğrulamaya Geri Dön
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Ana Sayfa</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/certificates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Sertifika Doğrulamaya Geri Dön
            </Button>
          </Link>
        </div>

        {/* Success Alert */}
        <Alert className="mb-8 border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Bu sertifika başarıyla doğrulandı ve geçerlidir.
          </AlertDescription>
        </Alert>

        {/* Certificate Details */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Certificate Info */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {certificate.cert_name || certificate.head}
                    </CardTitle>
                    <Badge variant="secondary" className="mb-4">
                      {certificate.type === 'pdf' ? 'PDF Sertifikası' : 'Dijital Sertifika'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Certificate Image/PDF Preview */}
                {certificate.pdf_link && (
                  <div className="relative bg-muted rounded-lg overflow-hidden">
                    <div className="aspect-[4/3] relative">
                      <iframe
                        src={certificate.pdf_link}
                        className="w-full h-full border-0"
                        title="PDF Sertifikası"
                      />
                    </div>
                    <div className="p-4 text-center bg-background border-t">
                      <Button asChild>
                        <a href={certificate.pdf_link} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          PDF İndir
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Certificate Details */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Alıcı</p>
                      <p className="text-sm text-muted-foreground">{certificate.given}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Tarih</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(certificate.date).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>

                  {certificate.from && (
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Veren Kurum</p>
                        <p className="text-sm text-muted-foreground">{certificate.from}</p>
                      </div>
                    </div>
                  )}

                  {certificate.creator && (
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Oluşturan</p>
                        <p className="text-sm text-muted-foreground">{certificate.creator}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Technical Details */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Teknik Detaylar</h4>
                  <div className="grid gap-2 text-sm">
                    {certificate.uid && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">UID:</span>
                        <span className="font-mono">{certificate.uid}</span>
                      </div>
                    )}
                    {certificate.file_id && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">File ID:</span>
                        <span className="font-mono">{certificate.file_id}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sertifika ID:</span>
                      <span className="font-mono">{certificate.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Oluşturma Tarihi:</span>
                      <span>{new Date(certificate.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Doğrulama Durumu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 text-green-600">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Doğrulandı</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Bu sertifika resmi veritabanımızda kayıtlıdır ve geçerlidir.
                </p>
              </CardContent>
            </Card>

            {/* Share Options */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Paylaş</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(shareUrl)}
                  >
                    Kopyala
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a href={getLinkedInShareUrl()} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a href={getTwitterShareUrl()} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a href={getFacebookShareUrl()} target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">İşlemler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {certificate.pdf_link && (
                  <Button className="w-full" asChild>
                    <a href={certificate.pdf_link} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      PDF İndir
                    </a>
                  </Button>
                )}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      Başka Sertifika Doğrula
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Sertifika Doğrula</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="verify-id">Sertifika UID veya File ID</Label>
                        <Input
                          id="verify-id"
                          placeholder="Sertifika kimliğini buraya girin..."
                        />
                      </div>
                      <Button className="w-full" asChild>
                        <Link href="/certificates">
                          Doğrulama Sayfasına Git
                        </Link>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
