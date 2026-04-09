import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bebidas San Juan - Delivery 24hs',
  description: 'Venta online de bebidas premium con delivery 24 horas en San Juan. Cerveza, vinos, espirituosas y más.',
  keywords: 'bebidas, delivery, san juan, cerveza, vino, whisky, bebidas premium',
  authors: [{ name: 'Bebidas San Juan' }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Bebidas San Juan',
    title: 'Bebidas San Juan - Delivery 24hs',
    description: 'Venta online de bebidas premium con delivery 24 horas en San Juan',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bebidas San Juan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bebidas San Juan - Delivery 24hs',
    description: 'Venta online de bebidas premium con delivery 24 horas en San Juan',
    images: ['/og-image.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
