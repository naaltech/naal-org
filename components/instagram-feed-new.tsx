"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Instagram, ExternalLink } from "lucide-react"
import { getInstagramPosts, parseInstagramImages, InstagramPost } from "@/lib/supabase"

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { success, posts: postsData } = await getInstagramPosts(8)
      if (success && postsData) {
        setPosts(postsData)
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
            <Instagram className="h-6 w-6 text-pink-500" />
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

                    <div className="relative aspect-square">
                      <Image
                        src={mainImage}
                        alt={`Instagram post by ${post.name || 'Kulüp'}`}
                        fill
                        className="object-cover"
                      />
                      {images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          +{images.length - 1}
                        </div>
                      )}
                    </div>

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

        <div className="flex justify-center mt-10">
          <Link
            href="https://www.instagram.com/nevzatayazanadolulisesi_/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:underline flex items-center gap-2"
          >
            <Instagram className="h-4 w-4" />
            Tüm kulüp paylaşımlarını Instagram'da takip edin
          </Link>
        </div>
      </div>
    </section>
  )
}
