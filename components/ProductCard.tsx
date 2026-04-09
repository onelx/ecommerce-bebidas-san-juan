import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Link href={`/productos/${product.id}`}>
      <div className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
        {/* Badge de Pack */}
        {product.is_pack && (
          <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Package className="w-3 h-3" />
            Pack
          </div>
        )}

        {/* Badge de Stock Bajo */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ¡Últimas unidades!
          </div>
        )}

        {/* Badge de Sin Stock */}
        {!product.is_available || product.stock === 0 && (
          <div className="absolute top-3 right-3 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Sin stock
          </div>
        )}

        {/* Imagen del Producto */}
        <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
          )}
          
          {/* Overlay en hover */}
          {product.is_available && product.stock > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          )}

          {/* Overlay de no disponible */}
          {(!product.is_available || product.stock === 0) && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">No disponible</span>
            </div>
          )}
        </div>

        {/* Información del Producto */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-purple-600">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 && product.stock <= 10 && (
                <span className="text-xs text-gray-500 mt-1">
                  Stock: {product.stock} unidades
                </span>
              )}
            </div>

            {/* Botón de Agregar Rápido */}
            {product.is_available && product.stock > 0 && (
              <button
                onClick={handleQuickAdd}
                className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Agregar al carrito"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
