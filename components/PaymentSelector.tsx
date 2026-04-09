'use client';

import { useState } from 'react';
import { CreditCard, Banknote, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { PaymentMethod } from '@/types';

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  disabled?: boolean;
  error?: string;
}

const paymentMethods: Array<{
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  details?: string;
}> = [
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    description: 'Pagá con tarjeta de débito, crédito o saldo en cuenta',
    icon: CreditCard,
    badge: 'Más seguro',
    details: 'Procesamiento instantáneo y confirmación inmediata'
  },
  {
    id: 'cash',
    name: 'Efectivo',
    description: 'Pagá en efectivo al recibir tu pedido',
    icon: Banknote,
    details: 'Llevá el monto exacto para agilizar la entrega'
  }
];

export default function PaymentSelector({
  selectedMethod,
  onSelectMethod,
  disabled = false,
  error
}: PaymentSelectorProps) {
  const [hoveredMethod, setHoveredMethod] = useState<PaymentMethod | null>(null);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Método de pago
      </label>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          const isHovered = hoveredMethod === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => !disabled && onSelectMethod(method.id)}
              onMouseEnter={() => setHoveredMethod(method.id)}
              onMouseLeave={() => setHoveredMethod(null)}
              disabled={disabled}
              className={`
                w-full p-4 rounded-xl border-2 text-left transition-all
                ${isSelected 
                  ? 'border-purple-600 bg-purple-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isHovered && !isSelected ? 'transform scale-[1.02]' : ''}
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}
                  `}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`
                        font-bold text-base
                        ${isSelected ? 'text-purple-900' : 'text-gray-900'}
                      `}
                    >
                      {method.name}
                    </h3>
                    
                    {method.badge && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {method.badge}
                      </span>
                    )}
                  </div>

                  <p
                    className={`
                      text-sm mb-2
                      ${isSelected ? 'text-purple-700' : 'text-gray-600'}
                    `}
                  >
                    {method.description}
                  </p>

                  {method.details && (
                    <p className="text-xs text-gray-500">
                      {method.details}
                    </p>
                  )}

                  {method.id === 'mercadopago' && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 relative">
                          <svg viewBox="0 0 24 24" className="w-full h-full">
                            <rect fill="#009EE3" width="24" height="24" rx="4"/>
                            <text x="12" y="17" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">V</text>
                          </svg>
                        </div>
                        <div className="w-6 h-6 relative">
                          <svg viewBox="0 0 24 24" className="w-full h-full">
                            <rect fill="#EB001B" width="24" height="24" rx="4"/>
                            <text x="12" y="17" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">M</text>
                          </svg>
                        </div>
                        <div className="w-6 h-6 relative">
                          <svg viewBox="0 0 24 24" className="w-full h-full">
                            <rect fill="#0079BE" width="24" height="24" rx="4"/>
                            <text x="12" y="17" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">A</text>
                          </svg>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">y más</span>
                    </div>
                  )}
                </div>

                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected 
                      ? 'border-purple-600 bg-purple-600' 
                      : 'border-gray-300'
                    }
                  `}
                >
                  {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-2">
          <div className="text-blue-600 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Información importante
            </p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Con Mercado Pago tu pedido se confirma automáticamente</li>
              <li>• En efectivo, confirmamos al recibir el pago</li>
              <li>• Todos los pagos son seguros y protegidos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
