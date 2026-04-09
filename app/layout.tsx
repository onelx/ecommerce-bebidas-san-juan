import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bebidas San Juan - Delivery 24hs de Bebidas Premium',
  description:
    'Venta online de bebidas premium con delivery 24 horas en San Juan Capital. Cerveza, vinos, champagne, tragos y más.',
  keywords: [
    'bebidas',
    'delivery',
    'san juan',
    'cerveza',
    'vino',
    'champagne',
    'alcohol',
    '24 horas',
  ],
  authors: [{ name: 'Bebidas San Juan' }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Bebidas San Juan',
    title: 'Bebidas San Juan - Delivery 24hs',
    description: 'Bebidas premium con delivery 24 horas en San Juan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bebidas San Juan - Delivery 24hs',
    description: 'Bebidas premium con delivery 24 horas en San Juan',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
