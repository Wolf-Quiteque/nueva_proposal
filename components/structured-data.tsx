export function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://nuevaproposals.com/#business",
    name: "Nueva Proposals",
    url: "https://nuevaproposals.com",
    image: "https://nuevaproposals.com/og-nueva-proposals-1200x630.png",
    telephone: "+1-346-243-2684",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Houston",
      },
      {
        "@type": "AdministrativeArea",
        name: "Texas",
      },
    ],
    description:
      "Luxury proposal planning in Houston with romantic styling, florals, candlelight, and curated proposal experiences.",
    priceRange: "$$",
    sameAs: ["https://nuevaproposals.com"],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Luxury Proposal Planning",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Micro Wedding Styling",
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  )
}
