'use client';

import { useCart } from '@/components/cart-context';
import type { Product } from '@/lib/shopify';

export default function StickyAddToCart({
  product,
  selectedVariantId
}: {
  product: Product;
  selectedVariantId: string;
}) {
  const { addLine, loading } = useCart();
  const variant = product.variants.edges.find((edge) => edge.node.id === selectedVariantId)?.node;

  if (!variant) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-bone/95 px-4 py-3 shadow-soft md:hidden">
      <button
        className="lux-btn lux-btn-primary w-full"
        disabled={!variant.availableForSale || loading}
        onClick={() => addLine(variant.id, 1)}
      >
        {variant.availableForSale ? 'Add to Cart' : 'Sold Out'}
      </button>
    </div>
  );
}
