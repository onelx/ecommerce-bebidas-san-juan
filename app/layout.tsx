import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bebidas San Juan | Delivery 24hs',
  description: 'Las mejores bebidas premium con delivery las 24 horas en San Juan. Cervezas, vinos, espumantes y más.',
  keywords: 'bebidas, delivery, san juan, cerveza, vino, fernet, 24 horas',
  authors: [{ name: 'Bebidas San Juan' }],
  openGraph: {
    title: 'Bebidas San Juan | Delivery 24hs',
    description: 'Las mejores bebidas premium con delivery las 24 horas en San Juan',
    type: 'website',
    locale: 'es_AR',
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
