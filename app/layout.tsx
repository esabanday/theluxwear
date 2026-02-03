import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Manrope } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Analytics from '@/components/analytics';
import { CartProvider } from '@/components/cart-context';

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700']
});

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: {
    default: 'LuxWear Co',
    template: '%s · LuxWear Co'
  },
  description: 'Luxury essentials crafted for modern wardrobes.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
