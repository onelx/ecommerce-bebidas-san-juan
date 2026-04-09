'use client';

import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

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

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      onRemoveItem(productId);
    } else {
      onUpdateQuantity(productId, newQuantity);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <div className="flex items-center justify-between px-4 py-6 bg-gradient-to-r from-purple-600 to-pink-600">
                      <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6" />
                        Mi Carrito
                        {itemCount > 0 && (
                          <span className="bg-white text-purple-600 text-sm font-bold px-2 py-1 rounded-full">
                            {itemCount}
                          </span>
                        )}
                      </Dialog.Title>
                      <button
                        type="button"
                        className="text-white hover:text-gray-200 transition-colors"
                        onClick={onClose}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-6">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <ShoppingCart className="w-24 h-24 text-gray-300 mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Tu carrito está vacío
                          </h3>
                          <p className="text-gray-500 mb-6">
                            Agregá productos para comenzar tu pedido
                          </p>
                          <button
                            onClick={onClose}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                          >
                            Ver Productos
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {items.map((item) => (
                            <div
                              key={item.product_id}
                              className="flex gap-4 bg-gray-50 rounded-lg p-3 border border-gray-200"
                            >
                              <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-md overflow-hidden">
                                <Image
                                  src={item.product.image_url || '/placeholder-product.png'}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                                  {item.product.name}
                                </h4>
                                <p className="text-sm font-medium text-purple-600 mb-2">
                                  {formatPrice(item.unit_price)}
                                </p>

                                <div className="flex items-center gap-2">
                                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
                                    <button
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item.product_id,
                                          item.quantity - 1
                                        )
                                      }
                                      className="p-1 hover:bg-gray-100 transition-colors"
                                      aria-label="Disminuir cantidad"
                                    >
                                      <Minus className="w-3 h-3 text-gray-600" />
                                    </button>
                                    <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center border-x border-gray-300">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item.product_id,
                                          item.quantity + 1
                                        )
                                      }
                                      disabled={item.quantity >= item.product.stock}
                                      className="p-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                      aria-label="Aumentar cantidad"
                                    >
                                      <Plus className="w-3 h-3 text-gray-600" />
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => onRemoveItem(item.product_id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    aria-label="Eliminar del carrito"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  {formatPrice(item.subtotal)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 bg-gray-50">
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-base">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium text-gray-900">
                              {formatPrice(subtotal)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Envío</span>
                            <span>Se calcula en el checkout</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3">
                            <span>Total</span>
                            <span className="text-purple-600">
                              {formatPrice(subtotal)}
                            </span>
                          </div>
                        </div>

                        <Link
                          href="/carrito"
                          onClick={onClose}
                          className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                        >
                          Ir al Carrito
                        </Link>

                        <button
                          onClick={onClose}
                          className="block w-full mt-3 bg-white text-purple-600 text-center py-3 px-6 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          Seguir Comprando
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
