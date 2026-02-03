import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Money } from '@/lib/shopify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(money: Money) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode
  }).format(Number(money.amount));
}
