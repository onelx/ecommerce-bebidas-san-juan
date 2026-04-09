"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  showQuickAdd?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  showQuickAdd = true,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onAddToCart || !product.is_available) return;

    setIsAdding(true);
    try {
      await onAddToCart(product, quantity);
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <Link
      href={`/productos/${product.id}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {!product.is_available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
              Agotado
            </span>
          </div>
        )}

        {product.is_pack && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Pack
          </div>
        )}

        {product.stock > 0 && product.stock <= 10 && product.is_available && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
            ¡Últimas {product.stock}!
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-purple-600">
            {formatPrice(product.price)}
          </span>
          {product.stock > 0 && (
            <span className="text-xs text-gray-500">Stock: {product.stock}</span>
          )}
        </div>

        {showQuickAdd && product.is_available && onAddToCart && (
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                isAdding
                  ? "bg-green-500"
                  : "bg-purple-600 hover:bg-purple-700 active:scale-95"
              }`}
            >
              {isAdding ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Agregado
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Agregar
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
