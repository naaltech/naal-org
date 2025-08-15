"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { ExternalLink, ChevronLeft, ChevronRight, Heart, MessageCircle, Share } from "lucide-react"
import { SiInstagram, SiX, SiYoutube, SiFacebook } from '@icons-pack/react-simple-icons';

import { getInstagramPostsByClub, InstagramPost } from "@/lib/supabase"

interface ClubInstagramFeedProps {
  clubInstagramAccounts: string[]
}

export default function ClubInstagramFeed({ clubInstagramAccounts }: ClubInstagramFeedProps) {
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
          
          {/* Image indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true)
      try {
        const { success, posts } = await getInstagramPostsByClub(clubInstagramAccounts, 8)
        
        if (success) {
          console.log('Kulüp Instagram postları:', posts.length)
          console.log('Kulübün Instagram hesapları:', clubInstagramAccounts)
          setPosts(posts)
        }
      } catch (error) {
        console.error('Instagram postları yüklenirken hata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (clubInstagramAccounts.length > 0) {
      loadPosts()
    } else {
      setIsLoading(false)
    }
  }, [clubInstagramAccounts])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
          </Card>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <SiInstagram className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Henüz post yok</h3>
        <p className="text-muted-foreground">
          Bu kulübün Instagram hesaplarından henüz post bulunamadı.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map((post) => {
          const images = post.image_links?.links || []
          const firstImage = images[0]

          return (
            <Dialog key={post.id}>
              <DialogTrigger asChild>
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      {firstImage && (
                        <Image
                          src={firstImage}
                          alt={post.name || "Instagram Post"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center">
                          <SiInstagram className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">Görüntüle</p>
                        </div>
                      </div>
                      
                      {/* Multiple images indicator */}
                      {images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          1/{images.length}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <SiInstagram className="h-5 w-5" />
                    @{post.user_name}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Images */}
                  {images.length > 0 && (
                    <ImageCarousel images={images} postName={post.name || "Instagram Post"} />
                  )}

                  {/* Post content */}
                  <div className="space-y-3">
                    {post.name && (
                      <h3 className="font-semibold text-lg">{post.name}</h3>
                    )}
                    
                    {post.description && (
                      <p className="text-muted-foreground whitespace-pre-wrap">{post.description}</p>
                    )}

                    {/* Post meta */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          Instagram'da gör
                        </span>
                      </div>
                      
                      <Link
                        href={post.post_link || `https://instagram.com/${post.user_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        @{post.user_name}
                      </Link>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )
        })}
      </div>
      
      {posts.length >= 8 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Daha fazla post için Instagram hesaplarını ziyaret edin
          </p>
        </div>
      )}
    </div>
  )
}
