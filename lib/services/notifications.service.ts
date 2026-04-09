import type { NotificationPayload, ApiResponse } from '@/types';
import { generateOrderNotificationMessage } from '@/lib/utils';

export class NotificationsService {
  static async sendWhatsAppNotification(payload: NotificationPayload): Promise<ApiResponse<null>> {
    try {
      const phone = payload.customer_phone.replace(/\D/g, '');
      
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(payload.message)}`;
      
      console.log('WhatsApp notification would be sent to:', phone);
      console.log('Message:', payload.message);
      console.log('URL:', whatsappUrl);

      return { 
        data: null, 
        message: 'Notificación preparada (integración WhatsApp pendiente)' 
      };
    } catch (error) {
      console.error('Exception in sendWhatsAppNotification:', error);
      return { error: 'Error al enviar notificación' };
    }
  }

  static async notifyOrderStatusChange(
    orderId: string,
    orderNumber: number,
    customerName: string,
    customerPhone: string,
    newStatus: string
  ): Promise<ApiResponse<null>> {
    try {
      const message = generateOrderNotificationMessage(orderNumber, newStatus, customerName);

      return await this.sendWhatsAppNotification({
        order_id: orderId,
        customer_phone: customerPhone,
        message,
      });
    } catch (error) {
      console.error('Exception in notifyOrderStatusChange:', error);
      return { error: 'Error al notificar cambio de estado' };
    }
  }

  static async notifyNewOrder(
    orderId: string,
    orderNumber: number,
    customerName: string,
    customerPhone: string
  ): Promise<ApiResponse<null>> {
    try {
      const adminPhone = process.env.NEXT_PUBLIC_DELIVERY_PHONE || '';
      
      const message = `Nuevo pedido #${String(orderNumber).padStart(6, '0')} de ${customerName}. Teléfono: ${customerPhone}`;

      console.log('New order notification to admin:', adminPhone);
      console.log('Message:', message);

      const customerMessage = `Hola ${customerName}! Recibimos tu pedido #${String(orderNumber).padStart(6, '0')}. Te avisaremos cuando esté confirmado.`;

      await this.sendWhatsAppNotification({
        order_id: orderId,
        customer_phone: customerPhone,
        message: customerMessage,
      });

      return { data: null, message: 'Notificaciones enviadas' };
    } catch (error) {
      console.error('Exception in notifyNewOrder:', error);
      return { error: 'Error al notificar nuevo pedido' };
    }
  }
}
