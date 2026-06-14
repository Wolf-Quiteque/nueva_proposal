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
import { getCmsContent } from "@/lib/cms"

export default async function Home() {
  const content = await getCmsContent()

  return (
    <main className="min-h-screen">
      <Navigation content={content.nav} />
      <Hero content={content.hero} />
      <MomentSection content={content.moment} />
      <SignatureExperience content={content.signature} />
      <PartnershipSection content={content.story} />
      <EditorialGallery content={content.gallery} />
      <HowItWorks content={content.process} />
      <BrandStatement content={content.brand} />
      <InquiryForm content={content.inquiry} />
      <Footer content={content.footer} />
    </main>
  )
}
