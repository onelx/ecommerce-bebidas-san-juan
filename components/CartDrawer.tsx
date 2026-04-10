'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totals, removeItem, updateQuantity } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="relative z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                {/* Header */}
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Carrito de compras
                      {totals.items > 0 && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({totals.items} {totals.items === 1 ? 'producto' : 'productos'})
                        </span>
                      )}
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                        onClick={onClose}
                      >
                        <span className="sr-only">Cerrar carrito</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="mt-8">
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="text-gray-500 text-center">Tu carrito está vacío</p>
                        <button onClick={onClose} className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                          Continuar comprando
                        </button>
                      </div>
                    ) : (
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {items.map((item) => (
                          <li key={item.productId} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              {item.image_url ? (
                                <Image
                                  src={item.image_url}
                                  alt={item.name}
                                  width={96}
                                  height={96}
                                  className="h-full w-full object-cover object-center"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>
                                    <Link href={`/producto/${item.productId}`} onClick={onClose}>
                                      {item.name}
                                    </Link>
                                  </h3>
                                  <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{formatPrice(item.price)} c/u</p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                    className="text-gray-500 hover:text-gray-700 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                                  >
                                    -
                                  </button>
                                  <span className="text-gray-900 font-medium w-8 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                    className="text-gray-500 hover:text-gray-700 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.productId)}
                                  className="font-medium text-red-600 hover:text-red-500"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>{formatPrice(totals.subtotal)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      El costo de envío se calculará en el checkout.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/checkout"
                        onClick={onClose}
                        className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                      >
                        Finalizar compra
                      </Link>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        o{' '}
                        <button type="button" className="font-medium text-blue-600 hover:text-blue-500" onClick={onClose}>
                          Continuar comprando <span aria-hidden="true">&rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
