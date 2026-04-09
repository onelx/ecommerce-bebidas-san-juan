"use client";

import { useState } from "react";
import Image from "next/image";
import { CreditCard, Banknote, Check } from "lucide-react";
import type { PaymentMethod } from "@/types";

interface PaymentSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
  total: number;
}

export default function PaymentSelector({
  selected,
  onChange,
  disabled = false,
  total,
}: PaymentSelectorProps) {
  const [cashAmount, setCashAmount] = useState<string>("");

  const paymentMethods = [
    {
      id: "mercadopago" as PaymentMethod,
      name: "Mercado Pago",
      description: "Tarjetas de crédito, débito y otros medios",
      icon: CreditCard,
      badge: "Recomendado",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "cash" as PaymentMethod,
      name: "Efectivo",
      description: "Pagá al recibir tu pedido",
      icon: Banknote,
      badge: null,
      badgeColor: "",
    },
  ];

  const handleCashAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCashAmount(value);
  };

  const getCashChange = () => {
    if (!cashAmount || selected !== "cash") return 0;
    const amount = parseInt(cashAmount, 10);
    return amount > total ? amount - total : 0;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Método de Pago</h3>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selected === method.id;

          return (
            <button
              key={method.id}
              onClick={() => !disabled && onChange(method.id)}
              disabled={disabled}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {method.name}
                    </span>
                    {method.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${method.badgeColor}`}
                      >
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>

                {/* Check Icon */}
                {isSelected && (
                  <div className="flex-shrink-0">
                    <Check className="w-6 h-6 text-purple-600" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Cash Payment Details */}
      {selected === "cash" && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-2">
            <Banknote className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                Detalles del Pago en Efectivo
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                El repartidor llevará cambio. Indicá con cuánto vas a pagar
                (opcional).
              </p>

              <div className="space-y-2">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">
                    Voy a pagar con:
                  </span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                      $
                    </span>
                    <input
                      type="text"
                      value={cashAmount}
                      onChange={handleCashAmountChange}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </label>

                {cashAmount && parseInt(cashAmount, 10) >= total && (
                  <div className="bg-white rounded-lg p-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total a pagar:</span>
                      <span className="font-semibold text-gray-900">
                        ${total.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pagás con:</span>
                      <span className="font-semibold text-gray-900">
                        ${parseInt(cashAmount, 10).toLocaleString("es-AR")}
                      </span>
                    </div>
                    {getCashChange() > 0 && (
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="text-gray-900 font-medium">
                          Tu vuelto:
                        </span>
                        <span className="font-bold text-green-600">
                          ${getCashChange().toLocaleString("es-AR")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {cashAmount && parseInt(cashAmount, 10) < total && (
                  <p className="text-sm text-red-600">
                    El monto debe ser mayor o igual al total del pedido
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mercado Pago Details */}
      {selected === "mercadopago" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <div className="relative w-12 h-8 flex-shrink-0">
              <Image
                src="/mercadopago-logo.svg"
                alt="Mercado Pago"
                fill
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                Pago Seguro con Mercado Pago
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tarjetas de crédito y débito</li>
                <li>• Mercado Pago y Mercado Crédito</li>
                <li>• Hasta 12 cuotas sin interés</li>
                <li>• Protección al comprador</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
