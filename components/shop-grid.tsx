'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/shopify';
import ProductCard from '@/components/product-card';

const priceRanges = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 - $250', min: 100, max: 250 },
  { label: '$250 - $500', min: 250, max: 500 },
  { label: '$500+', min: 500, max: Infinity }
];

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' }
];

export default function ShopGrid({ products }: { products: Product[] }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [sort, setSort] = useState('featured');

  const sizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((product) => {
      const sizeOption = product.options?.find((option) => option.name.toLowerCase() === 'size');
      sizeOption?.values.forEach((value) => set.add(value));
    });
    return Array.from(set).sort();
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((product) => {
      if (product.productType) set.add(product.productType);
    });
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedSize) {
      list = list.filter((product) => {
        const sizeOption = product.options?.find((option) => option.name.toLowerCase() === 'size');
        return sizeOption?.values.includes(selectedSize);
      });
    }

    if (selectedCategory) {
      list = list.filter((product) => product.productType === selectedCategory);
    }

    if (selectedPrice) {
      const range = priceRanges.find((r) => r.label === selectedPrice);
      if (range) {
        list = list.filter((product) => {
          const price = Number(product.priceRange.minVariantPrice.amount);
          return price >= range.min && price < range.max;
        });
      }
    }

    if (sort === 'price-asc') {
      list.sort((a, b) => Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount));
    }

    if (sort === 'price-desc') {
      list.sort((a, b) => Number(b.priceRange.minVariantPrice.amount) - Number(a.priceRange.minVariantPrice.amount));
    }

    return list;
  }, [products, selectedSize, selectedCategory, selectedPrice, sort]);

  return (
    <div className="space-y-10">
      <div className="grid gap-4 rounded-3xl border border-ink/10 bg-white p-6 md:grid-cols-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Size</p>
          <select className="lux-input" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="">All</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Category</p>
          <select className="lux-input" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Price</p>
          <select className="lux-input" value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)}>
            <option value="">Any</option>
            {priceRanges.map((range) => (
              <option key={range.label} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Sort</p>
          <select className="lux-input" value={sort} onChange={(e) => setSort(e.target.value)}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="lux-grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
