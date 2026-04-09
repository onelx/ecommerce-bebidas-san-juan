import type { Order, OrderStatus } from '@/types';

interface WhatsAppMessageParams {
  to: string;
  message: string;
}

const ORDER_STATUS_MESSAGES: Record<OrderStatus, (order: Order) => string> = {
  pending: (order) => 
    `¡Hola ${order.customer_name}! 🎉\n\nRecibimos tu pedido #${order.order_number}.\n\nEstamos procesando tu orden y te avisaremos cuando esté lista.\n\nTotal: $${order.total}\nDirección: ${order.delivery_address}`,
  
  confirmed: (order) => 
    `¡Tu pedido #${order.order_number} fue confirmado! ✅\n\nEstamos preparando tus bebidas. Te avisaremos cuando salga para entrega.\n\nGracias por elegirnos!`,
  
  preparing: (order) => 
    `Tu pedido #${order.order_number} está siendo preparado 🥤\n\nEn unos minutos saldrá para entrega.`,
  
  on_the_way: (order) => 
    `¡Tu pedido #${order.order_number} está en camino! 🚗\n\n${order.delivery_person ? `Repartidor: ${order.delivery_person.full_name}\nTeléfono: ${order.delivery_person.phone}\n\n` : ''}Llegará en aproximadamente 30 minutos a:\n${order.delivery_address}\n\nPrepará el pago en efectivo${order.payment_method === 'cash' ? ` ($${order.total})` : ''}.`,
  
  delivered: (order) => 
    `¡Pedido #${order.order_number} entregado! 🎊\n\nGracias por tu compra. Esperamos que disfrutes tus bebidas.\n\n¿Nos calificarías? Tu opinión es muy importante para nosotros.`,
  
  cancelled: (order) => 
    `Tu pedido #${order.order_number} fue cancelado.\n\nSi tenés alguna consulta, contactanos.\n\nDisculpá las molestias.`
};

export const notificationsService = {
  async sendWhatsAppNotification(params: WhatsAppMessageParams): Promise<boolean> {
    try {
      const whatsappApiUrl = process.env.WHATSAPP_API_URL;
      const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;

      if (!whatsappApiUrl || !whatsappApiToken) {
        console.warn('WhatsApp API not configured. Notification skipped.');
        return false;
      }

      const phoneNumber = params.to.replace(/\D/g, '');
      const formattedPhone = phoneNumber.startsWith('54') ? phoneNumber : `54${phoneNumber}`;

      const response = await fetch(whatsappApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${whatsappApiToken}`
        },
        body: JSON.stringify({
          to: formattedPhone,
          message: params.message
        })
      });

      if (!response.ok) {
        console.error('WhatsApp API error:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
      return false;
    }
  },

  async sendOrderStatusNotification(order: Order, newStatus: OrderStatus): Promise<boolean> {
    const messageTemplate = ORDER_STATUS_MESSAGES[newStatus];
    
    if (!messageTemplate) {
      console.warn(`No message template for status: ${newStatus}`);
      return false;
    }

    const message = messageTemplate(order);

    return await this.sendWhatsAppNotification({
      to: order.customer_phone,
      message
    });
  },

  async sendCustomNotification(phone: string, message: string): Promise<boolean> {
    return await this.sendWhatsAppNotification({
      to: phone,
      message
    });
  },

  async sendOrderConfirmation(order: Order): Promise<boolean> {
    const message = `¡Gracias por tu compra! 🎉\n\nPedido: #${order.order_number}\nTotal: $${order.total}\n\n${order.payment_method === 'mercadopago' ? '✅ Pago confirmado\n\n' : '💵 Pago en efectivo al recibir\n\n'}Te avisaremos cuando tu pedido salga para entrega.\n\nDirección: ${order.delivery_address}`;

    return await this.sendWhatsAppNotification({
      to: order.customer_phone,
      message
    });
  },

  async sendLowStockAlert(productName: string, currentStock: number, adminPhone: string): Promise<boolean> {
    const message = `⚠️ ALERTA DE STOCK BAJO\n\nProducto: ${productName}\nStock actual: ${currentStock} unidades\n\nConsiderá reabastecer pronto.`;

    return await this.sendWhatsAppNotification({
      to: adminPhone,
      message
    });
  },

  async sendNewOrderAlert(order: Order, adminPhone: string): Promise<boolean> {
    const message = `🔔 NUEVO PEDIDO\n\nPedido: #${order.order_number}\nCliente: ${order.customer_name}\nTotal: $${order.total}\nPago: ${order.payment_method === 'mercadopago' ? 'Mercado Pago' : 'Efectivo'}\n\nDirección: ${order.delivery_address}\n\n¡Confirmá el pedido en el panel de admin!`;

    return await this.sendWhatsAppNotification({
      to: adminPhone,
      message
    });
  },

  formatOrderNotification(order: Order): string {
    const items = order.order_items?.map(item => 
      `- ${item.quantity}x ${item.product.name} ($${item.unit_price})`
    ).join('\n') || '';

    return `DETALLE DEL PEDIDO #${order.order_number}\n\n${items}\n\nSubtotal: $${order.subtotal}\nEnvío: $${order.delivery_fee}\nTotal: $${order.total}\n\nDirección: ${order.delivery_address}${order.include_ice ? '\n\n❄️ Incluye hielo' : ''}${order.notes ? `\n\nNotas: ${order.notes}` : ''}`;
  }
};
