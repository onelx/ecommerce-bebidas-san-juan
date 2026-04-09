'use client';

import { useCart } from '@/lib/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { X, ShoppingCart, Plus, Minus, Trash2, Snowflake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, includeIce, setIncludeIce, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  const handleCheckout = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-purple-600 text-white">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-lg font-semibold">
              Mi Carrito {totalItems > 0 && `(${totalItems})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-700 rounded-full transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-64px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 p-8">
              <ShoppingCart className="w-24 h-24 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 text-center mb-6">
                Agregá productos para comenzar tu pedido
              </p>
              <Link
                href="/catalogo"
                onClick={onClose}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Ver Catálogo
              </Link>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-gray-50 p-3 rounded-lg"
                  >
                    {/* Imagen */}
                    <div className="relative w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
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
                          <ShoppingCart className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate mb-1">
                        {item.product.name}
                      </h4>
                      <p className="text-sm font-bold text-purple-600 mb-2">
                        {formatPrice(item.product.price)}
                      </p>

                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Opción de Hielo */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeIce}
                      onChange={(e) => setIncludeIce(e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <Snowflake className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900 block">
                        Incluir hielo
                      </span>
                      <span className="text-sm text-gray-600">
                        Gratis con tu pedido
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Info de envío */}
                <p className="text-xs text-gray-500 text-center">
                  El costo de envío se calcula en el checkout
                </p>

                {/* Botones */}
                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={handleCheckout}
                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                  >
                    Ir al Checkout
                  </Link>
                  
                  <button
                    onClick={clearCart}
                    className="w-full text-red-600 hover:bg-red-50 py-2 rounded-lg font-medium transition-colors"
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
