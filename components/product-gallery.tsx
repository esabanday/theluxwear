'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/lib/shopify';

export default function ProductGallery({ product }: { product: Product }) {
  const images = product.images.edges.map((edge) => edge.node);
  const [active, setActive] = useState(images[0]);

  if (!active) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-white shadow-soft">
        <Image src={active.url} alt={active.altText || product.title} fill className="object-cover" />
      </div>
      <div className="flex gap-3 overflow-x-auto">
        {images.map((image) => (
          <button
            key={image.url}
            type="button"
            className={`relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-2xl border ${
              image.url === active.url ? 'border-ink' : 'border-ink/20'
            }`}
            onClick={() => setActive(image)}
          >
            <Image src={image.url} alt={image.altText || product.title} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
