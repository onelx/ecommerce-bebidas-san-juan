'use client';

import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils/formatPrice';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { PaymentSelector } from '@/components/PaymentSelector';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totals, clearCart, isLoaded } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [customerData, setCustomerData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
  });

  const [deliveryData, setDeliveryData] = useState({
    address: '',
    lat: 0,
    lng: 0,
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'cash'>('mercadopago');

  useEffect(() => {
    if (isLoaded && items.length === 0) {
      router.push('/carrito');
    }
  }, [isLoaded, items.length, router]);

  if (!isLoaded || items.length === 0) {
    return null;
  }

  const handleAddressSelect = (address: string, lat?: number, lng?: number) => {
    setDeliveryData({ ...deliveryData, address, lat: lat ?? 0, lng: lng ?? 0 });
  };

  const handleSubmitOrder = async () => {
    if (!customerData.name || !customerData.email || !customerData.phone) {
      alert('Por favor completá todos tus datos');
      return;
    }

    if (!deliveryData.address) {
      alert('Por favor ingresá tu dirección de entrega');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        delivery_address: deliveryData.address,
        delivery_lat: deliveryData.lat,
        delivery_lng: deliveryData.lng,
        notes: deliveryData.notes,
        payment_method: paymentMethod,
        items: items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el pedido');
      }

      const { order, preference_url } = await response.json();

      if (paymentMethod === 'mercadopago' && preference_url) {
        window.location.href = preference_url;
      } else {
        clearCart();
        router.push(`/tracking/${order.id}?email=${customerData.email}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al procesar el pedido. Intentá nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Finalizar Pedido</h1>
          <p className="text-indigo-100">
            Paso {step} de 3 - {step === 1 ? 'Datos personales' : step === 2 ? 'Dirección de entrega' : 'Confirmación'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                    s <= step ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Tus Datos</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          value={customerData.name}
                          onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Juan Pérez"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={customerData.email}
                          onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="juan@ejemplo.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          value={customerData.phone}
                          onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="264 123 4567"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      disabled={!customerData.name || !customerData.email || !customerData.phone}
                      className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Continuar
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Dirección de Entrega</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección completa *
                        </label>
                        <AddressAutocomplete
                          value={deliveryData.address}
                          onChange={handleAddressSelect}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notas adicionales (opcional)
                        </label>
                        <textarea
                          value={deliveryData.notes}
                          onChange={(e) => setDeliveryData({ ...deliveryData, notes: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          rows={3}
                          placeholder="Depto, timbre, referencias..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Volver
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={!deliveryData.address}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Confirmación</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Datos de contacto</h3>
                        <p className="text-gray-600">{customerData.name}</p>
                        <p className="text-gray-600">{customerData.email}</p>
                        <p className="text-gray-600">{customerData.phone}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Dirección de entrega</h3>
                        <p className="text-gray-600">{deliveryData.address}</p>
                        {deliveryData.notes && (
                          <p className="text-gray-500 text-sm mt-1">{deliveryData.notes}</p>
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Método de pago</h3>
                        <PaymentSelector
                          selectedMethod={paymentMethod}
                          onSelect={setPaymentMethod}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Volver
                      </button>
                      <button
                        onClick={handleSubmitOrder}
                        disabled={isProcessing}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                          </>
                        ) : (
                          'Confirmar Pedido'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-xl font-bold mb-4">Resumen</h3>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">{formatPrice(totals.subtotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
