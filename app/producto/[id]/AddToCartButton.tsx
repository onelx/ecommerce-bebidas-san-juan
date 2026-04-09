'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils/formatPrice';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
}

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const cartItem = items.find(item => item.productId === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  const availableStock = product.stock - currentQuantity;

  const handleAddToCart = async () => {
    if (quantity > availableStock) {
      alert(`Solo hay ${availableStock} unidades disponibles`);
      return;
    }

    setIsAdding(true);
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image_url: product.image_url,
      });
      setQuantity(1);
    } catch (error) {
      alert('Error al agregar al carrito');
    } finally {
      setIsAdding(false);
    }
  };

  const increment = () => {
    if (quantity < availableStock) {
      setQuantity(q => q + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  return (
    <div className="border-t pt-6">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-gray-700 font-medium">Cantidad:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={decrement}
            disabled={quantity <= 1}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="px-6 py-2 font-semibold">{quantity}</span>
          <button
            onClick={increment}
            disabled={quantity >= availableStock}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
        {availableStock < 5 && (
          <span className="text-orange-600 text-sm">
            Solo {availableStock} disponibles
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-gray-700 font-medium">Subtotal:</span>
        <span className="text-2xl font-bold text-indigo-600">
          {formatPrice(product.price * quantity)}
        </span>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isAdding || availableStock === 0}
        className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isAdding ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Agregando...
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Agregar al Carrito
          </>
        )}
      </button>
    </div>
  );
}
