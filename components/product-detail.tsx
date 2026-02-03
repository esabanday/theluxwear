'use client';

import { useState } from 'react';
import type { Product } from '@/lib/shopify';
import ProductPurchase from '@/components/product-purchase';
import StickyAddToCart from '@/components/sticky-atc';

export default function ProductDetail({ product }: { product: Product }) {
  const firstVariant = product.variants.edges[0]?.node;
  const [selectedVariantId, setSelectedVariantId] = useState(firstVariant?.id ?? '');

  return (
    <>
      <ProductPurchase product={product} selectedVariantId={selectedVariantId} onSelect={setSelectedVariantId} />
      <StickyAddToCart product={product} selectedVariantId={selectedVariantId} />
    </>
  );
}
