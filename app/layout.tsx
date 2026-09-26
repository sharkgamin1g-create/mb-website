import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LiveChat } from '@/components/livechat'
import { LiveChatGate } from '@/components/livechat-gate'
import './globals.css'

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plex-arabic',
})

export const metadata: Metadata = {
  title: {
    default: 'Master Build — We Build What You Imagine',
    template: '%s | Master Build',
  },
  description:
    'Master Build delivers construction, fit-out, interior design and project management as one integrated, precision-engineered experience.',
  generator: 'v0.app',
  keywords: [
    'Master Build',
    'construction',
    'fit-out',
    'interior design',
    'project management',
    'electro-mechanical',
    'turnkey',
  ],
  openGraph: {
    title: 'Master Build — We Build What You Imagine',
    description:
      'Construction, fit-out, architectural design and project management, delivered as one integrated experience.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0042ca',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${plexArabic.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <LiveChat />
        <LiveChatGate />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
