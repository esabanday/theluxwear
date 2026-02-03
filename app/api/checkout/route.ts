import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { cartFetch } from '@/lib/shopify';

function getBuyerIp() {
  const headerStore = headers();
  const forwarded = headerStore.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim();
  }
  return headerStore.get('x-real-ip') || undefined;
}

export async function POST() {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return NextResponse.json({ error: 'No cart found' }, { status: 400 });
  }

  try {
    const cart = await cartFetch(cartId, getBuyerIp());
    return NextResponse.json({ checkoutUrl: cart?.checkoutUrl ?? null });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
