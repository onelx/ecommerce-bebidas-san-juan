import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bebidas San Juan - Delivery 24hs',
  description: 'Venta online de bebidas premium con delivery 24hs en San Juan. Cerveza, vino, espumantes, whisky y más.',
  keywords: 'bebidas, delivery, san juan, cerveza, vino, fernet, whisky, delivery 24hs',
  authors: [{ name: 'Bebidas San Juan' }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://bebidassanjuan.com',
    siteName: 'Bebidas San Juan',
    title: 'Bebidas San Juan - Delivery 24hs',
    description: 'Venta online de bebidas premium con delivery 24hs en San Juan',
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
    description: 'Venta online de bebidas premium con delivery 24hs en San Juan',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
