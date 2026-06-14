"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/95 backdrop-blur-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="group">
            <span className={`font-serif text-2xl tracking-wide transition-colors ${
              scrolled ? "text-foreground" : "text-white"
            }`}>
              Nueva
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-12">
            <Link 
              href="#experience" 
              className={`text-sm tracking-widest uppercase transition-colors hover:opacity-70 ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              Experience
            </Link>
            <Link 
              href="#gallery" 
              className={`text-sm tracking-widest uppercase transition-colors hover:opacity-70 ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              Gallery
            </Link>
            <Link 
              href="#inquiry" 
              className={`text-sm tracking-widest uppercase transition-colors hover:opacity-70 ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              Inquire
            </Link>
          </div>

          <Link
            href="#inquiry"
            className={`hidden md:block text-sm tracking-widest uppercase border px-6 py-3 transition-all hover:bg-white hover:text-black ${
              scrolled ? "border-foreground text-foreground" : "border-white text-white"
            }`}
          >
            Start Planning
          </Link>
        </div>
      </div>
    </nav>
  )
}
