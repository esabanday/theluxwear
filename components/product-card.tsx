import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/shopify';
import { formatMoney } from '@/lib/utils';

export default function ProductCard({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;

  return (
    <Link href={`/products/${product.handle}`} className="group space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-white shadow-soft">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
        {!product.availableForSale && (
          <span className="absolute left-4 top-4 lux-pill bg-bone/90">Sold out</span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-[0.2em] text-ink/60">{product.productType || 'Essentials'}</p>
        <h3 className="text-lg font-display">{product.title}</h3>
        <p className="text-sm text-ink/70">{formatMoney(price)}</p>
      </div>
    </Link>
  );
}
