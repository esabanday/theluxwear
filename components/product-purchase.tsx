'use client';

import type { Product } from '@/lib/shopify';
import { useCart } from '@/components/cart-context';
import VariantSelector from '@/components/variant-selector';

export default function ProductPurchase({
  product,
  selectedVariantId,
  onSelect
}: {
  product: Product;
  selectedVariantId: string;
  onSelect: (variantId: string) => void;
}) {
  const variants = product.variants.edges.map((edge) => edge.node);
  const { addLine, loading } = useCart();

  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];

  return (
    <div className="space-y-6">
      <VariantSelector product={product} selectedVariantId={selectedVariantId} onSelect={onSelect} />
      <button
        className="lux-btn lux-btn-primary w-full"
        disabled={!selectedVariant?.availableForSale || loading}
        onClick={() => selectedVariant && addLine(selectedVariant.id, 1)}
      >
        {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
      </button>
      <p className="text-xs text-ink/50">Secure checkout powered by Shopify.</p>
    </div>
  );
}
