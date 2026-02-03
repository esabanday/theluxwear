import { getAllProducts, getCollections } from '@/lib/shopify';

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theluxwear.com';
  const products = await getAllProducts();
  const collections = await getCollections();

  const pages = ['/', '/shop', '/about', '/contact', '/cart', '/policies/shipping-returns', '/policies/privacy', '/policies/terms'];

  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date() })),
    ...products.map((product) => ({ url: `${siteUrl}/products/${product.handle}`, lastModified: new Date() })),
    ...collections.map((collection) => ({ url: `${siteUrl}/collections/${collection.handle}`, lastModified: new Date() }))
  ];
}
