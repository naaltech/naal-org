"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

export default function LogoScroller() {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Sample club logos
  const clubLogos = [
    { id: 1, name: "Bilim Kulübü", logo: "/placeholder.svg?height=80&width=80" },
    { id: 2, name: "Tiyatro Kulübü", logo: "/placeholder.svg?height=80&width=80" },
    { id: 3, name: "Kodlama Kulübü", logo: "/placeholder.svg?height=80&width=80" },
    { id: 4, name: "Sanat Kulübü", logo: "/placeholder.svg?height=80&width=80" },
    { id: 5, name: "Müzik Kulübü", logo: "/placeholder.svg?height=80&width=80" },
    { id: 6, name: "Münazara Kulübü", logo: "/placeholder.svg?height=80&width=80" },
    { id: 7, name: "Fotoğrafçılık Kulübü", logo: "/placeholder.svg?height=80&width=80" },
    { id: 8, name: "Satranç Kulübü", logo: "/placeholder.svg?height=80&width=80" },
  ]

  // Duplicate logos for continuous scrolling effect
  const allLogos = [...clubLogos, ...clubLogos]

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0

    const scroll = () => {
      if (!scrollContainer) return

      scrollPosition += 0.5
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }

      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="w-full py-12 bg-muted overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Okul Kulüpleri</h2>
          <p className="text-muted-foreground">Çeşitli öğrenci organizasyonlarımızdan oluşan topluluğumuza katılın</p>
        </div>
        <div ref={scrollRef} className="flex space-x-8 overflow-x-hidden">
          {allLogos.map((club, index) => (
            <div key={`${club.id}-${index}`} className="flex-shrink-0 flex flex-col items-center space-y-2 min-w-[100px]">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center p-2 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {club.name.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-center">{club.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
