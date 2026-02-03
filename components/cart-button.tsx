'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart-context';

export default function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="relative inline-flex items-center justify-center rounded-full border border-ink/20 p-3">
      <ShoppingBag size={18} />
      {itemCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-bone">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
