export type CmsFieldType = "text" | "textarea" | "image"

export type CmsField = {
  key: string
  section: string
  label: string
  type: CmsFieldType
  defaultValue: string
}

export type CmsImage = {
  src: string
  alt: string
  span?: string
  pos?: string
}

export type CmsContent = {
  nav: {
    brand: string
    experience: string
    gallery: string
    inquire: string
    cta: string
  }
  hero: {
    image: string
    imageAlt: string
    eyebrow: string
    titleLine1: string
    titleLine2: string
    description: string
    primaryCta: string
    secondaryCta: string
    scroll: string
  }
  moment: {
    eyebrow: string
    title: string
    lead: string
    body: string
  }
  signature: {
    eyebrow: string
    title: string
    cards: {
      title: string
      description: string
    }[]
  }
  story: {
    image: string
    imageAlt: string
    eyebrow: string
    titleLine1: string
    titleLine2: string
    paragraph1: string
    paragraph2: string
    paragraph3: string
  }
  gallery: {
    eyebrow: string
    titleLine1: string
    titleLine2: string
    images: CmsImage[]
  }
  process: {
    eyebrow: string
    titleLine1: string
    titleLine2: string
    steps: {
      number: string
      title: string
      description: string
    }[]
  }
  brand: {
    image: string
    imageAlt: string
    title: string
    paragraph1: string
    paragraph2: string
    paragraph3: string
  }
  inquiry: {
    eyebrow: string
    titleLine1: string
    titleLine2: string
    description: string
    contactTitle: string
    fullNameLabel: string
    fullNamePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    bestTimeLabel: string
    bestTimePlaceholder: string
    communicationLabel: string
    socialTitle: string
    socialHandleLabel: string
    socialHandlePlaceholder: string
    socialNote: string
    eventTitle: string
    eventTypeLabel: string
    otherEventLabel: string
    otherEventPlaceholder: string
    desiredDateLabel: string
    datePlaceholder: string
    flexibleDateText: string
    preferredTimeLabel: string
    preferredTimePlaceholder: string
    locationQuestion: string
    locationDetailsLabel: string
    locationDetailsPlaceholder: string
    inspirationTitle: string
    inspirationDescription: string
    visionTitle: string
    addOnsLabel: string
    visionLabel: string
    visionPlaceholder: string
    termsText: string
    submitButton: string
    submittingButton: string
    successMessage: string
    errorMessage: string
    backdrops: {
      label: string
      image: string
    }[]
  }
  footer: {
    brand: string
    taglineLine1: string
    taglineLine2: string
    contactTitle: string
    contactName: string
    contactLocation: string
    phone: string
    navigateTitle: string
    experience: string
    gallery: string
    inquire: string
    copyright: string
    credit: string
  }
}

