"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Instagram, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { getInstagramPosts, parseInstagramImages, InstagramPost } from "@/lib/supabase"

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      const { success, posts: postsData } = await getInstagramPosts(8)
      console.log('Instagram posts result:', { success, postsData })
      
      if (success && postsData) {
        console.log('Posts bulundu:', postsData.length)
        setPosts(postsData)
      } else {
        console.log('Instagram posts çekilemedi')
      }
      setIsLoading(false)
    }

    fetchPosts()
  }, [])

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="flex items-center space-x-2">
              <Instagram className="h-6 w-6 text-pink-500" />
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Kulüp Güncellemeleri</h2>
            </div>
            <p className="max-w-[700px] text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="flex items-center space-x-2">
            <Instagram className="h-6 w-6" style={{ color: '#2ea5d5' }} />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Kulüp Güncellemeleri</h2>
          </div>
          <p className="max-w-[700px] text-muted-foreground">Okul kulüplerimizden en son paylaşımları görün.</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Henüz paylaşım bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => {
              const images = parseInstagramImages(post.image_links)
              const mainImage = images.length > 0 ? images[0] : "/placeholder.svg"
              
              return (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-3 flex items-center justify-between border-b">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {post.name ? post.name.charAt(0).toUpperCase() : 'K'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{post.name || 'Kulüp'}</p>
                          <p className="text-xs text-muted-foreground">
                            {post.user_name ? `@${post.user_name}` : '@kulup'}
                          </p>
                        </div>
                      </div>
                      {post.post_link && (
                        <Link 
                          href={post.post_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                    </div>

                    {images.length === 1 ? (
                      <div className="relative aspect-square">
                        <Image
                          src={mainImage}
                          alt={`Instagram post by ${post.name || 'Kulüp'}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="w-full">
                            <div className="relative aspect-square cursor-pointer group">
                              <Image
                                src={mainImage}
                                alt={`Instagram post by ${post.name || 'Kulüp'}`}
                                fill
                                className="object-cover group-hover:opacity-90 transition-opacity"
                              />
                              {/* Multiple photos indicator */}
                              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                {images.length} Fotoğraf
                              </div>
                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-sm font-medium">Fotoğrafları Görüntüle</span>
                              </div>
                            </div>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                          <DialogHeader>
                            <DialogTitle>{post.name || 'Kulüp'}</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <ImageCarousel images={images} postName={post.name || 'Instagram Post'} />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    <div className="p-3">
                      {post.description && (
                        <p className="text-sm line-clamp-3 mb-2">{post.description}</p>
                      )}
                      {post.time && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.time).toLocaleDateString('tr-TR')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
        
        <div className="flex flex-col items-center gap-4 mt-10">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/instagram"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
            >
              <Instagram className="h-4 w-4" />
              Tüm Paylaşımları Gör
            </Link>
            <Link
              href="/instagram/accounts"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-all"
            >
              <Instagram className="h-4 w-4" />
              Kulüp Hesapları
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  )
}
