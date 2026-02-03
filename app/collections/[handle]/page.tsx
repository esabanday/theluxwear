import { notFound } from 'next/navigation';
import SectionHeading from '@/components/section-heading';
import ProductCard from '@/components/product-card';
import { getCollectionByHandle } from '@/lib/shopify';

export default async function CollectionPage({ params }: { params: { handle: string } }) {
  const collection = await getCollectionByHandle(params.handle);

  if (!collection) {
    return notFound();
  }

  const products = collection.products.edges.map((edge) => edge.node);

  return (
    <section className="lux-container space-y-12 py-16">
      <SectionHeading label="Collection" title={collection.title} description={collection.description} />
      <div className="lux-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
