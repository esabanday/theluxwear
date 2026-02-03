import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { cartCreate, cartFetch } from '@/lib/shopify';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/'
};

function getBuyerIp() {
  const headerStore = headers();
  const forwarded = headerStore.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim();
  }
  return headerStore.get('x-real-ip') || undefined;
}

export async function GET() {
  const cookieStore = cookies();
  const cartId = cookieStore.get('cartId')?.value;
  const buyerIp = getBuyerIp();

  try {
    let cart = null;
    if (cartId) {
      cart = await cartFetch(cartId, buyerIp);
    }

    if (!cart) {
      cart = await cartCreate(buyerIp);
      cookieStore.set('cartId', cart.id, cookieOptions);
    }

    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
