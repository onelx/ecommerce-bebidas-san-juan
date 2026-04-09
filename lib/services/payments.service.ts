import type { MercadoPagoPreference, ApiResponse, Order } from '@/types';

export class PaymentsService {
  static async createPreference(order: Order): Promise<ApiResponse<MercadoPagoPreference>> {
    try {
      const response = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: order.id,
          items: order.order_items?.map((item) => ({
            title: item.product?.name || 'Producto',
            quantity: item.quantity,
            unit_price: item.unit_price,
          })) || [],
          payer: {
            name: order.customer_name,
            email: order.customer_email || '',
            phone: {
              number: order.customer_phone,
            },
          },
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${order.id}`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure?order_id=${order.id}`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending?order_id=${order.id}`,
          },
          notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error creating preference:', error);
        return { error: 'Error al crear la preferencia de pago' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Exception in createPreference:', error);
      return { error: 'Error inesperado al crear la preferencia de pago' };
    }
  }

  static async getPaymentStatus(paymentId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/payments/status?payment_id=${paymentId}`);

      if (!response.ok) {
        return { error: 'Error al obtener el estado del pago' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Exception in getPaymentStatus:', error);
      return { error: 'Error inesperado al obtener el estado del pago' };
    }
  }
}
