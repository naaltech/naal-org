"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, User, BookOpen, Shield, Search, Filter, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import { getAllCertificatesUnified, UnifiedCertificate } from "@/lib/certificate-utils"

export default function CertificateListPage() {
  const [certificates, setCertificates] = useState<UnifiedCertificate[]>([])
  const [filteredCertificates, setFilteredCertificates] = useState<UnifiedCertificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    const fetchCertificates = async () => {
      setIsLoading(true)
      try {
        const result = await getAllCertificatesUnified(100, 0)
        if (result.success && result.certificates) {
          setCertificates(result.certificates)
          setFilteredCertificates(result.certificates)
        }
      } catch (error) {
        console.error("Sertifikalar yüklenirken hata:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  useEffect(() => {
    let filtered = certificates

    // Arama filtresi
    if (searchQuery) {
      filtered = filtered.filter(cert =>
        cert.given.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.cert_name && cert.cert_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cert.head && cert.head.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cert.creator && cert.creator.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cert.from && cert.from.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Tip filtresi
    if (typeFilter !== "all") {
      filtered = filtered.filter(cert => cert.type === typeFilter)
    }

    setFilteredCertificates(filtered)
  }, [searchQuery, typeFilter, certificates])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Tüm Sertifikalar
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Sistemde kayıtlı tüm sertifikaları görüntüleyin ve arayın.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Sertifika ara (isim, başlık, kurum)..."
                    className="w-full bg-background pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sertifika Tipi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Sertifikalar</SelectItem>
                    <SelectItem value="pdf">PDF Sertifikalar</SelectItem>
                    <SelectItem value="standard">Standart Sertifikalar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{filteredCertificates.length}</div>
                      <div className="text-sm text-muted-foreground">Toplam Sertifika</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {filteredCertificates.filter(c => c.type === 'pdf').length}
                      </div>
                      <div className="text-sm text-muted-foreground">PDF Sertifika</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {filteredCertificates.filter(c => c.type === 'standard').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Standart Sertifika</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Certificates Grid */}
              {filteredCertificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCertificates.map((certificate) => (
                    <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Badge variant="outline" className="mb-2">
                            {certificate.type === 'pdf' ? 'PDF' : 'Standart'}
                          </Badge>
                          <Badge variant="secondary">#{certificate.id}</Badge>
                        </div>
                        <CardTitle className="line-clamp-2">
                          {certificate.type === 'pdf' ? certificate.cert_name : certificate.head}
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4" />
                            <span>{certificate.given}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          {certificate.date && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(certificate.date)}</span>
                            </div>
                          )}

                          {certificate.type === 'pdf' && certificate.from && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <BookOpen className="h-4 w-4" />
                              <span>{certificate.from}</span>
                            </div>
                          )}

                          {certificate.type === 'standard' && certificate.creator && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <BookOpen className="h-4 w-4" />
                              <span>{certificate.creator}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Shield className="h-4 w-4" />
                            <span className="font-mono text-xs">
                              {certificate.type === 'pdf' ? certificate.uid : certificate.file_id}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button variant="default" size="sm" className="flex-1" asChild>
                            <Link href={`/certificates/${certificate.type === 'pdf' ? certificate.uid : certificate.file_id}`}>
                              Detayları Gör
                            </Link>
                          </Button>
                          
                          {certificate.type === 'pdf' && certificate.pdf_link && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={certificate.pdf_link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto mb-4 w-48 h-32 bg-muted rounded-lg flex items-center justify-center">
                      <Search className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Sertifika Bulunamadı
                    </h3>
                    <p className="text-muted-foreground">
                      Aradığınız kriterlere uygun sertifika bulunamadı. Arama terimlerinizi değiştirmeyi deneyin.
                    </p>
                  </div>
                </div>
              )}

              {/* Back to Verification */}
              <div className="flex justify-center mt-12">
                <Button variant="outline" asChild>
                  <Link href="/certificates">
                    Sertifika Doğrulamaya Dön
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
