import type { Metadata, Viewport } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ToastNotification } from '@/components/ui/ToastNotification';
import { AuthProvider } from '@/components/providers/AuthProvider';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900']
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800']
});

export const viewport: Viewport = {
  themeColor: '#FF5E00',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

export const metadata: Metadata = {
  title: 'CurryCraft - Authentic Indian Gourmet Dining | Order Online',
  description:
    'Experience the culinary heritage of India: Fragrant Kolkata Dum Biryani, slow-simmered Dal Sambar, rich gravies, and artisan tandoori breads.',
  keywords: [
    'indian food',
    'biryani',
    'kolkata biryani',
    'sambar',
    'curry',
    'tandoor',
    'food delivery'
  ],
  authors: [{ name: 'CurryCraft Culinary Team' }],
  openGraph: {
    title: 'CurryCraft - Authentic Indian Gourmet Dining',
    description: 'Experience the culinary heritage of India. Order online now for fast delivery!',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-[#FFFDF9] text-[#1A1311]">
        <AuthProvider>
          {children}
          <CartDrawer />
          <ToastNotification />
        </AuthProvider>
      </body>
    </html>
  );
}
