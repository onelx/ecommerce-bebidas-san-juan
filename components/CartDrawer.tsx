'use client';

import { Fragment } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { CartItem } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  subtotal: number;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  subtotal
}: CartDrawerProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (productId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity <= 0) {
      onRemoveItem(productId);
    } else {
      onUpdateQuantity(productId, newQuantity);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-purple-600 text-white">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <h2 className="text-lg font-bold">
                Mi Carrito {totalItems > 0 && `(${totalItems})`}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-600 font-medium mb-2">Tu carrito está vacío</p>
                <p className="text-sm text-gray-500 mb-6">
                  Agregá productos para empezar tu pedido
                </p>
                <Link
                  href="/catalogo"
                  onClick={onClose}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Ver Catálogo
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                        {item.product.name}
                      </h3>
                      
                      <p className="text-purple-600 font-bold mb-2">
                        {formatPrice(item.product.price)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity, -1)}
                            className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          
                          <span className="px-3 font-semibold text-gray-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity, 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.quantity >= item.product.stock && (
                        <p className="text-xs text-amber-600 mt-1">
                          Stock máximo alcanzado
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-purple-600 font-medium">A calcular</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-lg"
                >
                  Ir al Checkout
                </Link>

                <Link
                  href="/catalogo"
                  onClick={onClose}
                  className="block w-full text-center py-2 mt-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
