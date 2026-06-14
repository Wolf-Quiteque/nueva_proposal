"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { CmsContent } from "@/lib/cms-defaults"

export function Hero({ content }: { content: CmsContent["hero"] }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={content.image}
          alt={content.imageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <div className={`transition-all duration-1000 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="mb-6 text-sm tracking-[0.3em] uppercase">{content.eyebrow}</p>
        </div>
        
        <h1 className={`font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-wide transition-all duration-1000 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {content.titleLine1}
        </h1>
        <h1 className={`font-serif text-5xl md:text-7xl lg:text-8xl font-light italic tracking-wide mt-2 transition-all duration-1000 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {content.titleLine2}
        </h1>

        <p className={`mt-8 max-w-xl text-lg font-light leading-relaxed opacity-90 transition-all duration-1000 delay-900 ${loaded ? "opacity-90 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {content.description}
        </p>

        <div className={`mt-12 flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <Link
            href="#inquiry"
            className="group relative overflow-hidden bg-white px-10 py-4 text-sm tracking-widest uppercase text-black transition-all hover:bg-opacity-90"
          >
            <span className="relative z-10">{content.primaryCta}</span>
          </Link>
          <Link
            href="#experience"
            className="border border-white px-10 py-4 text-sm tracking-widest uppercase transition-all hover:bg-white hover:text-black"
          >
            {content.secondaryCta}
          </Link>
        </div>
      </div>

      {/* Scroll Indicator - hidden on mobile to avoid overlapping the buttons */}
      <div className={`hidden lg:block absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1200 ${loaded ? "opacity-100" : "opacity-0"}`}>
        <div className="flex flex-col items-center gap-3 text-white">
          <span className="text-xs tracking-[0.2em] uppercase">{content.scroll}</span>
          <div className="h-12 w-px bg-white/50" />
        </div>
      </div>
    </section>
  )
}
