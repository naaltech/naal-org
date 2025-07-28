"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export default function BannerSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Sadece banner fotoğrafları
  const banners = [
    "/banners/bilim.png",
    "/banners/cevre.png",
    "/banners/eng.png",
    "/banners/fbc.png",
    "/banners/felsefe.png",
    "/banners/fest.png",
    "/banners/foto.png",
    "/banners/girisimcilik.png",
    "/banners/gsd.png",
    "/banners/id.png",
    "/banners/mun.png",
    "/banners/munazara.png",
    "/banners/muzik.png",
    "/banners/sinema.png",
    "/banners/spor.png",
    "/banners/teknoloji.png"
  ]

  // Sonsuz akış için bannerları çoğalt
  const infiniteBanners = [...banners, ...banners, ...banners]

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0

    const scroll = () => {
      if (!scrollContainer) return

      scrollPosition += 0.5
      if (scrollPosition >= scrollContainer.scrollWidth / 3) {
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
    <div className="w-full py-3 bg-muted overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div ref={scrollRef} className="flex space-x-4 overflow-x-hidden h-12">
          {infiniteBanners.map((banner, index) => (
            <div key={index} className="flex-shrink-0 h-12 w-20 relative">
              <Image
                src={banner}
                alt={`Banner ${index + 1}`}
                fill
                className="object-contain"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
