import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductGallery from '@/components/product-gallery';
import ProductDetail from '@/components/product-detail';
import { formatMoney } from '@/lib/utils';
import { getProductByHandle } from '@/lib/shopify';
import { productJsonLd } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getProductByHandle(params.handle);
  if (!product) return {};

  const image = product.featuredImage?.url;

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: image ? [image] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: image ? [image] : []
    }
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle);

  if (!product) return notFound();

  const variant = product.variants.edges[0]?.node;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theluxwear.com';
  const url = `${siteUrl}/products/${product.handle}`;
  const jsonLd = productJsonLd(product, url);

  return (
    <section className="lux-container grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
      <ProductGallery product={product} />
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">{product.productType || 'Essentials'}</p>
        <h1 className="text-4xl font-display">{product.title}</h1>
        {variant ? (
          <div className="flex items-center gap-3 text-lg">
            <span>{formatMoney(variant.price)}</span>
            {variant.compareAtPrice ? (
              <span className="text-sm text-ink/40 line-through">{formatMoney(variant.compareAtPrice)}</span>
            ) : null}
          </div>
        ) : null}
        <div className="text-sm text-ink/70" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        <ProductDetail product={product} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
