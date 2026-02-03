'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    product: { title: string; handle: string; images: { edges: { node: { url: string; altText?: string | null } }[] } };
    priceV2: { amount: string; currencyCode: string };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: { edges: { node: CartLine }[] };
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
};

type CartState = {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  refresh: () => Promise<void>;
  addLine: (variantId: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  const addLine = useCallback(async (variantId: string, quantity = 1) => {
    setLoading(true);
    try {
      await fetch('/api/cart/lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', variantId, quantity })
      });
      await fetchCart();
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const updateLine = useCallback(async (lineId: string, quantity: number) => {
    setLoading(true);
    try {
      await fetch('/api/cart/lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', lineId, quantity })
      });
      await fetchCart();
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const removeLine = useCallback(async (lineId: string) => {
    setLoading(true);
    try {
      await fetch('/api/cart/lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', lineId })
      });
      await fetchCart();
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const itemCount = useMemo(() => cart?.totalQuantity ?? 0, [cart]);

  const value = useMemo(
    () => ({ cart, loading, itemCount, refresh: fetchCart, addLine, updateLine, removeLine }),
    [cart, loading, itemCount, fetchCart, addLine, updateLine, removeLine]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
