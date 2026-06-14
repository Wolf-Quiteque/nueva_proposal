"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { CmsContent } from "@/lib/cms-defaults"

export function PartnershipSection({ content }: { content: CmsContent["story"] }) {
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
                src={content.image}
                alt={content.imageAlt}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`transition-opacity duration-1000 delay-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">{content.eyebrow}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              {content.titleLine1}<br />{content.titleLine2}
            </h2>
            
            <div className="mt-10 space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {content.paragraph1}
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                {content.paragraph2}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {content.paragraph3}
              </p>
            </div>

            <div className="mt-12 h-px w-24 bg-[#8B2635]" />
          </div>
        </div>
      </div>
    </section>
  )
}
