# 🏫 NAAL - Nevzat Ayaz Anadolu Lisesi Etkileşim Ağı

**Nevzat Ayaz Anadolu Lisesi** öğrenci etkileşim platformu. Öğrencileri etkinlikler, kulüpler ve ortak ilgi alanları aracılığıyla birbirine bağlayan modern bir dijital platform.

## 🌟 Özellikler

### 📱 **Ana Platform**
- **Instagram Akışı**: Okul kulüplerinin Instagram paylaşımlarını tek platformda görüntüleme
- **Kulüp Sayfaları**: Her kulüp için özel sayfalar ve detaylı bilgiler
- **Sertifika Doğrulama**: Sertifika doğrulama sistemi
- **Öğrenci E-posta**: Google Workspace üzerinde öğrenci e-posta hesabı talebi

## 🚀 Teknoloji Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Icons**: Lucide React

## � Bağlı Repositories

Bu projenin tamamını anlamak için aşağıdaki repository'lere göz atabilirsiniz:

🛠️ [Etkileşim Ağı Yönetici Arayüzü](https://github.com/naaltech/naal-org-yonet)

📱 [Instagram Post Fetch](https://github.com/naaltech/instagram-post-fetch)

📰 [News API](https://github.com/naaltech/news-api)


## �📦 Kurulum

### Gereksinimler
- Node.js 18+ 
- pnpm (önerilen)
- Supabase hesabı

## 📁 Proje Yapısı

```
├── app/                    # Next.js App Router
│   ├── certificates/       # Sertifika doğrulama
│   ├── clubs/              # Kulüp sayfaları
│   ├── instagram/          # Instagram akışı
│   └── student-email/      # Öğrenci e-posta talebi
├── components/             # React bileşenleri
│   ├── ui/                 # Shadcn/ui bileşenleri
│   └── ...                 # Özel bileşenler
├── lib/                    # Utility fonksiyonları
├── public/                 # Statik dosyalar
└── supabase/              # Veritabanı şemaları
```

## 🔧 Konfigürasyon

### Supabase Kurulumu
1. [Supabase](https://supabase.com)'de yeni proje oluşturun
2. `supabase/schema.sql` dosyasını çalıştırın
3. Environment değişkenlerini güncelleyin

### Instagram Entegrasyonu
Instagram Business API ile otomatik paylaşım çekme özelliği mevcuttur.

## 📝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 🛠️ Geliştirme Rehberi

### Kod Standartları
- TypeScript kullanın
- ESLint kurallarına uyun
- Responsive tasarım prensiplerine uygun kod yazın
- Component'ları yeniden kullanılabilir şekilde tasarlayın

### Yeni Özellik Ekleme
1. `components/` klasöründe yeni bileşen oluşturun
2. `app/` klasöründe yeni sayfa ekleyin
3. Gerekirse `lib/supabase.ts`'te API fonksiyonları ekleyin

## 🚀 Deployment

### Vercel (Önerilen)
1. GitHub repository'sini Vercel'e bağlayın
2. Environment değişkenlerini ayarlayın
3. Otomatik deployment aktif olacaktır

### Manuel Deployment
```bash
pnpm build
pnpm start
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

