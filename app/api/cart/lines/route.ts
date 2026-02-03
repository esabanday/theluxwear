import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { cartCreate, cartLinesAdd, cartLinesRemove, cartLinesUpdate } from '@/lib/shopify';

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

export async function POST(request: Request) {
  const cookieStore = cookies();
  let cartId = cookieStore.get('cartId')?.value;
  const buyerIp = getBuyerIp();

  const body = await request.json();
  const { action } = body as { action: 'add' | 'update' | 'remove' };

  try {
    if (!cartId) {
      const cart = await cartCreate(buyerIp);
      cartId = cart.id;
      cookieStore.set('cartId', cartId, cookieOptions);
    }

    let cart = null;

    if (action === 'add') {
      const { variantId, quantity } = body as { variantId: string; quantity: number };
      cart = await cartLinesAdd(cartId, [{ merchandiseId: variantId, quantity }], buyerIp);
    }

    if (action === 'update') {
      const { lineId, quantity } = body as { lineId: string; quantity: number };
      cart = await cartLinesUpdate(cartId, [{ id: lineId, quantity }], buyerIp);
    }

    if (action === 'remove') {
      const { lineId } = body as { lineId: string };
      cart = await cartLinesRemove(cartId, [lineId], buyerIp);
    }

    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