export const defaultCmsContent: CmsContent = {
  nav: {
    brand: "Nueva",
    experience: "Experience",
    gallery: "Gallery",
    inquire: "Inquire",
    cta: "Start Planning",
  },
  hero: {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB06721-7NFeOKznfNeNzvLnPoAAkqHF1zv8At.jpeg",
    imageAlt: "Romantic proposal moment with heart-shaped rose arch",
    eyebrow: "Houston's Premier Proposal Experience",
    titleLine1: "Start Your",
    titleLine2: "Together Forever",
    description: "Luxury proposal experiences designed, planned, and captured with intention.",
    primaryCta: "Start Planning",
    secondaryCta: "View The Experience",
    scroll: "Scroll",
  },
  moment: {
    eyebrow: "The Beginning",
    title: "The Moment Everything Changes",
    lead: "A proposal is more than a question.",
    body: "It is the beginning of a forever story. At Nueva Proposals, we create proposal experiences designed with intention, beauty, and emotion - so you can focus on the person standing in front of you.",
  },
  signature: {
    eyebrow: "What We Offer",
    title: "Our Signature Experience",
    cards: [
      { title: "Luxury Heart Arch", description: "Stunning red rose heart installation" },
      { title: "Romantic Candle Styling", description: "Elegant ambient lighting" },
      { title: "Rose Petal Aisle", description: "Dramatic scattered rose petals" },
      { title: "Proposal Planning", description: "Complete coordination guidance" },
      { title: "Photography Optional", description: "Let us capture your moment or bring your own photographer" },
      { title: "Setup & Breakdown", description: "Full service experience" },
    ],
  },
  story: {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB06681-tnA0SJ0PmJGPjbVdCwSV6jUV5ZVVc7.jpeg",
    imageAlt: "Romantic couple embracing during proposal",
    eyebrow: "The Story",
    titleLine1: "From The Question",
    titleLine2: "To The Yes",
    paragraph1: "Every proposal we design becomes more than a setup.",
    paragraph2: "It becomes part of your story.",
    paragraph3: "From the first glance to the moment they say yes, every detail is designed so the day becomes one you can relive for years to come.",
  },
  gallery: {
    eyebrow: "Portfolio",
    titleLine1: "Real Moments. Real Love.",
    titleLine2: "Real Forever.",
    images: [
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
    ],
  },
  process: {
    eyebrow: "The Process",
    titleLine1: "Simple. Seamless.",
    titleLine2: "Unforgettable.",
    steps: [
      { number: "01", title: "Share Your Vision", description: "Tell us about your dream proposal and the person you love" },
      { number: "02", title: "We Plan The Experience", description: "Our team designs every detail with intention and care" },
      { number: "03", title: "You Ask The Question", description: "Focus on the moment while we handle everything else" },
      { number: "04", title: "We Capture The Memory", description: "Optional professional photography to preserve your story forever" },
    ],
  },
  brand: {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BYB06818-WfWJ9oc4W1PUSV84UqWifocK6t5P7m.jpeg",
    imageAlt: "Heart shaped rose arch setup",
    title: "Forever Starts Here",
    paragraph1: "Every detail is designed to help the moment feel effortless, romantic, and unforgettable.",
    paragraph2: "Because some moments deserve more than a memory.",
    paragraph3: "They deserve to be remembered forever.",
  },
  inquiry: {
    eyebrow: "Begin Your Journey",
    titleLine1: "Ready To Start Your",
    titleLine2: "Together Forever?",
    description: "Share a few details below and we'll reach out within 24 hours. Every detail stays discreet - your surprise is safe with us.",
    contactTitle: "Contact",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    phoneLabel: "Phone",
    phonePlaceholder: "(555) 000-0000",
    bestTimeLabel: "Best Time To Call",
    bestTimePlaceholder: "e.g. Weekday evenings",
    communicationLabel: "Preferred Communication",
    socialTitle: "Social",
    socialHandleLabel: "Social Media Handle",
    socialHandlePlaceholder: "@yourhandle",
    socialNote: "If your account is private, please check your message requests so our DM doesn't get missed. If we don't hear back after our DM, we'll try reaching you by phone.",
    eventTitle: "Your Event",
    eventTypeLabel: "Event Type",
    otherEventLabel: "Tell Us What Your Event Is About?",
    otherEventPlaceholder: "Share your event type",
    desiredDateLabel: "Desired Date",
    datePlaceholder: "Preferred date",
    flexibleDateText: "My date is flexible / TBD",
    preferredTimeLabel: "Preferred Time",
    preferredTimePlaceholder: "e.g. Sunset",
    locationQuestion: "Do You Have A Location Secured?",
    locationDetailsLabel: "Location Name Or Address",
    locationDetailsPlaceholder: "Venue name or address",
    inspirationTitle: "Choose Your Inspiration",
    inspirationDescription: "Select the backdrop that speaks to your vision. We'll tailor every detail from there.",
    visionTitle: "Your Vision",
    addOnsLabel: "Add-Ons (Optional)",
    visionLabel: "Tell Us About Your Vision",
    visionPlaceholder: "Share your story, ideas, and dreams for this moment...",
    termsText: "I understand that submitting this form does not confirm my booking. A 30% deposit secures my date once availability is confirmed.",
    submitButton: "Start Planning",
    submittingButton: "Sending Inquiry...",
    successMessage: "Inquiry sent. We'll be in touch soon.",
    errorMessage: "Something went wrong. Please try again.",
    backdrops: [
      { label: "Glass House", image: "/backdrops/glass-house.png" },
      { label: "Rooftop", image: "/backdrops/rooftop.png" },
      { label: "Skyline", image: "/backdrops/skyline.png" },
      { label: "Beach", image: "/backdrops/beach.png" },
      { label: "White Cyc Wall", image: "/backdrops/white-cyc-wall.png" },
      { label: "Custom Proposal", image: "/backdrops/custom.png" },
    ],
  },
  footer: {
    brand: "Nueva",
    taglineLine1: "Luxury proposal experiences,",
    taglineLine2: "designed and planned with intention.",
    contactTitle: "Contact",
    contactName: "Bilal Gilbert",
    contactLocation: "Houston, Texas",
    phone: "346-243-2684",
    navigateTitle: "Navigate",
    experience: "Experience",
    gallery: "Gallery",
    inquire: "Inquire",
    copyright: "Nueva Proposals. All rights reserved.",
    credit: "Designed with intention for unforgettable moments.",
  },
}

