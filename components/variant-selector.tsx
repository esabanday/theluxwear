'use client';

import { useMemo } from 'react';
import { cn, formatMoney } from '@/lib/utils';
import type { Product } from '@/lib/shopify';

export default function VariantSelector({
  product,
  selectedVariantId,
  onSelect
}: {
  product: Product;
  selectedVariantId: string;
  onSelect: (variantId: string) => void;
}) {
  const variants = product.variants.edges.map((edge) => edge.node);

  const options = product.options;

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId) ?? variants[0],
    [variants, selectedVariantId]
  );

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.id} className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{option.name}</p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const candidate = variants.find((variant) =>
                variant.selectedOptions.some((opt) => opt.name === option.name && opt.value === value)
              );
              const isSelected = candidate?.id === selectedVariant?.id;
              const isAvailable = candidate?.availableForSale ?? false;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => candidate && onSelect(candidate.id)}
                  disabled={!candidate || !isAvailable}
                  className={cn(
                    'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition',
                    isSelected ? 'border-ink bg-ink text-bone' : 'border-ink/20 text-ink',
                    !isAvailable && 'opacity-40'
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {selectedVariant ? (
        <div className="flex items-center justify-between border-t border-ink/10 pt-4 text-sm">
          <span className="text-ink/60">Selected</span>
          <span className="font-medium">{formatMoney(selectedVariant.price)}</span>
        </div>
      ) : null}
    </div>
  );
}
