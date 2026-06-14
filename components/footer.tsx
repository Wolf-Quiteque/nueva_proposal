import Link from "next/link"
import type { CmsContent } from "@/lib/cms-defaults"

export function Footer({ content }: { content: CmsContent["footer"] }) {
  return (
    <footer className="bg-background py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-3xl tracking-wide text-foreground">
              {content.brand}
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {content.taglineLine1}<br />
              {content.taglineLine2}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase text-foreground mb-6">{content.contactTitle}</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>{content.contactName}</p>
              <p>{content.contactLocation}</p>
              <a href={`tel:${content.phone}`} className="block hover:text-[#8B2635] transition-colors">
                {content.phone}
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase text-foreground mb-6">{content.navigateTitle}</h4>
            <div className="space-y-3 text-sm">
              <Link href="#experience" className="block text-muted-foreground hover:text-[#8B2635] transition-colors">
                {content.experience}
              </Link>
              <Link href="#gallery" className="block text-muted-foreground hover:text-[#8B2635] transition-colors">
                {content.gallery}
              </Link>
              <Link href="#inquiry" className="block text-muted-foreground hover:text-[#8B2635] transition-colors">
                {content.inquire}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {content.copyright}
          </p>
          <p className="text-xs text-muted-foreground">
            {content.credit}
          </p>
        </div>
      </div>
    </footer>
  )
}
