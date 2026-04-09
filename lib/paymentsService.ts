import { supabase } from './supabase';

interface CreatePreferenceParams {
  orderId: string;
  orderNumber: number;
  items: Array<{
    title: string;
    quantity: number;
    unit_price: number;
  }>;
  total: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
}

interface PreferenceResponse {
  preferenceId: string;
  initPoint: string;
}

interface PaymentVerification {
  isValid: boolean;
  paymentStatus: 'approved' | 'pending' | 'rejected' | 'cancelled';
  paymentId?: string;
  merchantOrderId?: string;
}

export const paymentsService = {
  async createPreference(params: CreatePreferenceParams): Promise<PreferenceResponse> {
    try {
      const response = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: params.orderId,
          orderNumber: params.orderNumber,
          items: params.items,
          total: params.total,
          payer: {
            email: params.customerEmail,
            name: params.customerName,
            phone: {
              number: params.customerPhone
            }
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la preferencia de pago');
      }

      const data = await response.json();

      await supabase
        .from('orders')
        .update({ mp_preference_id: data.preferenceId })
        .eq('id', params.orderId);

      return {
        preferenceId: data.preferenceId,
        initPoint: data.initPoint
      };
    } catch (error) {
      console.error('Error creating payment preference:', error);
      throw error;
    }
  },

  async verifyPayment(paymentId: string): Promise<PaymentVerification> {
    try {
      const mpAccessToken = process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN;
      
      if (!mpAccessToken) {
        throw new Error('Mercado Pago access token not configured');
      }

      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${mpAccessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al verificar el pago');
      }

      const payment = await response.json();

      return {
        isValid: payment.status === 'approved',
        paymentStatus: payment.status,
        paymentId: payment.id,
        merchantOrderId: payment.order?.id
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        isValid: false,
        paymentStatus: 'rejected'
      };
    }
  },

  async getPaymentByPreferenceId(preferenceId: string): Promise<any> {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('mp_payment_id, payment_status')
        .eq('mp_preference_id', preferenceId)
        .single();

      if (error) throw error;

      if (order.mp_payment_id) {
        return await this.verifyPayment(order.mp_payment_id);
      }

      return null;
    } catch (error) {
      console.error('Error getting payment by preference:', error);
      return null;
    }
  },

  async handlePaymentNotification(data: any): Promise<void> {
    try {
      if (data.type === 'payment') {
        const paymentId = data.data.id;
        const verification = await this.verifyPayment(paymentId);

        if (verification.merchantOrderId) {
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('id')
            .eq('mp_preference_id', verification.merchantOrderId)
            .single();

          if (!orderError && order) {
            await supabase
              .from('orders')
              .update({
                mp_payment_id: paymentId,
                payment_status: verification.paymentStatus === 'approved' ? 'paid' : 
                              verification.paymentStatus === 'pending' ? 'pending' : 'failed',
                status: verification.paymentStatus === 'approved' ? 'confirmed' : 'pending'
              })
              .eq('id', order.id);
          }
        }
      }
    } catch (error) {
      console.error('Error handling payment notification:', error);
      throw error;
    }
  },

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount);
  }
};
