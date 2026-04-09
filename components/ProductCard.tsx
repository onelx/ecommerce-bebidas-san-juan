import Image from 'next/image';
import { ShoppingCart, Package } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAddingToCart?: boolean;
}

export default function ProductCard({ product, onAddToCart, isAddingToCart = false }: ProductCardProps) {
  const isAvailable = product.is_available && product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAvailable && !isAddingToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}
        
        {product.is_pack && (
          <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            PACK
          </div>
        )}
        
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-lg">
              SIN STOCK
            </span>
          </div>
        )}

        {isAvailable && product.stock <= 5 && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            ¡ÚLTIMAS {product.stock}!
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.is_pack && (
              <span className="text-xs text-gray-500">
                Precio por pack
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAddingToCart}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all
              ${isAvailable 
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
              ${isAddingToCart ? 'opacity-50 cursor-wait' : ''}
            `}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isAddingToCart ? 'Agregando...' : 'Agregar'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
