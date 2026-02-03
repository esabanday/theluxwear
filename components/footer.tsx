import Link from 'next/link';

const policies = [
  { href: '/policies/shipping-returns', label: 'Shipping & Returns' },
  { href: '/policies/privacy', label: 'Privacy Policy' },
  { href: '/policies/terms', label: 'Terms' }
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-bone">
      <div className="lux-container grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">LuxWear Co</p>
          <p className="text-lg font-display">Luxury essentials designed for every silhouette.</p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Navigate</p>
          <div className="flex flex-col gap-2">
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Policies</p>
          <div className="flex flex-col gap-2">
            {policies.map((policy) => (
              <Link key={policy.href} href={policy.href}>
                {policy.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="lux-divider" />
      <div className="lux-container flex items-center justify-between py-6 text-xs text-ink/60">
        <span>© {new Date().getFullYear()} LuxWear Co. All rights reserved.</span>
        <span>Designed in New York</span>
      </div>
    </footer>
  );
}
