'use client';

import { useState } from 'react';
import { PaymentMethod } from '@/types';
import { CreditCard, Wallet, Banknote, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface PaymentSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
  total: number;
}

export default function PaymentSelector({ 
  value, 
  onChange, 
  disabled = false,
  total 
}: PaymentSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(value);

  const handleSelect = (method: PaymentMethod) => {
    if (!disabled) {
      setSelectedMethod(method);
      onChange(method);
    }
  };

  const paymentMethods = [
    {
      id: 'mercadopago' as PaymentMethod,
      name: 'Mercado Pago',
      description: 'Pagá con tarjeta, débito o efectivo en Mercado Pago',
      icon: Wallet,
      logo: '/mercadopago-logo.svg',
      benefits: [
        'Pago seguro',
        'Confirmación inmediata',
        'Todas las tarjetas'
      ],
      color: 'blue'
    },
    {
      id: 'cash' as PaymentMethod,
      name: 'Efectivo',
      description: 'Pagá en efectivo al recibir tu pedido',
      icon: Banknote,
      benefits: [
        'Sin comisiones',
        'Pago contra entrega',
        'Llevá el cambio justo'
      ],
      color: 'green'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">
          Método de Pago
        </h3>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => handleSelect(method.id)}
              disabled={disabled}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all
                ${isSelected 
                  ? `border-${method.color}-500 bg-${method.color}-50` 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div 
                    className={`
                      p-2 rounded-lg
                      ${isSelected 
                        ? `bg-${method.color}-100` 
                        : 'bg-gray-100'
                      }
                    `}
                  >
                    {method.logo ? (
                      <div className="w-8 h-8 relative">
                        <Image
                          src={method.logo}
                          alt={method.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <Icon 
                        className={`
                          w-6 h-6
                          ${isSelected 
                            ? `text-${method.color}-600` 
                            : 'text-gray-600'
                          }
                        `}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {method.name}
                      </h4>
                      {method.id === 'mercadopago' && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          Recomendado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {method.description}
                    </p>

                    <ul className="space-y-1">
                      {method.benefits.map((benefit, index) => (
                        <li 
                          key={index}
                          className="text-xs text-gray-600 flex items-center gap-1.5"
                        >
                          <CheckCircle2 
                            className={`
                              w-3.5 h-3.5 flex-shrink-0
                              ${isSelected 
                                ? `text-${method.color}-600` 
                                : 'text-gray-400'
                              }
                            `}
                          />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div 
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected 
                      ? `border-${method.color}-600 bg-${method.color}-600` 
                      : 'border-gray-300'
                    }
                  `}
                >
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>

              {isSelected && method.id === 'cash' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Total a pagar en efectivo:</span>{' '}
                    <span className="text-lg font-bold text-green-700">
                      ${total.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    💡 Tip: Tené el cambio justo para agilizar la entrega
                  </p>
                </div>
              )}

              {isSelected && method.id === 'mercadopago' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    Serás redirigido a Mercado Pago para completar el pago de forma segura
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-700 text-xs font-bold">💳</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Pago 100% Seguro
            </p>
            <p className="text-xs text-gray-600">
              Todos los pagos están protegidos. Tu información financiera nunca se comparte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
