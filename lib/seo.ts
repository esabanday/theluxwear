import type { Product } from '@/lib/shopify';

export function productJsonLd(product: Product, url: string) {
  const variants = product.variants.edges.map((edge) => edge.node);
  const offers = variants.map((variant) => ({
    '@type': 'Offer',
    priceCurrency: variant.price.currencyCode,
    price: variant.price.amount,
    availability: variant.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    url
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.edges.map((edge) => edge.node.url),
    offers
  };
}
