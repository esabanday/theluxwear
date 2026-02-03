import SectionHeading from '@/components/section-heading';
import ShopGrid from '@/components/shop-grid';
import { getAllProducts } from '@/lib/shopify';

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <section className="lux-container space-y-12 py-16">
      <SectionHeading
        label="Shop"
        title="Luxury essentials, curated for modern wardrobes."
        description="Filter by size, category, and price."
      />
      <ShopGrid products={products} />
    </section>
  );
}
