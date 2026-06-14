"use client"

import { useEffect, useRef, useState } from "react"

const steps = [
  {
    number: "01",
    title: "Share Your Vision",
    description: "Tell us about your dream proposal and the person you love"
  },
  {
    number: "02",
    title: "We Plan The Experience",
    description: "Our team designs every detail with intention and care"
  },
  {
    number: "03",
    title: "You Ask The Question",
    description: "Focus on the moment while we handle everything else"
  },
  {
    number: "04",
    title: "We Capture The Memory",
    description: "Optional professional photography to preserve your story forever"
  }
]

export function HowItWorks() {
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
    <section ref={sectionRef} className="bg-background py-32 lg:py-44">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className={`text-center mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-8">The Process</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Simple. Seamless.
          </h2>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground italic mt-2">
            Unforgettable.
          </h2>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2 hidden md:block" />
          
          <div className="space-y-16 md:space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                } ${index % 2 === 1 ? "md:text-right" : ""}`}
                style={{ transitionDelay: `${index * 200 + 300}ms` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[#8B2635] rounded-full md:-translate-x-1/2 hidden md:block" style={{ top: '1.5rem' }} />
                
                {index % 2 === 0 ? (
                  <>
                    <div className="md:pr-16 md:text-right">
                      <span className="font-serif text-6xl md:text-7xl text-muted-foreground/20">{step.number}</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-2">{step.title}</h3>
                      <p className="text-muted-foreground mt-4">{step.description}</p>
                    </div>
                    <div className="hidden md:block" />
                  </>
                ) : (
                  <>
                    <div className="hidden md:block" />
                    <div className="md:pl-16">
                      <span className="font-serif text-6xl md:text-7xl text-muted-foreground/20">{step.number}</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-2">{step.title}</h3>
                      <p className="text-muted-foreground mt-4 text-left">{step.description}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
