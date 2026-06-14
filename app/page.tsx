import { Hero } from "@/components/hero"
import { MomentSection } from "@/components/moment-section"
import { SignatureExperience } from "@/components/signature-experience"
import { PartnershipSection } from "@/components/partnership-section"
import { EditorialGallery } from "@/components/editorial-gallery"
import { HowItWorks } from "@/components/how-it-works"
import { BrandStatement } from "@/components/brand-statement"
import { InquiryForm } from "@/components/inquiry-form"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <MomentSection />
      <SignatureExperience />
      <PartnershipSection />
      <EditorialGallery />
      <HowItWorks />
      <BrandStatement />
      <InquiryForm />
      <Footer />
    </main>
  )
}
