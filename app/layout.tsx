import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SiteAnalyticsTracker } from '@/components/site-analytics-tracker'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif"
});
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nuevaproposals.com'),
  title: {
    default: 'Nueva Proposals | Luxury Proposal Planner in Houston',
    template: '%s | Nueva Proposals',
  },
  description:
    'Luxury proposal planning in Houston with romantic heart arch setups, candle styling, florals, photography options, and curated proposal experiences.',
  keywords: [
    'Houston proposal planner',
    'proposal planner Houston',
    'luxury proposal setup Houston',
    'romantic proposal Houston',
    'marriage proposal planner Houston',
    'Houston engagement proposal',
    'proposal decorations Houston',
    'heart arch proposal Houston',
    'micro wedding Houston',
    'bridal shower setup Houston',
    'private proposal planning',
    'Nueva Proposals',
  ],
  authors: [{ name: 'Nueva Proposals' }],
  creator: 'Nueva Proposals',
  publisher: 'Nueva Proposals',
  applicationName: 'Nueva Proposals',
  category: 'event planning',
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Nueva Proposals',
    title: 'Nueva Proposals | Luxury Proposal Planner in Houston',
    description:
      'Luxury proposal planning in Houston with romantic styling, florals, candlelight, and unforgettable proposal experiences.',
    images: [
      {
        url: '/og-whatsapp-nueva-proposals.jpg',
        width: 1200,
        height: 630,
        alt: 'Luxury heart-shaped rose proposal setup overlooking the Houston skyline',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nueva Proposals | Luxury Proposal Planner in Houston',
    description:
      'Luxury proposal planning in Houston with romantic styling, florals, candlelight, and unforgettable proposal experiences.',
    images: ['/og-whatsapp-nueva-proposals.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-background">
        {children}
        <SiteAnalyticsTracker />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
