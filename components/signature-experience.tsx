"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, Flame, Flower2, ClipboardList, Camera, Sparkles } from "lucide-react"
import type { CmsContent } from "@/lib/cms-defaults"

const experiences = [
  {
    icon: Heart,
    title: "Luxury Heart Arch",
    description: "Stunning red rose heart installation"
  },
  {
    icon: Flame,
    title: "Romantic Candle Styling",
    description: "Elegant ambient lighting"
  },
  {
    icon: Flower2,
    title: "Rose Petal Aisle",
    description: "Dramatic scattered rose petals"
  },
  {
    icon: ClipboardList,
    title: "Proposal Planning",
    description: "Complete coordination guidance"
  },
  {
    icon: Camera,
    title: "Photography Optional",
    description: "Let us capture your moment or bring your own photographer"
  },
  {
    icon: Sparkles,
    title: "Setup & Breakdown",
    description: "Full service experience"
  }
]

export function SignatureExperience({ content }: { content: CmsContent["signature"] }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="bg-white py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <p className="text-xs tracking-[0.35em] uppercase text-neutral-400 mb-8">{content.eyebrow}</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 text-balance">
            {content.title}
          </h2>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {experiences.map((exp, index) => (
            <div
              key={exp.title}
              className={`group relative rounded-2xl border border-neutral-200 bg-white p-10 transition-all duration-700 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
            >
              <exp.icon className="w-8 h-8 text-neutral-900 mb-6" strokeWidth={1} />
              <h3 className="font-serif text-2xl text-neutral-900 mb-3">{content.cards[index]?.title || exp.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{content.cards[index]?.description || exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
