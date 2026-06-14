"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export function BrandStatement() {
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
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB06818-WfWJ9oc4W1PUSV84UqWifocK6t5P7m.jpeg"
          alt="Heart shaped rose arch setup"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light">
            Forever Starts Here
          </h2>
        </div>
        
        <div className={`mt-10 space-y-6 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <p className="text-xl md:text-2xl font-light leading-relaxed opacity-90">
            Every detail is designed to help the moment feel effortless, romantic, and unforgettable.
          </p>
          <p className="text-lg opacity-70">
            Because some moments deserve more than a memory.
          </p>
          <p className="font-serif text-2xl md:text-3xl italic mt-8 opacity-90">
            They deserve to be remembered forever.
          </p>
        </div>
      </div>
    </section>
  )
}
