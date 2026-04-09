import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bebidas San Juan - Delivery 24hs',
  description: 'Venta online de bebidas premium con delivery 24 horas en San Juan Capital. Cerveza, vinos, destilados y más.',
  keywords: 'bebidas, delivery, san juan, cerveza, vino, alcohol, delivery 24hs, bebidas premium',
  authors: [{ name: 'Bebidas San Juan' }],
  openGraph: {
    title: 'Bebidas San Juan - Delivery 24hs',
    description: 'Tu bebida favorita en menos de 1 hora. Delivery 24hs en San Juan Capital.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'Bebidas San Juan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bebidas San Juan - Delivery 24hs',
    description: 'Tu bebida favorita en menos de 1 hora. Delivery 24hs en San Juan Capital.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
