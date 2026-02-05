'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import CartButton from '@/components/cart-button';

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/prayer-times', label: 'Prayer Times' },
  { href: '/policies/shipping-returns', label: 'Shipping & Returns' }
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-ink/10 bg-bone/80 backdrop-blur">
      <div className="lux-container flex items-center justify-between py-5">
        <Link href="/" className="text-lg font-display tracking-[0.25em] uppercase">
          LuxWear Co
        </Link>
        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition ${pathname === link.href ? 'text-ink' : 'text-ink/60 hover:text-ink'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/shop" className="hidden lux-btn lux-btn-ghost md:inline-flex">
            Browse
          </Link>
          <CartButton />
        </div>
      </div>
      <div className="lux-divider" />
    </header>
  );
}
