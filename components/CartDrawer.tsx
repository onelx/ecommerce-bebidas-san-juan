'use client';

import { Fragment } from 'react';
import { X, ShoppingCart, Minus, Plus, Trash2, Package } from 'lucide-react';
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
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
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
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Mi Carrito
              </h2>
              {itemCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {itemCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-600 mb-6">
                Agregá productos para comenzar tu pedido
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Ver productos
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
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
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      {item.product.is_pack && (
                        <div className="absolute top-1 left-1 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          PACK
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-blue-600 font-bold text-sm mb-2">
                        {formatPrice(item.product.price)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-white rounded transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="w-8 text-center font-semibold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-gray-700">Subtotal:</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="text-xs text-gray-600 text-center">
                  El costo de envío se calcula en el checkout
                </p>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Ir al Checkout
                </Link>

                <button
                  onClick={onClose}
                  className="w-full text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors"
                >
                  Seguir comprando
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
