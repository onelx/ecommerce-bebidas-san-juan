import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
}

export function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product);
    }
  };

  return (
    <Link href={`/productos/${product.id}`}>
      <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200">
        {/* Badge de disponibilidad */}
        {!product.is_available && (
          <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Agotado
          </div>
        )}

        {product.is_pack && (
          <div className="absolute top-2 left-2 z-10 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Pack
          </div>
        )}

        {/* Imagen del producto */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.stock !== null && product.stock > 0 && product.stock < 10 && (
                <span className="text-xs text-orange-600 mt-1">
                  Solo {product.stock} disponibles
                </span>
              )}
            </div>

            {/* Botón de agregar rápido */}
            {product.is_available && onQuickAdd && (
              <button
                onClick={handleQuickAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
                aria-label={`Agregar ${product.name} al carrito`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
