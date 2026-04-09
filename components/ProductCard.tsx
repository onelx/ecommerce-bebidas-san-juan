'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.is_available || product.stock < 1) return;
    
    setIsAdding(true);
    
    if (onAddToCart) {
      await onAddToCart(product, quantity);
    }
    
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 500);
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const isOutOfStock = !product.is_available || product.stock < 1;

  return (
    <Link href={`/productos/${product.id}`}>
      <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
        {product.is_pack && (
          <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            PACK
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            AGOTADO
          </div>
        )}

        {!isOutOfStock && product.stock <= 5 && (
          <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            ¡ÚLTIMAS {product.stock}!
          </div>
        )}

        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image_url || '/placeholder-product.png'}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
              isOutOfStock ? 'opacity-50 grayscale' : ''
            }`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            </div>
            {!isOutOfStock && product.stock <= 10 && product.stock > 5 && (
              <span className="text-xs text-orange-600 font-medium">
                Stock: {product.stock}
              </span>
            )}
          </div>

          {!isOutOfStock && (
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-medium text-gray-900 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={quantity >= product.stock}
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                  isAdding
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md'
                }`}
                aria-label="Agregar al carrito"
              >
                {isAdding ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ¡Agregado!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Agregar
                  </>
                )}
              </button>
            </div>
          )}

          {isOutOfStock && (
            <button
              disabled
              className="w-full px-4 py-2 rounded-md font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              No disponible
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
