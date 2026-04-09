import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { Providers } from '@/components/Providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Bebidas San Juan | Delivery 24hs de Bebidas Premium',
  description: 'Venta online de bebidas premium con delivery 24hs en San Juan. Cerveza, vinos, destilados y más. Entrega rápida a domicilio.',
  keywords: 'bebidas, delivery, san juan, cerveza, vino, whisky, fernet, alcohol, entrega rapida, 24hs',
  authors: [{ name: 'Bebidas San Juan' }],
  creator: 'Bebidas San Juan',
  publisher: 'Bebidas San Juan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: '/',
    title: 'Bebidas San Juan | Delivery 24hs',
    description: 'Venta online de bebidas premium con delivery 24hs en San Juan',
    siteName: 'Bebidas San Juan',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bebidas San Juan - Delivery 24hs'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bebidas San Juan | Delivery 24hs',
    description: 'Venta online de bebidas premium con delivery 24hs en San Juan',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'google-site-verification-code'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans">
        <Providers>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                color: '#0f172a',
                border: '1px solid #e2e8f0'
              }
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
