import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { Order, OrderFilters, CreateOrderPayload, OrderStatus, ApiResponse } from '@/types';

export class OrdersService {
  static async createOrder(payload: CreateOrderPayload): Promise<ApiResponse<Order>> {
    try {
      const subtotal = payload.items.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
      );

      const deliveryFee = payload.delivery_lat && payload.delivery_lng 
        ? await this.calculateDeliveryFee(payload.delivery_lat, payload.delivery_lng)
        : parseFloat(process.env.NEXT_PUBLIC_BASE_DELIVERY_FEE || '500');

      const total = subtotal + deliveryFee;

      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert([
          {
            customer_name: payload.customer_name,
            customer_email: payload.customer_email,
            customer_phone: payload.customer_phone,
            delivery_address: payload.delivery_address,
            delivery_lat: payload.delivery_lat,
            delivery_lng: payload.delivery_lng,
            subtotal,
            delivery_fee: deliveryFee,
            total,
            payment_method: payload.payment_method,
            payment_status: 'pending',
            status: 'pending',
            notes: payload.notes,
            include_ice: payload.include_ice,
          },
        ])
        .select()
        .single();

      if (orderError || !order) {
        console.error('Error creating order:', orderError);
        return { error: 'Error al crear el pedido' };
      }

      const orderItems = payload.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.unit_price * item.quantity,
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        await supabaseAdmin.from('orders').delete().eq('id', order.id);
        return { error: 'Error al procesar los items del pedido' };
      }

      for (const item of payload.items) {
        await supabaseAdmin.rpc('decrement_product_stock', {
          product_id: item.product_id,
          quantity: item.quantity,
        });
      }

      return { data: order, message: 'Pedido creado exitosamente' };
    } catch (error) {
      console.error('Exception in createOrder:', error);
      return { error: 'Error inesperado al crear el pedido' };
    }
  }

  static async getOrderById(id: string): Promise<ApiResponse<Order>> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          ),
          delivery_person:profiles(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return { error: 'Pedido no encontrado' };
      }

      return { data };
    } catch (error) {
      console.error('Exception in getOrderById:', error);
      return { error: 'Error inesperado al obtener el pedido' };
    }
  }

  static async getOrders(filters?: OrderFilters): Promise<ApiResponse<Order[]>> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          ),
          delivery_person:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.payment_status) {
        query = query.eq('payment_status', filters.payment_status);
      }

      if (filters?.delivery_person_id) {
        query = query.eq('delivery_person_id', filters.delivery_person_id);
      }

      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from);
      }

      if (filters?.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
        return { error: 'Error al obtener pedidos' };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Exception in getOrders:', error);
      return { error: 'Error inesperado al obtener pedidos' };
    }
  }

  static async updateOrderStatus(
    id: string,
    status: OrderStatus,
    deliveryPersonId?: string
  ): Promise<ApiResponse<Order>> {
    try {
      const updates: any = { status };

      if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      }

      if (deliveryPersonId) {
        updates.delivery_person_id = deliveryPersonId;
      }

      const { data, error } = await supabaseAdmin
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating order status:', error);
        return { error: 'Error al actualizar el estado del pedido' };
      }

      return { data, message: 'Estado actualizado exitosamente' };
    } catch (error) {
      console.error('Exception in updateOrderStatus:', error);
      return { error: 'Error inesperado al actualizar el estado' };
    }
  }

  static async assignDeliveryPerson(
    orderId: string,
    deliveryPersonId: string
  ): Promise<ApiResponse<Order>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .update({ 
          delivery_person_id: deliveryPersonId,
          status: 'confirmed'
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error assigning delivery person:', error);
        return { error: 'Error al asignar repartidor' };
      }

      return { data, message: 'Repartidor asignado exitosamente' };
    } catch (error) {
      console.error('Exception in assignDeliveryPerson:', error);
      return { error: 'Error inesperado al asignar repartidor' };
    }
  }

  private static async calculateDeliveryFee(lat: number, lng: number): Promise<number> {
    const baseFee = parseFloat(process.env.NEXT_PUBLIC_BASE_DELIVERY_FEE || '500');
    return baseFee;
  }

  static async getTodayOrders(): Promise<ApiResponse<Order[]>> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching today orders:', error);
        return { error: 'Error al obtener pedidos del día' };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Exception in getTodayOrders:', error);
      return { error: 'Error inesperado' };
    }
  }

  static async cancelOrder(id: string, reason?: string): Promise<ApiResponse<Order>> {
    try {
      const { data: order } = await this.getOrderById(id);

      if (!order) {
        return { error: 'Pedido no encontrado' };
      }

      if (order.status !== 'pending' && order.status !== 'confirmed') {
        return { error: 'Solo se pueden cancelar pedidos pendientes o confirmados' };
      }

      const { data, error } = await supabaseAdmin
        .from('orders')
        .update({ 
          status: 'cancelled',
          notes: reason ? `${order.notes || ''}\nCancelado: ${reason}` : order.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error cancelling order:', error);
        return { error: 'Error al cancelar el pedido' };
      }

      if (order.order_items) {
        for (const item of order.order_items) {
          await supabaseAdmin.rpc('increment_product_stock', {
            product_id: item.product_id,
            quantity: item.quantity,
          });
        }
      }

      return { data, message: 'Pedido cancelado exitosamente' };
    } catch (error) {
      console.error('Exception in cancelOrder:', error);
      return { error: 'Error inesperado al cancelar el pedido' };
    }
  }
}
