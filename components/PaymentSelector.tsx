'use client';

import { useState } from 'react';
import { PaymentMethod } from '@/types';
import { CreditCard, Banknote, Check } from 'lucide-react';
import Image from 'next/image';

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  disabled?: boolean;
}

export default function PaymentSelector({
  selectedMethod,
  onSelectMethod,
  disabled = false,
}: PaymentSelectorProps) {
  const paymentMethods = [
    {
      id: 'mercadopago' as PaymentMethod,
      name: 'Mercado Pago',
      description: 'Pagá con tarjeta de crédito/débito',
      icon: CreditCard,
      features: ['Pago seguro', 'Confirmación inmediata', 'Todas las tarjetas'],
      recommended: true,
    },
    {
      id: 'cash' as PaymentMethod,
      name: 'Efectivo',
      description: 'Pagá cuando recibís tu pedido',
      icon: Banknote,
      features: ['Pago al recibir', 'Sin recargos', 'Llevá cambio'],
      recommended: false,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Método de pago
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              disabled={disabled}
              className={`relative flex flex-col p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-purple-600 bg-purple-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {method.recommended && (
                <span className="absolute -top-2 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Recomendado
                </span>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-purple-600' : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isSelected ? 'text-white' : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <div>
                    <h4
                      className={`font-semibold ${
                        isSelected ? 'text-purple-900' : 'text-gray-900'
                      }`}
                    >
                      {method.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {method.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <ul className="space-y-1.5 ml-11">
                {method.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-purple-600' : 'bg-gray-400'
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {method.id === 'mercadopago' && (
                <div className="mt-3 pt-3 border-t border-gray-200 ml-11">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/mercadopago-logo.svg"
                      alt="Mercado Pago"
                      width={80}
                      height={20}
                      className="opacity-70"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="text-xs text-gray-500">
                      Pago 100% seguro
                    </span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedMethod === 'cash' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Banknote className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">
                Importante - Pago en Efectivo
              </h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Tené el monto exacto o cambio disponible</li>
                <li>• El repartidor confirmará el pago al entregar</li>
                <li>• Aceptamos billetes de hasta $10.000</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'mercadopago' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                Pago con Mercado Pago
              </h4>
              <p className="text-sm text-blue-800">
                Serás redirigido a Mercado Pago para completar tu pago de forma
                segura. Una vez confirmado, procesaremos tu pedido inmediatamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
