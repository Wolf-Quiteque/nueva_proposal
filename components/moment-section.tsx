"use client"

import { useEffect, useRef, useState } from "react"
import type { CmsContent } from "@/lib/cms-defaults"

export function MomentSection({ content }: { content: CmsContent["moment"] }) {
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
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-8">{content.eyebrow}</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight">
            {content.title}
          </h2>
        </div>
        
        <div className={`mt-12 space-y-6 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <p className="text-xl md:text-2xl font-light text-foreground/80 leading-relaxed">
            {content.lead}
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {content.body}
          </p>
        </div>

        <div className={`mt-16 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="h-px w-24 bg-[#8B2635] mx-auto" />
        </div>
      </div>
    </section>
  )
}
