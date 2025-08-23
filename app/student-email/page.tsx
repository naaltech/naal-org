"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Mail, Upload, Info, CheckCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function StudentEmailRequestPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    personalEmail: "",
    grade: "",
    studentNumber: "",
    studentDocument: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Privacy Policy Component
  const PrivacyPolicyDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <button className=" hover:underline" style={{ color: '#2ea5d5' }}>
          Gizlilik Politikası
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Öğrenci E-posta Talebi Gizlilik Politikası</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <section>
            <h3 className="font-semibold mb-2">1. Veri Sorumlusu</h3>
            <p>naal.org.tr platformu, öğrenci e-posta hesabı talep formunda toplanan kişisel verilerin sorumlusudur.</p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">2. Toplanan Kişisel Veriler</h3>
            <p>Bu form aracılığıyla aşağıdaki kişisel veriler toplanmaktadır:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Ad ve soyad bilgileri</li>
              <li>Telefon numarası</li>
              <li>Kişisel e-posta adresi</li>
              <li>Sınıf bilgisi</li>
              <li>Okul numarası</li>
              <li>Öğrencilik belgesi (isteğe bağlı)</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">3. Verilerin İşlenme Amacı</h3>
            <p>Toplanan kişisel veriler yalnızca aşağıdaki amaçlarla işlenmektedir:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Google Workspace platformu üzerinde öğrenci e-posta hesabı oluşturulması</li>
              <li>Başvuru sürecinin yönetimi ve takibi</li>
              <li>Öğrenci kimlik doğrulaması</li>
              <li>Başvuru sahibi ile iletişim kurulması</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">4. Verilerin Saklanma Süresi</h3>
            <p>Kişisel verileriniz:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>E-posta hesabı oluşturulana kadar başvuru sisteminde saklanır</li>
              <li>Oluşturulan e-posta hesabı mezuniyetten 1 sene sonra silinir</li>
              <li>Başvuru kayıtları yasal saklama süreleri doğrultusunda korunur</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">5. Verilerin Paylaşımı</h3>
            <p>Kişisel verileriniz:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Yalnızca e-posta hesabı oluşturma sürecinde yetkili okul personeli tarafından işlenir</li>
              <li>Google Workspace hizmet sağlayıcısı ile hesap oluşturma amacıyla paylaşılır</li>
              <li>Üçüncü taraflarla ticari amaçlarla paylaşılmaz</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">6. Veri Güvenliği</h3>
            <p>Kişisel verilerinizin güvenliği için:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Teknik ve idari güvenlik önlemleri alınmaktadır</li>
              <li>Veriler şifrelenmiş ortamlarda saklanmaktadır</li>
              <li>Yetkisiz erişimlere karşı koruma sağlanmaktadır</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">7. Haklarınız</h3>
            <p>KVKK kapsamında sahip olduğunuz haklar:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenen verileriniz hakkında bilgi talep etme</li>
              <li>Verilerin düzeltilmesini veya silinmesini isteme</li>
              <li>Başvurunuzu geri çekme</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">8. İletişim</h3>
            <p>Gizlilik politikası ile ilgili sorularınız için:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>E-posta: iletisim@naal.org.tr</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">9. Politika Güncellemeleri</h3>
            <p>Bu gizlilik politikası gerektiğinde güncellenebilir. Önemli değişiklikler kayıtlı e-posta adresinize bildirilecektir.</p>
          </section>

          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <p className="text-xs text-gray-600">
              <strong>Son Güncelleme:</strong> 28 Temmuz 2025<br/>
              Bu politika 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca hazırlanmıştır.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      studentDocument: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Create FormData object to handle file upload
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.firstName)
      formDataToSend.append('surname', formData.lastName)
      formDataToSend.append('phone', formData.phoneNumber)
      formDataToSend.append('email', formData.personalEmail)
      formDataToSend.append('grade', formData.grade)
      formDataToSend.append('studentNumber', formData.studentNumber)
      
      // Add document if provided
      if (formData.studentDocument) {
        formDataToSend.append('document', formData.studentDocument)
      }

      // Send to API
      const response = await fetch('https://forms.naal.org.tr/', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const errorText = await response.text()
        throw new Error(`Form submission failed: ${response.status} ${errorText}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError('Başvuru gönderilirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.phoneNumber && 
           formData.personalEmail && 
           formData.grade && 
           formData.studentNumber
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-700">Başvurunuz Alındı</CardTitle>
              <CardDescription>
                Öğrenci e-posta hesabı talebiniz başarıyla gönderildi.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Başvurunuz incelendikten sonra e-posta hesabınız oluşturulacak ve 
                işlemler için belirttiğiniz e-posta adresi üzerinden iletişime geçilecektir.
              </p>
              <p className="text-sm text-muted-foreground">
                İşlem süreci yaklaşık 1-3 iş günü sürmektedir.
              </p>
              <Button 
                onClick={() => {
                  setIsSubmitted(false)
                  setSubmitError(null)
                  setFormData({
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
                    personalEmail: "",
                    grade: "",
                    studentNumber: "",
                    studentDocument: null
                  })
                }}
                variant="outline"
                className="mt-6"
              >
                Yeni Başvuru Yap
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 mr-2" style={{ color: '#2ea5d5' }}/>
            <h1 className="text-3xl font-bold">Öğrenci E-posta Talebi</h1>
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Google Workspace platformu üzerinde @ogr.nevzatayazal.k12.tr uzantılı 
            öğrenci e-posta hesabı için başvuru yapın.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-2xl">Başvuru İşleme Süreci</h3>
            </div>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
              Form üzerinden iletilen veriler, <a href="https://www.llama.com/models/llama-4/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors"><strong>Llama 4 Maverick</strong></a> tabanlı başvuru işleme modülü tarafından işlenmektedir. Başvurular modül tarafından değerlendirilir. Doğrulanan başvurular için, <a href="https://developers.google.com/workspace/admin/directory/v1/guides?hl=tr" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors"><strong>Google Workspace Directory API</strong></a> kullanılarak e-posta hesabı otomatik olarak oluşturulur. Başvuran öğrencinin hesap bilgileri ve başvuru sonucu, modül tarafından oluşturulan sonuç yazısı ile <a href="mailto:mail@naal.org.tr" className="hover:text-foreground transition-colors"><strong>mail@naal.org.tr</strong></a> e-posta adresi üzerinden öğrencinin formda belirttiği e-posta adresine gönderilir.
              </p>
              <p>Başvuru işleme modülü, <strong>Yukarı Dudullu Mah. 3. Cad. No:4, Ümraniye/İstanbul</strong> adresinde bulunan <a href="https://www.equinix.com/data-centers/europe-colocation/turkey-colocation/istanbul-data-centers/il2" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors"><strong>Equinix IL2 Data Center</strong></a>’da barındırılmaktadır. Sunucu erişimleri kayda alınmakta olup, sunucuya erişim sadece <strong>SSH anahtarı</strong> ile sağlanmaktadır. Bu yapı sayesinde öğrenci verileri üçüncü taraflarla paylaşılmamaktadır ve veri güvenliği sağlanmaktadır.</p>
            </div>
          </CardContent>
        </Card>

        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Önemli Bilgiler</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>• E-posta hesabınız Google Workspace platformu üzerinde oluşturulacaktır.</p>
            <p>• E-posta adresi formatı: ad.soyad@ogr.nevzatayazal.k12.tr</p>
            <p>• Hesap mezuniyetten 1 sene sonra otomatik olarak silinecektir.</p>
            <p>• Öğrencilik belgesi zorunlu değildir ancak işlemi hızlandırabilir.</p>
          </AlertDescription>
        </Alert>
        

        <Card>
          <CardHeader>
            <CardTitle>Başvuru Formu</CardTitle>
            <CardDescription>
              Lütfen tüm zorunlu alanları eksiksiz doldurun.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Adınızı girin"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Soyadınızı girin"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Telefon Numarası *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  placeholder="0555 123 45 67"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personalEmail">Kişisel E-posta *</Label>
                <Input
                  id="personalEmail"
                  type="email"
                  value={formData.personalEmail}
                  onChange={(e) => handleInputChange("personalEmail", e.target.value)}
                  placeholder="ornek@gmail.com"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  İşlemler için bu e-posta adresi üzerinden iletişime geçilecektir.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Sınıf *</Label>
                  <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sınıfınızı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9">9. Sınıf</SelectItem>
                      <SelectItem value="10">10. Sınıf</SelectItem>
                      <SelectItem value="11">11. Sınıf</SelectItem>
                      <SelectItem value="12">12. Sınıf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentNumber">Okul Numarası *</Label>
                  <Input
                    id="studentNumber"
                    type="text"
                    value={formData.studentNumber}
                    onChange={(e) => handleInputChange("studentNumber", e.target.value)}
                    placeholder="1234"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentDocument">
                  Öğrencilik Belgesi
                  <span className="text-sm text-muted-foreground ml-1">(İsteğe bağlı)</span>
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="studentDocument"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="studentDocument" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {formData.studentDocument 
                        ? formData.studentDocument.name 
                        : "Dosya seçin veya buraya sürükleyin"
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG (Maks. 5MB)
                    </p>
                  </label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Başvuru Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Başvuruyu Gönder
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Başvuru göndererek{" "}
                <PrivacyPolicyDialog />
                'nı okuduğunuzu ve kabul ettiğinizi beyan edersiniz.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
