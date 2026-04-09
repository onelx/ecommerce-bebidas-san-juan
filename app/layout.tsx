import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bebidas San Juan - Delivery 24hs',
  description: 'Bebidas premium con delivery express en San Juan. Pedí online y recibí en minutos.',
  keywords: 'bebidas, delivery, san juan, cerveza, vino, whisky, fernet, delivery 24hs',
  openGraph: {
    title: 'Bebidas San Juan - Delivery 24hs',
    description: 'Bebidas premium con delivery express en San Juan',
    type: 'website',
    locale: 'es_AR',
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
