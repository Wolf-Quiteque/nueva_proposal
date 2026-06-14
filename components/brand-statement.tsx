"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { CmsContent } from "@/lib/cms-defaults"

export function BrandStatement({ content }: { content: CmsContent["brand"] }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-44 lg:py-56 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={content.image}
          alt={content.imageAlt}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light">
            {content.title}
          </h2>
        </div>
        
        <div className={`mt-10 space-y-6 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <p className="text-xl md:text-2xl font-light leading-relaxed opacity-90">
            {content.paragraph1}
          </p>
          <p className="text-lg opacity-70">
            {content.paragraph2}
          </p>
          <p className="font-serif text-2xl md:text-3xl italic mt-8 opacity-90">
            {content.paragraph3}
          </p>
        </div>
      </div>
    </section>
  )
}