const text = (key: string, section: string, label: string, defaultValue: string): CmsField => ({
  key,
  section,
  label,
  type: "text",
  defaultValue,
})

const textarea = (key: string, section: string, label: string, defaultValue: string): CmsField => ({
  key,
  section,
  label,
  type: "textarea",
  defaultValue,
})

const image = (key: string, section: string, label: string, defaultValue: string): CmsField => ({
  key,
  section,
  label,
  type: "image",
  defaultValue,
})

export const cmsFields: CmsField[] = [
  text("nav.brand", "Navigation", "Brand", defaultCmsContent.nav.brand),
  text("nav.experience", "Navigation", "Experience Link", defaultCmsContent.nav.experience),
  text("nav.gallery", "Navigation", "Gallery Link", defaultCmsContent.nav.gallery),
  text("nav.inquire", "Navigation", "Inquire Link", defaultCmsContent.nav.inquire),
  text("nav.cta", "Navigation", "CTA Button", defaultCmsContent.nav.cta),

  image("hero.image", "Hero", "Background Image", defaultCmsContent.hero.image),
  textarea("hero.imageAlt", "Hero", "Image Alt Text", defaultCmsContent.hero.imageAlt),
  text("hero.eyebrow", "Hero", "Eyebrow", defaultCmsContent.hero.eyebrow),
  text("hero.titleLine1", "Hero", "Title Line 1", defaultCmsContent.hero.titleLine1),
  text("hero.titleLine2", "Hero", "Title Line 2", defaultCmsContent.hero.titleLine2),
  textarea("hero.description", "Hero", "Description", defaultCmsContent.hero.description),
  text("hero.primaryCta", "Hero", "Primary Button", defaultCmsContent.hero.primaryCta),
  text("hero.secondaryCta", "Hero", "Secondary Button", defaultCmsContent.hero.secondaryCta),
  text("hero.scroll", "Hero", "Scroll Label", defaultCmsContent.hero.scroll),

  text("moment.eyebrow", "Beginning", "Eyebrow", defaultCmsContent.moment.eyebrow),
  text("moment.title", "Beginning", "Title", defaultCmsContent.moment.title),
  textarea("moment.lead", "Beginning", "Lead", defaultCmsContent.moment.lead),
  textarea("moment.body", "Beginning", "Body", defaultCmsContent.moment.body),

  text("signature.eyebrow", "Signature Experience", "Eyebrow", defaultCmsContent.signature.eyebrow),
  text("signature.title", "Signature Experience", "Title", defaultCmsContent.signature.title),
  ...defaultCmsContent.signature.cards.flatMap((card, index) => [
    text(`signature.cards.${index}.title`, "Signature Experience", `Card ${index + 1} Title`, card.title),
    textarea(`signature.cards.${index}.description`, "Signature Experience", `Card ${index + 1} Description`, card.description),
  ]),

  image("story.image", "Story", "Image", defaultCmsContent.story.image),
  textarea("story.imageAlt", "Story", "Image Alt Text", defaultCmsContent.story.imageAlt),
  text("story.eyebrow", "Story", "Eyebrow", defaultCmsContent.story.eyebrow),
  text("story.titleLine1", "Story", "Title Line 1", defaultCmsContent.story.titleLine1),
  text("story.titleLine2", "Story", "Title Line 2", defaultCmsContent.story.titleLine2),
  textarea("story.paragraph1", "Story", "Paragraph 1", defaultCmsContent.story.paragraph1),
  textarea("story.paragraph2", "Story", "Paragraph 2", defaultCmsContent.story.paragraph2),
  textarea("story.paragraph3", "Story", "Paragraph 3", defaultCmsContent.story.paragraph3),

  text("gallery.eyebrow", "Gallery", "Eyebrow", defaultCmsContent.gallery.eyebrow),
  text("gallery.titleLine1", "Gallery", "Title Line 1", defaultCmsContent.gallery.titleLine1),
  text("gallery.titleLine2", "Gallery", "Title Line 2", defaultCmsContent.gallery.titleLine2),
  ...defaultCmsContent.gallery.images.flatMap((galleryImage, index) => [
    image(`gallery.images.${index}.src`, "Gallery", `Image ${index + 1}`, galleryImage.src),
    textarea(`gallery.images.${index}.alt`, "Gallery", `Image ${index + 1} Alt Text`, galleryImage.alt),
  ]),

  text("process.eyebrow", "Process", "Eyebrow", defaultCmsContent.process.eyebrow),
  text("process.titleLine1", "Process", "Title Line 1", defaultCmsContent.process.titleLine1),
  text("process.titleLine2", "Process", "Title Line 2", defaultCmsContent.process.titleLine2),
  ...defaultCmsContent.process.steps.flatMap((step, index) => [
    text(`process.steps.${index}.title`, "Process", `Step ${index + 1} Title`, step.title),
    textarea(`process.steps.${index}.description`, "Process", `Step ${index + 1} Description`, step.description),
  ]),

  image("brand.image", "Brand Statement", "Background Image", defaultCmsContent.brand.image),
  textarea("brand.imageAlt", "Brand Statement", "Image Alt Text", defaultCmsContent.brand.imageAlt),
  text("brand.title", "Brand Statement", "Title", defaultCmsContent.brand.title),
  textarea("brand.paragraph1", "Brand Statement", "Paragraph 1", defaultCmsContent.brand.paragraph1),
  textarea("brand.paragraph2", "Brand Statement", "Paragraph 2", defaultCmsContent.brand.paragraph2),
  textarea("brand.paragraph3", "Brand Statement", "Paragraph 3", defaultCmsContent.brand.paragraph3),

  ...Object.entries(defaultCmsContent.inquiry)
    .filter(([key]) => key !== "backdrops")
    .map(([key, value]) =>
      key.toLowerCase().includes("description") ||
      key.toLowerCase().includes("note") ||
      key.toLowerCase().includes("terms") ||
      key.toLowerCase().includes("message")
        ? textarea(`inquiry.${key}`, "Inquiry Form", key, String(value))
        : text(`inquiry.${key}`, "Inquiry Form", key, String(value))
    ),
  ...defaultCmsContent.inquiry.backdrops.flatMap((backdrop, index) => [
    text(`inquiry.backdrops.${index}.label`, "Inquiry Backdrops", `Backdrop ${index + 1} Label`, backdrop.label),
    image(`inquiry.backdrops.${index}.image`, "Inquiry Backdrops", `Backdrop ${index + 1} Image`, backdrop.image),
  ]),

  ...Object.entries(defaultCmsContent.footer).map(([key, value]) => text(`footer.${key}`, "Footer", key, String(value))),
]
