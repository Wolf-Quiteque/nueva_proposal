"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export function PartnershipSection() {
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
    <section ref={sectionRef} className="bg-background py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div className={`relative transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB06681-tnA0SJ0PmJGPjbVdCwSV6jUV5ZVVc7.jpeg"
                alt="Romantic couple embracing during proposal"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`transition-opacity duration-1000 delay-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">The Story</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              From The Question<br />To The Yes
            </h2>
            
            <div className="mt-10 space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every proposal we design becomes more than a setup.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                It becomes part of your story.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From the first glance to the moment they say yes, every detail is designed so the day becomes one you can relive for years to come.
              </p>
            </div>

            <div className="mt-12 h-px w-24 bg-[#8B2635]" />
          </div>
        </div>
      </div>
    </section>
  )
}
