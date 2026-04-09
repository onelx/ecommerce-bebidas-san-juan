import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
}

export default function ProductCard({ 
  product, 
  onAddToCart,
  onQuickAdd 
}: ProductCardProps) {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product);
    } else if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const isAvailable = product.is_available && product.stock > 0;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {product.is_pack && (
        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          PACK
        </div>
      )}
      
      {!isAvailable && (
        <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          AGOTADO
        </div>
      )}

      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
              !isAvailable ? 'opacity-50 grayscale' : ''
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.stock <= 10 && product.stock > 0 && (
              <span className="text-xs text-orange-600 font-medium">
                Últimas {product.stock} unidades
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!isAvailable}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
              ${isAvailable 
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm hover:shadow-md' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>
      </div>

      {isAvailable && (
        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      )}
    </div>
  );
}
