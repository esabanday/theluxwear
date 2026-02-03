import Link from 'next/link';
import Image from 'next/image';
import SectionHeading from '@/components/section-heading';
import ProductCard from '@/components/product-card';
import { getFeaturedProducts } from '@/lib/shopify';

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="space-y-20 pb-24">
      <section className="lux-container grid items-center gap-12 pt-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Luxury DTC Essentials</p>
          <h1 className="text-4xl font-display sm:text-5xl">Quiet power. Elevated silhouettes. LuxWear Co.</h1>
          <p className="max-w-xl text-sm text-ink/70">
            LuxWear is a refined essentials label designed for polished, effortless wardrobes. Soft tailoring, sculpted
            fits, and elevated textures — made to move with you.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="lux-btn lux-btn-primary">
              Shop the Collection
            </Link>
            <Link href="/about" className="lux-btn lux-btn-ghost">
              Our Story
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[48px] bg-white shadow-soft">
          <Image
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80"
            alt="LuxWear editorial"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section className="lux-container space-y-10">
        <SectionHeading
          label="Featured"
          title="Signature pieces for the modern silhouette"
          description="Curated essentials with elevated materials and a second-skin feel."
        />
        <div className="lux-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/shop" className="lux-btn lux-btn-ghost">
            Explore All
          </Link>
        </div>
      </section>

      <section className="lux-container grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <SectionHeading
            label="Crafted"
            title="Design language rooted in modern luxury"
            description="Each drop is intentionally minimal, featuring tonal palettes, tactile fabrics, and sculpted proportion."
          />
          <ul className="space-y-4 text-sm text-ink/70">
            <li>• Limited runs to preserve exclusivity.</li>
            <li>• Soft tailoring for effortless polish.</li>
            <li>• Inclusive fits across silhouettes.</li>
          </ul>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-white shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
              alt="LuxWear editorial look"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-white shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"
              alt="LuxWear editorial look"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="lux-container rounded-[40px] border border-ink/10 bg-white px-6 py-12 md:px-12">
        <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Newsletter</p>
            <h2 className="text-3xl font-display">Join the LuxWear inner circle.</h2>
            <p className="text-sm text-ink/70">Receive first access to drops, styling notes, and private releases.</p>
          </div>
          <form className="flex flex-col gap-3" action="/api/newsletter" method="post">
            <input className="lux-input" type="email" name="email" placeholder="Email address" required />
            <button type="submit" className="lux-btn lux-btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
