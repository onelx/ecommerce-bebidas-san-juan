'use client';

import { useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

interface CartTotals {
  items: number;
  subtotal: number;
}

interface Cart {
  items: CartItem[];
  totals: CartTotals;
}

const CART_STORAGE_KEY = 'ecommerce-bebidas-cart';

const calculateTotals = (items: CartItem[]): CartTotals => ({
  items: items.reduce((sum, item) => sum + item.quantity, 0),
  subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
});

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], totals: { items: 0, subtotal: 0 } });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        const items: CartItem[] = parsed.items || [];
        setCart({ items, totals: calculateTotals(items) });
      } catch {
        setCart({ items: [], totals: { items: 0, subtotal: 0 } });
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: cart.items }));
    }
  }, [cart, isLoaded]);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart(prev => {
      const quantity = item.quantity ?? 1;
      const existingIndex = prev.items.findIndex(i => i.productId === item.productId);
      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = prev.items.map((i, idx) =>
          idx === existingIndex ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        newItems = [...prev.items, { ...item, quantity }];
      }
      return { items: newItems, totals: calculateTotals(newItems) };
    });
  };

  const removeItem = (productId: string) => {
    setCart(prev => {
      const newItems = prev.items.filter(i => i.productId !== productId);
      return { items: newItems, totals: calculateTotals(newItems) };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCart(prev => {
      const newItems = prev.items.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      );
      return { items: newItems, totals: calculateTotals(newItems) };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totals: { items: 0, subtotal: 0 } });
  };

  const getItemQuantity = (productId: string): number => {
    return cart.items.find(i => i.productId === productId)?.quantity || 0;
  };

  return {
    items: cart.items,
    totals: cart.totals,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isLoaded,
  };
}
