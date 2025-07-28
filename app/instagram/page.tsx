"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { ExternalLink, Calendar, ArrowLeft, ChevronLeft, ChevronRight, Share, Copy } from "lucide-react"
import { SiInstagram } from '@icons-pack/react-simple-icons'
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getInstagramPosts, getInstagramPostById, parseInstagramImages, InstagramPost } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Instagram page content component
function InstagramPageContent() {
  const searchParams = useSearchParams()
  const sharedPostId = searchParams.get('post')
  const { toast } = useToast()
  
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [loadedPostsFromDB, setLoadedPostsFromDB] = useState(0) // DB'den yüklenen gerçek post sayısı
  const [removedPostForShared, setRemovedPostForShared] = useState(false) // Shared post için post çıkarıldı mı?
  const [highlightedPostId, setHighlightedPostId] = useState<number | null>(
    sharedPostId ? parseInt(sharedPostId) : null
  )
  const [hasScrolledToSharedPost, setHasScrolledToSharedPost] = useState(false)
  const postsPerPage = 12

  // Image carousel state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedPostImages, setSelectedPostImages] = useState<{postId: number, imageIndex: number} | null>(null)
  const [dialogImageIndex, setDialogImageIndex] = useState<{[postId: number]: number}>({}) // Her post için son görülen indeksi sakla

  // Share functionality
  const sharePost = async (post: InstagramPost, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    const shareUrl = `${window.location.origin}/instagram?post=${post.id}`
    const shareData = {
      title: `${post.name || 'NAAL Kulüp'} Instagram Paylaşımı`,
      text: post.description ? post.description.substring(0, 100) + '...' : 'Instagram paylaşımını görüntüle',
      url: shareUrl
    }

    // Try native sharing first (mobile devices)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        return
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error)
        }
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link kopyalandı!",
        description: "Paylaşım linki panoya kopyalandı.",
      })
    } catch (error) {
      console.error('Copy failed:', error)
      // Fallback: show the URL in a prompt
      prompt('Link kopyalamak için Ctrl+C yapın:', shareUrl)
    }
  }

  // Image carousel component
  const ImageCarousel = ({ images, postName, initialIndex = 0, postId }: { images: string[], postName: string, initialIndex?: number, postId: number }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    // Update current index when initial index changes
    useEffect(() => {
      setCurrentIndex(initialIndex)
    }, [initialIndex])

    const nextImage = () => {
      const newIndex = (currentIndex + 1) % images.length
      setCurrentIndex(newIndex)
      // Save to parent state
      setDialogImageIndex(prev => ({
        ...prev,
        [postId]: newIndex
      }))
    }

    const prevImage = () => {
      const newIndex = (currentIndex - 1 + images.length) % images.length
      setCurrentIndex(newIndex)
      // Save to parent state
      setDialogImageIndex(prev => ({
        ...prev,
        [postId]: newIndex
      }))
    }

    const goToImage = (index: number) => {
      setCurrentIndex(index)
      // Save to parent state
      setDialogImageIndex(prev => ({
        ...prev,
        [postId]: index
      }))
    }

    return (
      <div className="relative w-full">
        <div className="relative aspect-square">
          <Image
            src={images[currentIndex]}
            alt={`${postName} - ${currentIndex + 1}/${images.length}`}
            fill
            className="object-cover rounded-lg"
          />
          
          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </>
          )}
          
          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {currentIndex + 1}/{images.length}
            </div>
          )}
        </div>
        
        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1 sm:gap-2 mt-3 sm:mt-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-pink-500 ring-2 ring-pink-500/50' 
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  useEffect(() => {
    async function fetchInitialPosts() {
      console.log('Instagram posts çekiliyor...')
      setIsLoading(true)
      
      // İlk olarak normal postları yükle
      const result = await getInstagramPosts(postsPerPage, 0)
      console.log('Instagram posts result:', result)
      
      if (result.success && result.posts) {
        console.log('İlk posts bulundu:', result.posts.length)
        setPosts(result.posts)
        setTotalCount(result.totalCount)
        setHasMore(result.hasMore)
        setLoadedPostsFromDB(result.posts.length) // DB'den yüklenen gerçek sayıyı kaydet
        
        // Eğer shared post ID varsa ve o post ilk yüklenen postlar arasında değilse
        if (sharedPostId) {
          const postId = parseInt(sharedPostId)
          const foundPost = result.posts.find(post => post.id === postId)
          
          if (!foundPost) {
            console.log('Shared post ilk 12 arasında değil, aranıyor:', postId)
            // Shared post'u ayrıca getir ve listenin başına ekle
            const sharedPostResult = await getInstagramPostById(postId)
            if (sharedPostResult.success && sharedPostResult.post) {
              console.log('Shared post bulundu, listenin başına ekleniyor')
              // Shared post'u başa ekle, son postu çıkar (12 post kalsın)
              setPosts(prevPosts => {
                const filtered = prevPosts.filter(p => p.id !== sharedPostResult.post!.id)
                const newPosts = [sharedPostResult.post!, ...filtered]
                // Son postu çıkar ki 12 post kalsın
                return newPosts.slice(0, postsPerPage)
              })
              // Shared post için bir post çıkardık, bunu işaretle
              setLoadedPostsFromDB(prev => prev - 1)
              setRemovedPostForShared(true)
            } else {
              console.log('Shared post veritabanında bulunamadı:', postId)
            }
          } else {
            console.log('Shared post ilk 12 arasında bulundu:', postId)
          }
        }
      } else {
        console.log('Instagram posts çekilemedi:', result.error)
        setHasMore(false)
      }
      setIsLoading(false)
    }

    fetchInitialPosts()
  }, [sharedPostId])

  // Scroll to shared post when loaded
  useEffect(() => {
    if (sharedPostId && posts.length > 0 && !hasScrolledToSharedPost) {
      const postId = parseInt(sharedPostId)
      const foundPost = posts.find(post => post.id === postId)
      
      if (foundPost) {
        console.log('Shared post bulundu, scroll ediliyor:', postId)
        // Hemen scroll attempt başlat
        setHasScrolledToSharedPost(true) // Önce mark et ki tekrar çalışmasın
        
        const scrollToPost = () => {
          const postElement = document.getElementById(`post-${postId}`)
          if (postElement) {
            postElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            toast({
              title: "Paylaşım bulundu!",
              description: `${foundPost.name || 'Kulüp'} paylaşımı gösteriliyor.`,
            })
            // Remove highlight after 8 seconds
            setTimeout(() => setHighlightedPostId(null), 8000)
          } else {
            // DOM element henüz hazır değil, biraz bekle
            setTimeout(scrollToPost, 100)
          }
        }
        
        setTimeout(scrollToPost, 300) // İlk deneme
      }
      // Post bulunamadı durumunu artık burada handle etmiyoruz
      // Çünkü post async olarak yüklenebilir
    }
  }, [posts, sharedPostId, toast, hasScrolledToSharedPost])

  // Shared post için ayrı bir timeout effect - sadece post gerçekten bulunamazsa çalışır
  useEffect(() => {
    if (sharedPostId && !hasScrolledToSharedPost) {
      const timeoutId = setTimeout(() => {
        const postId = parseInt(sharedPostId)
        const foundPost = posts.find(post => post.id === postId)
        
        if (!foundPost && !hasScrolledToSharedPost) {
          console.log('Timeout: Shared post bulunamadı:', postId)
          toast({
            title: "Paylaşım bulunamadı",
            description: "Aranan Instagram paylaşımı bulunamadı.",
            variant: "destructive"
          })
          setHasScrolledToSharedPost(true)
        }
      }, 3000) // 3 saniye bekle, hala yoksa error göster

      return () => clearTimeout(timeoutId)
    }
  }, [sharedPostId, posts, hasScrolledToSharedPost, toast])

  // Gerçek pagination ile daha fazla post yükle
  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    console.log('Daha fazla post yükleniyor...', { currentLength: posts.length, loadedFromDB: loadedPostsFromDB, totalCount })
    
    try {
      // Offset'i DB'den yüklenen gerçek post sayısına göre hesapla
      // Eğer shared post için bir post çıkarıldıysa, her seferinde +1 fazla çek
      const offset = loadedPostsFromDB
      const loadLimit = removedPostForShared ? postsPerPage + 1 : postsPerPage
      const result = await getInstagramPosts(loadLimit, offset)
      
      if (result.success && result.posts && result.posts.length > 0) {
        console.log('Yeni posts bulundu:', result.posts.length)
        // Duplicate posts'u önlemek için filter yap
        setPosts(prevPosts => {
          const existingIds = new Set(prevPosts.map(p => p.id))
          const newUniquePosts = result.posts.filter(p => !existingIds.has(p.id))
          // Eğer shared post için fazla yüklediyse, sadece postsPerPage kadar ekle
          const postsToAdd = removedPostForShared ? newUniquePosts.slice(0, postsPerPage) : newUniquePosts
          return [...prevPosts, ...postsToAdd]
        })
        setTotalCount(result.totalCount)
        setHasMore(result.hasMore)
        setLoadedPostsFromDB(prev => prev + result.posts.length) // DB'den yüklenen sayıyı güncelle
      } else {
        console.log('Daha fazla post bulunamadı')
        setHasMore(false)
      }
    } catch (error) {
      console.error('Daha fazla post yüklenirken hata:', error)
      setHasMore(false)
    }
    
    setLoadingMore(false)
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 py-12">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center">
              <SiInstagram className="h-12 w-12 mx-auto mb-4" style={{ color: '#2ea5d5' }} />
              <h1 className="text-3xl font-bold mb-2">Instagram Paylaşımları</h1>
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Tüm yüklenen postları göster (artık client-side pagination gerek yok)
  const currentPosts = posts

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      
      <div className="flex-1 py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-3">
                <SiInstagram className="h-8 w-8" style={{ color: '#2ea5d5' }} />
                <div>
                  <h1 className="text-3xl font-bold">Instagram Paylaşımları</h1>
                  <p className="text-muted-foreground">
                    Kulüplerimizden {totalCount} paylaşım
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/instagram/accounts"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-black/80 transition-all"
              >
                <SiInstagram className="h-4 w-4" />
                Kulüp Instagram Hesapları
              </Link>
              <Link
                href="https://www.instagram.com/nevzatayazanadolulisesi_/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-black/80 transition-all"
              >
                <SiInstagram className="h-4 w-4" />
                Resmi Instagram Hesabımız
              </Link>
            </div>
          </div>

          {/* Posts Grid */}
          {currentPosts.length === 0 ? (
            <div className="text-center py-16">
              <SiInstagram className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Henüz paylaşım bulunmuyor</h2>
              <p className="text-muted-foreground mb-6">
                Kulüplerimizin paylaşımları burada görünecek
              </p>
              <Link
                href="https://www.instagram.com/nevzatayazanadolulisesi_/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>
                  <SiInstagram className="h-4 w-4 mr-2" />
                  Instagram'da Takip Et
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentPosts.map((post: InstagramPost) => {
                  const images = parseInstagramImages(post.image_links)
                  const mainImage = images.length > 0 ? images[0] : "/placeholder.svg"
                  
                  return (
                    <Card 
                      key={post.id} 
                      id={`post-${post.id}`}
                      className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                        highlightedPostId === post.id 
                          ? 'ring-4 ring-blue-500 ring-offset-4 bg-blue-50 dark:bg-blue-950/30 shadow-xl transform scale-105' 
                          : ''
                      }`}
                    >
                      <CardContent className="p-0">
                        {/* Header */}
                        <div className="p-4 border-b">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {post.name ? post.name.charAt(0).toUpperCase() : 'K'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{post.name || 'Kulüp'}</p>
                              <p className="text-xs text-muted-foreground">
                                {post.user_name ? `@${post.user_name}` : '@kulup'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Image */}
                        <div className="relative aspect-square">
                          {images.length > 1 ? (
                            <Dialog onOpenChange={(open) => {
                              if (!open) {
                                setSelectedPostImages(null)
                              }
                            }}>
                              <DialogTrigger asChild>
                                <div className="cursor-pointer relative w-full h-full">
                                  <Image
                                    src={mainImage}
                                    alt={`Instagram post by ${post.name || 'Kulüp'}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                    onClick={() => setSelectedPostImages({postId: post.id, imageIndex: 0})}
                                  />
                                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                    +{images.length - 1}
                                  </div>
                                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                    <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                      {images.length} fotoğraf
                                    </div>
                                  </div>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-[95vw] sm:max-w-3xl lg:max-w-4xl max-h-[95vh] overflow-y-auto p-3 sm:p-6">
                                <DialogHeader>
                                  <DialogTitle className="sr-only">
                                    {post.name || 'Kulüp'} Instagram Paylaşımı
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 pb-3 border-b">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                                      <span className="text-xs font-bold text-white">
                                        {post.name ? post.name.charAt(0).toUpperCase() : 'K'}
                                      </span>
                                    </div>
                                    <div>
                                      <h3 className="text-base sm:text-lg font-semibold">{post.name || 'Kulüp'}</h3>
                                      <p className="text-xs sm:text-sm text-muted-foreground">
                                        {post.user_name ? `@${post.user_name}` : '@kulup'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <ImageCarousel 
                                    images={images} 
                                    postName={post.name || 'Kulüp'} 
                                    postId={post.id}
                                    initialIndex={dialogImageIndex[post.id] ?? (selectedPostImages?.postId === post.id ? selectedPostImages.imageIndex : 0)}
                                  />
                                  
                                  {post.description && (
                                    <div className="border-t pt-4">
                                      <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                        {post.description}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {/* Post meta */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                      {post.time && (
                                        <>
                                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                          <span>{new Date(post.time).toLocaleDateString('tr-TR')}</span>
                                        </>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => sharePost(post, e)}
                                        className="gap-2 text-xs sm:text-sm"
                                      >
                                        <Share className="h-3 w-3 sm:h-4 sm:w-4" />
                                        Paylaş
                                      </Button>
                                      
                                      {post.post_link && (
                                        <Link
                                          href={post.post_link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs sm:text-sm text-primary hover:underline"
                                        >
                                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                                          Instagram'da Gör
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <Image
                              src={mainImage}
                              alt={`Instagram post by ${post.name || 'Kulüp'}`}
                              fill
                              className="object-cover"
                              loading="lazy"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {post.description && (
                            <p className="text-sm line-clamp-4 mb-3 leading-relaxed">
                              {post.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {post.time && (
                                <p className="text-xs text-muted-foreground">
                                  {new Date(post.time).toLocaleDateString('tr-TR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => sharePost(post, e)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                title="Paylaşım linkini kopyala"
                              >
                                <Share className="h-4 w-4" />
                              </Button>
                              
                              {post.post_link && (
                                <Link 
                                  href={post.post_link}
                                  style={{color: '#2ea5d5'}} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs font-medium hover:underline"
                                >
                                  Instagram'da Gör
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <Button 
                    onClick={loadMorePosts}
                    disabled={loadingMore}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <SiInstagram className="h-4 w-4" />
                    {loadingMore ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
                  </Button>
                </div>
              )}

              {/* Stats */}
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  {currentPosts.length} / {totalCount} paylaşım gösteriliyor
                  {loadingMore && ' • Yeni postlar yükleniyor...'}
                </p>
                
                {/* Performance bilgisi */}
                <p className="text-xs text-muted-foreground mt-1">
                  {posts.length > postsPerPage && `Memory'de ${posts.length} post yüklü`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
      <Toaster />
    </main>
  )
}

// Loading component
function InstagramPageLoading() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center">
            <SiInstagram className="h-12 w-12 mx-auto mb-4" style={{ color: '#2ea5d5' }} />
            <h1 className="text-3xl font-bold mb-2">Instagram Paylaşımları</h1>
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

// Main export with Suspense wrapper
export default function InstagramPage() {
  return (
    <Suspense fallback={<InstagramPageLoading />}>
      <InstagramPageContent />
    </Suspense>
  )
}
