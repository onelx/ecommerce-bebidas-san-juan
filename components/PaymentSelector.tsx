'use client';

import React, { useState } from 'react';
import { PaymentMethod } from '@/types';

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  disabled?: boolean;
}

export function PaymentSelector({
  selectedMethod,
  onSelect,
  disabled = false,
}: PaymentSelectorProps) {
  const [showCashInfo, setShowCashInfo] = useState(false);

  const paymentOptions: Array<{
    method: PaymentMethod;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      method: 'mercadopago',
      label: 'Mercado Pago',
      description: 'Tarjetas de débito y crédito',
      badge: 'Seguro',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="8" fill="#009EE3" />
          <path
            d="M20 14C17.79 14 16 15.79 16 18V30C16 32.21 17.79 34 20 34H28C30.21 34 32 32.21 32 30V18C32 15.79 30.21 14 28 14H20ZM24 28C22.34 28 21 26.66 21 25C21 23.34 22.34 22 24 22C25.66 22 27 23.34 27 25C27 26.66 25.66 28 24 28Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      method: 'cash',
      label: 'Efectivo',
      description: 'Pagá al recibir tu pedido',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="8" fill="#10B981" />
          <path
            d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14ZM24 28C21.79 28 20 26.21 20 24C20 21.79 21.79 20 24 20C26.21 20 28 21.79 28 24C28 26.21 26.21 28 24 28Z"
            fill="white"
          />
          <path d="M25 16V18H23V16H25ZM25 30V32H23V30H25Z" fill="white" />
        </svg>
      ),
    },
  ];

  const handleSelect = (method: PaymentMethod) => {
    if (!disabled) {
      onSelect(method);
      if (method === 'cash') {
        setShowCashInfo(true);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Método de pago</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {paymentOptions.map((option) => {
          const isSelected = selectedMethod === option.method;

          return (
            <button
              key={option.method}
              type="button"
              onClick={() => handleSelect(option.method)}
              disabled={disabled}
              className={`relative flex flex-col p-4 border-2 rounded-lg transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Radio button visual */}
              <div className="absolute top-4 right-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">{option.icon}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{option.label}</p>
                    {option.badge && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Información adicional para pago en efectivo */}
      {selectedMethod === 'cash' && showCashInfo && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-yellow-800">
                Importante sobre pago en efectivo
              </h4>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>Tené el monto exacto o cambio disponible</li>
                <li>El repartidor no siempre tiene cambio para billetes grandes</li>
                <li>Podés pagar con billetes de hasta $2000</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Información de seguridad para Mercado Pago */}
      {selectedMethod === 'mercadopago' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-blue-800">
                Pago 100% seguro
              </h4>
              <p className="mt-1 text-sm text-blue-700">
                Tus datos están protegidos. Aceptamos todas las tarjetas de débito
                y crédito. Serás redirigido a Mercado Pago para completar el pago.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
