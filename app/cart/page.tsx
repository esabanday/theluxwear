import CartView from '@/components/cart-view';

export default function CartPage() {
  return (
    <section className="lux-container py-16">
      <div className="space-y-6">
        <h1 className="text-4xl font-display">Your Cart</h1>
        <CartView />
      </div>
    </section>
  );
}
