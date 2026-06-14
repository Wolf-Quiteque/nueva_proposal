import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-3xl tracking-wide text-foreground">
              Nueva
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Luxury proposal experiences,<br />
              designed and planned with intention.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase text-foreground mb-6">Contact</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Bilal Gilbert</p>
              <p>Houston, Texas</p>
              <a href="tel:346-243-2684" className="block hover:text-[#8B2635] transition-colors">
                346-243-2684
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase text-foreground mb-6">Navigate</h4>
            <div className="space-y-3 text-sm">
              <Link href="#experience" className="block text-muted-foreground hover:text-[#8B2635] transition-colors">
                Experience
              </Link>
              <Link href="#gallery" className="block text-muted-foreground hover:text-[#8B2635] transition-colors">
                Gallery
              </Link>
              <Link href="#inquiry" className="block text-muted-foreground hover:text-[#8B2635] transition-colors">
                Inquire
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Nueva Proposals. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Designed with intention for unforgettable moments.
          </p>
        </div>
      </div>
    </footer>
  )
}
