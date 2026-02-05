type ShopifyResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/${
  process.env.SHOPIFY_API_VERSION || '2024-10'
}/graphql.json`;

type FetchOptions = {
  buyerIp?: string;
};

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: FetchOptions
) {
  if (!process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error('Missing Shopify env vars');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  };

  if (options?.buyerIp) {
    headers['Shopify-Storefront-Buyer-IP'] = options.buyerIp;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    cache: 'no-store'
  });

  const json = (await res.json()) as ShopifyResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(', '));
  }

  return json.data as T;
}

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage?: { url: string; altText?: string | null } | null;
  media?: {
    edges: {
      node: {
        __typename: 'MediaImage' | 'Video' | 'ExternalVideo' | 'Model3d';
        image?: { url: string; altText?: string | null } | null;
        previewImage?: { url: string; altText?: string | null } | null;
        sources?: { url: string; mimeType: string }[];
        embedUrl?: string;
      };
    }[];
  };
  images: { edges: { node: { url: string; altText?: string | null } }[] };
  options: { id: string; name: string; values: string[] }[];
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        selectedOptions: { name: string; value: string }[];
        price: Money;
        compareAtPrice?: Money | null;
      };
    }[];
  };
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
};

export type Collection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: { url: string; altText?: string | null } | null;
};

export async function getFeaturedProducts() {
  const query = `
    query FeaturedProducts($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            id
            title
            handle
            availableForSale
            productType
            tags
            featuredImage { url altText }
            media(first: 4) {
              edges {
                node {
                  __typename
                  ... on MediaImage {
                    image { url altText }
                  }
                  ... on Video {
                    sources { url mimeType }
                    previewImage { url altText }
                  }
                  ... on ExternalVideo {
                    embedUrl
                    previewImage { url altText }
                  }
                }
              }
            }
            priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ products: { edges: { node: Product }[] } }>(query, { first: 6 });
  return data.products.edges.map((edge) => edge.node);
}

export async function getAllProducts() {
  const query = `
    query AllProducts($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            availableForSale
            productType
            tags
            featuredImage { url altText }
            media(first: 4) {
              edges {
                node {
                  __typename
                  ... on MediaImage {
                    image { url altText }
                  }
                  ... on Video {
                    sources { url mimeType }
                    previewImage { url altText }
                  }
                  ... on ExternalVideo {
                    embedUrl
                    previewImage { url altText }
                  }
                }
              }
            }
            options { id name values }
            variants(first: 50) {
              edges {
                node {
                  id
                  availableForSale
                  selectedOptions { name value }
                  price { amount currencyCode }
                  compareAtPrice { amount currencyCode }
                }
              }
            }
            priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ products: { edges: { node: Product }[] } }>(query, { first: 50 });
  return data.products.edges.map((edge) => edge.node);
}

export async function getProductByHandle(handle: string) {
  const query = `
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        productType
        tags
        availableForSale
        featuredImage { url altText }
        images(first: 12) { edges { node { url altText } } }
        options { id name values }
        variants(first: 50) {
          edges {
            node {
              id
              title
              availableForSale
              selectedOptions { name value }
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
            }
          }
        }
        priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
      }
    }
  `;

  const data = await shopifyFetch<{ product: Product | null }>(query, { handle });
  return data.product;
}

export async function getCollections() {
  const query = `
    query Collections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image { url altText }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ collections: { edges: { node: Collection }[] } }>(query, { first: 12 });
  return data.collections.edges.map((edge) => edge.node);
}

export async function getCollectionByHandle(handle: string) {
  const query = `
    query CollectionByHandle($handle: String!) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        image { url altText }
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              availableForSale
              productType
              tags
              featuredImage { url altText }
              media(first: 4) {
                edges {
                  node {
                    __typename
                    ... on MediaImage {
                      image { url altText }
                    }
                    ... on Video {
                      sources { url mimeType }
                      previewImage { url altText }
                    }
                    ... on ExternalVideo {
                      embedUrl
                      previewImage { url altText }
                    }
                  }
                }
              }
              priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ collection: Collection & { products: { edges: { node: Product }[] } } | null }>(query, { handle });
  return data.collection;
}

export const cartFragment = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions { name value }
              priceV2 { amount currencyCode }
              product {
                title
                handle
                images(first: 1) { edges { node { url altText } } }
              }
            }
          }
        }
      }
    }
  }
`;

export async function cartCreate(buyerIp?: string) {
  const query = `
    ${cartFragment}
    mutation CartCreate {
      cartCreate {
        cart { ...CartFragment }
        userErrors { message }
      }
    }
  `;

  const data = await shopifyFetch<{ cartCreate: { cart: any; userErrors: { message: string }[] } }>(query, undefined, { buyerIp });
  if (data.cartCreate.userErrors?.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(', '));
  }
  return data.cartCreate.cart;
}

export async function cartLinesAdd(cartId: string, lines: { merchandiseId: string; quantity: number }[], buyerIp?: string) {
  const query = `
    ${cartFragment}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFragment }
        userErrors { message }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesAdd: { cart: any; userErrors: { message: string }[] } }>(query, { cartId, lines }, { buyerIp });
  if (data.cartLinesAdd.userErrors?.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join(', '));
  }
  return data.cartLinesAdd.cart;
}

export async function cartLinesUpdate(cartId: string, lines: { id: string; quantity: number }[], buyerIp?: string) {
  const query = `
    ${cartFragment}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFragment }
        userErrors { message }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesUpdate: { cart: any; userErrors: { message: string }[] } }>(query, { cartId, lines }, { buyerIp });
  if (data.cartLinesUpdate.userErrors?.length) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(', '));
  }
  return data.cartLinesUpdate.cart;
}

export async function cartLinesRemove(cartId: string, lineIds: string[], buyerIp?: string) {
  const query = `
    ${cartFragment}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFragment }
        userErrors { message }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesRemove: { cart: any; userErrors: { message: string }[] } }>(query, { cartId, lineIds }, { buyerIp });
  if (data.cartLinesRemove.userErrors?.length) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join(', '));
  }
  return data.cartLinesRemove.cart;
}

export async function cartFetch(cartId: string, buyerIp?: string) {
  const query = `
    ${cartFragment}
    query CartFetch($id: ID!) {
      cart(id: $id) {
        ...CartFragment
      }
    }
  `;

  const data = await shopifyFetch<{ cart: any }>(query, { id: cartId }, { buyerIp });
  return data.cart;
}
