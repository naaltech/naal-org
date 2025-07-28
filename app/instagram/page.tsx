"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Instagram, ExternalLink, Calendar, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getInstagramPosts, parseInstagramImages, InstagramPost } from "@/lib/supabase"

export default function InstagramPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const postsPerPage = 12

  // Image carousel state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Image carousel component
  const ImageCarousel = ({ images, postName }: { images: string[], postName: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextImage = () => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
      <div className="relative w-full max-w-2xl mx-auto">
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
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
          
          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {currentIndex + 1}/{images.length}
            </div>
          )}
        </div>
        
        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
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
    async function fetchPosts() {
      console.log('Instagram posts çekiliyor...')
      // Daha fazla post çekmek için limit artırıldı
      const { success, posts: postsData } = await getInstagramPosts(100) // Tüm postları çek
      console.log('Instagram posts result:', { success, postsData })
      
      if (success && postsData) {
        console.log('Posts bulundu:', postsData.length)
        setPosts(postsData)
        setHasMore(postsData.length > postsPerPage)
      } else {
        console.log('Instagram posts çekilemedi')
      }
      setIsLoading(false)
    }

    fetchPosts()
  }, [])

  // Sayfalama için postları böl
  const getCurrentPosts = () => {
    const startIndex = 0
    const endIndex = currentPage * postsPerPage
    return posts.slice(startIndex, endIndex)
  }

  const loadMorePosts = () => {
    const nextPage = currentPage + 1
    const maxPosts = nextPage * postsPerPage
    
    if (maxPosts >= posts.length) {
      setHasMore(false)
    }
    
    setCurrentPage(nextPage)
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 py-12">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center">
              <Instagram className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Instagram Paylaşımları</h1>
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const currentPosts = getCurrentPosts()

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
                <Instagram className="h-8 w-8" style={{ color: '#2ea5d5' }} />
                <div>
                  <h1 className="text-3xl font-bold">Instagram Paylaşımları</h1>
                  <p className="text-muted-foreground">
                    Kulüplerimizden {posts.length} paylaşım
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/instagram/accounts"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-black/80 transition-all"
              >
                <Instagram className="h-4 w-4" />
                Kulüp Instagram Hesapları
              </Link>
              <Link
                href="https://www.instagram.com/nevzatayazanadolulisesi_/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-black/80 transition-all"
              >
                <Instagram className="h-4 w-4" />
                Resmi Instagram Hesabımız
              </Link>
            </div>
          </div>

          {/* Posts Grid */}
          {currentPosts.length === 0 ? (
            <div className="text-center py-16">
              <Instagram className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram'da Takip Et
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentPosts.map((post) => {
                  const images = parseInstagramImages(post.image_links)
                  const mainImage = images.length > 0 ? images[0] : "/placeholder.svg"
                  
                  return (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="cursor-pointer relative w-full h-full">
                                  <Image
                                    src={mainImage}
                                    alt={`Instagram post by ${post.name || 'Kulüp'}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
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
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <div className="p-4">
                                  <div className="mb-4">
                                    <h3 className="text-lg font-semibold">{post.name || 'Kulüp'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {post.user_name ? `@${post.user_name}` : '@kulup'}
                                    </p>
                                  </div>
                                  <ImageCarousel 
                                    images={images} 
                                    postName={post.name || 'Kulüp'} 
                                  />
                                  {post.description && (
                                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                      <p className="text-sm leading-relaxed">{post.description}</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <Image
                              src={mainImage}
                              alt={`Instagram post by ${post.name || 'Kulüp'}`}
                              fill
                              className="object-cover"
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
                            
                            {post.post_link && (
                              <Link 
                                href={post.post_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-pink-500 hover:text-pink-600 font-medium"
                              >
                                Instagram'da Gör
                              </Link>
                            )}
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
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Instagram className="h-4 w-4" />
                    Daha Fazla Yükle
                  </Button>
                </div>
              )}

              {/* Stats */}
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  {currentPosts.length} / {posts.length} paylaşım gösteriliyor
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
