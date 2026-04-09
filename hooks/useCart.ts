import { useState, useEffect } from 'react';
import type { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'ecommerce-bebidas-cart';

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, itemCount: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCart(calculateTotals(parsed.items || []));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCart({ items: [], subtotal: 0, itemCount: 0 });
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: cart.items }));
    }
  }, [cart, isLoaded]);

  const calculateTotals = (items: CartItem[]): Cart => {
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { items, subtotal, itemCount };
  };

  const addItem = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        newItems = [...prevCart.items, { product, quantity }];
      }
      
      return calculateTotals(newItems);
    });
  };

  const removeItem = (productId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.product.id !== productId);
      return calculateTotals(newItems);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return calculateTotals(newItems);
    });
  };

  const clearCart = () => {
    setCart({ items: [], subtotal: 0, itemCount: 0 });
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.items.find(item => item.product.id === productId);
    return item?.quantity || 0;
  };

  return {
    items: cart.items,
    subtotal: cart.subtotal,
    itemCount: cart.itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isLoaded
  };
}
