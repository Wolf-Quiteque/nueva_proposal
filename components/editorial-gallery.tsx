"use client"

import Image from "next/image"
import { useEffect, useRef, useState, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { CmsContent } from "@/lib/cms-defaults"

const galleryImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB08621-Uo8rSCxpUqVNbjBpBEJNZxFapLecOy.jpeg",
    alt: "Couple sharing a dramatic dip kiss beneath the rose heart in the glass house",
    span: "md:col-span-2 md:row-span-2",
    pos: "object-center",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB09043-mgQELnuFL1u6upE6WrVK7bXj4ihoaa.jpeg",
    alt: "Close-up of an engagement ring being placed on the finger",
    span: "",
    pos: "object-center",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB08835-mba9FadS2CDAk46Nohs46qX0c5ouFN.jpeg",
    alt: "Man in powder-blue suit proposing beneath the Will You Marry Me neon in the glass house",
    span: "md:row-span-2",
    pos: "object-center",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB08309-gwj6MjoqQzGBRNyMQxFSfQPblWrY0Y.jpeg",
    alt: "Woman in a black dress beaming as her partner presents the ring",
    span: "",
    pos: "object-top",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB08978-Y8WZ01OgQW0aLYHni9AvWtf0HKznz3.jpeg",
    alt: "Couple sharing an intimate embrace in the glass house",
    span: "",
    pos: "object-center",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB08561-aH5l3ZtZSdrjZvmzzym9GKfNNM1kYl.jpeg",
    alt: "Partner twirling his fiancee among scattered rose petals",
    span: "md:row-span-2",
    pos: "object-center",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB08543-sSYUgEbUpCpUWGFUX7UgvLBAa07f7I.jpeg",
    alt: "Close-up of a marquise solitaire engagement ring",
    span: "",
    pos: "object-center",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB08875-AtNNsfr5ynqTn42tbVzcJuIoID5qnv.jpeg",
    alt: "Intimate near-kiss portrait of a couple in the glass house",
    span: "md:col-span-2",
    pos: "object-center",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB06722-D7pDyMlm0HVQnB0zjTmQx0IqXpXNjO.jpeg",
    alt: "Proposal moment - man on knee with ring",
    span: "md:row-span-2",
    pos: "object-center",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB08329-EGKwdH01pELGPEvXwXulOU0ZflIdB5.jpeg",
    alt: "Close-up of a ring being placed on the finger",
    span: "",
    pos: "object-center",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB06584-eiaEQ2eW1KO32rbOikBoc2buepbhW8.jpeg",
    alt: "Happy couple celebrating with champagne",
    span: "md:col-span-2",
    pos: "object-top",
  },
]

export function EditorialGallery({ content }: { content: CmsContent["gallery"] }) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const images = content.images.length > 0 ? content.images : galleryImages

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const close = useCallback(() => setActiveIndex(null), [])
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  )
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  )

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [activeIndex, close, next, prev])

  const active = activeIndex === null ? null : images[activeIndex]

  return (
    <section ref={sectionRef} id="gallery" className="bg-white py-28 lg:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={`text-center mb-16 lg:mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <p className="text-xs tracking-[0.35em] uppercase text-neutral-400 mb-6">{content.eyebrow}</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 text-balance">
            {content.titleLine1}
          </h2>
          <p className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 italic mt-2">
            {content.titleLine2}
          </p>
        </div>

        <div
          className={`grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[44vw] sm:auto-rows-[220px] md:auto-rows-[280px] transition-all duration-1000 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View ${image.alt}`}
              className={`relative overflow-hidden group rounded-xl bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40 ${image.span}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className={`object-cover ${image.pos} transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]`}
              />
              <div className="absolute inset-0 bg-neutral-900/0 transition-colors duration-500 group-hover:bg-neutral-900/5" />
            </button>
          ))}
        </div>
      </div>

      {/* Premium lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900/5 text-neutral-700 transition-colors hover:bg-neutral-900/10"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Previous image"
            className="absolute left-4 md:left-8 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900/5 text-neutral-700 transition-colors hover:bg-neutral-900/10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Next image"
            className="absolute right-4 md:right-8 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900/5 text-neutral-700 transition-colors hover:bg-neutral-900/10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="relative mx-auto flex h-[78vh] w-[90vw] max-w-5xl items-center justify-center animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="90vw"
              className="object-contain rounded-lg"
              priority
            />
          </div>

          <p className="absolute bottom-8 left-0 right-0 text-center text-xs tracking-[0.25em] uppercase text-neutral-400">
            {activeIndex! + 1} / {images.length}
          </p>
        </div>
      )}
    </section>
  )
}
