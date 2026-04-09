'use client';

import { useState } from 'react';
import { CreditCard, Banknote, Check } from 'lucide-react';
import Image from 'next/image';

export type PaymentMethod = 'mercadopago' | 'cash';

interface PaymentSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

export function PaymentSelector({
  value,
  onChange,
  disabled = false,
}: PaymentSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(value);

  const handleSelect = (method: PaymentMethod) => {
    if (disabled) return;
    setSelectedMethod(method);
    onChange(method);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Método de pago <span className="text-red-500">*</span>
      </label>

      {/* Mercado Pago */}
      <button
        type="button"
        onClick={() => handleSelect('mercadopago')}
        disabled={disabled}
        className={`w-full p-4 border-2 rounded-lg transition-all duration-200 ${
          selectedMethod === 'mercadopago'
            ? 'border-purple-600 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400 bg-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo de Mercado Pago */}
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Mercado Pago</h3>
              <p className="text-sm text-gray-600">
                Tarjeta de crédito/débito
              </p>
            </div>
          </div>

          {selectedMethod === 'mercadopago' && (
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Detalles adicionales */}
        {selectedMethod === 'mercadopago' && (
          <div className="mt-3 pt-3 border-t border-purple-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex gap-1">
                <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                  V
                </div>
                <div className="w-8 h-5 bg-gradient-to-r from-red-600 to-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                  M
                </div>
                <div className="w-8 h-5 bg-gradient-to-r from-blue-800 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
              </div>
              <span className="text-xs">y más métodos disponibles</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Pago seguro procesado por Mercado Pago
            </p>
          </div>
        )}
      </button>

      {/* Efectivo */}
      <button
        type="button"
        onClick={() => handleSelect('cash')}
        disabled={disabled}
        className={`w-full p-4 border-2 rounded-lg transition-all duration-200 ${
          selectedMethod === 'cash'
            ? 'border-green-600 bg-green-50'
            : 'border-gray-300 hover:border-green-400 bg-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Icono de Efectivo */}
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Banknote className="w-6 h-6 text-green-600" />
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Efectivo</h3>
              <p className="text-sm text-gray-600">Pagás al recibir</p>
            </div>
          </div>

          {selectedMethod === 'cash' && (
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Detalles adicionales */}
        {selectedMethod === 'cash' && (
          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="text-sm text-gray-600">
              💵 El repartidor llevará cambio
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Pagá en efectivo cuando recibas tu pedido
            </p>
          </div>
        )}
      </button>

      {/* Info adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>🔒 Pago seguro:</strong> Todos los métodos de pago son 100%
          seguros y verificados.
        </p>
      </div>
    </div>
  );
}
