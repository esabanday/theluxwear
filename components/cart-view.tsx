'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart-context';
import { formatMoney } from '@/lib/utils';

export default function CartView() {
  const { cart, loading, updateLine, removeLine } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', { method: 'POST' });
    const data = await res.json();
    if (data.checkoutUrl) {
      router.push(data.checkoutUrl);
    }
  };

  if (!cart) {
    return <p className="text-sm text-ink/60">Your cart is empty.</p>;
  }

  const lines = cart.lines?.edges?.map((edge) => edge.node) ?? [];

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        {lines.length === 0 ? (
          <p className="text-sm text-ink/60">Your cart is empty.</p>
        ) : (
          lines.map((line) => (
            <div key={line.id} className="flex gap-4 rounded-3xl border border-ink/10 bg-white p-4">
              <div className="relative h-28 w-24 overflow-hidden rounded-2xl">
                <Image
                  src={line.merchandise.product.images.edges[0]?.node.url}
                  alt={line.merchandise.product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{line.merchandise.product.title}</p>
                <p className="font-display text-lg">{line.merchandise.title}</p>
                <p className="text-sm text-ink/70">{formatMoney(line.merchandise.priceV2)}</p>
                <div className="flex items-center gap-2">
                  <button
                    className="lux-pill"
                    onClick={() => updateLine(line.id, Math.max(1, line.quantity - 1))}
                    disabled={loading}
                  >
                    -
                  </button>
                  <span className="text-sm">{line.quantity}</span>
                  <button
                    className="lux-pill"
                    onClick={() => updateLine(line.id, line.quantity + 1)}
                    disabled={loading}
                  >
                    +
                  </button>
                  <button
                    className="text-xs uppercase tracking-[0.2em] text-ink/50"
                    onClick={() => removeLine(line.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="space-y-4 rounded-3xl border border-ink/10 bg-white p-6">
        <h3 className="text-lg font-display">Order Summary</h3>
        <div className="flex items-center justify-between text-sm text-ink/70">
          <span>Subtotal</span>
          <span>{formatMoney(cart.cost.subtotalAmount)}</span>
        </div>
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Total</span>
          <span>{formatMoney(cart.cost.totalAmount)}</span>
        </div>
        <button className="lux-btn lux-btn-primary w-full" onClick={handleCheckout} disabled={loading}>
          Proceed to Checkout
        </button>
        <p className="text-xs text-ink/50">Checkout is securely completed on Shopify.</p>
      </div>
    </div>
  );
}
