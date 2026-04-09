import { supabase } from './supabase';
import type { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus } from '@/types';

interface CreateOrderParams {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  includeIce: boolean;
  mpPreferenceId?: string;
}

interface UpdateOrderStatusParams {
  orderId: string;
  status: OrderStatus;
  deliveryPersonId?: string;
}

interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  deliveryPersonId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export const ordersService = {
  async createOrder(params: CreateOrderParams): Promise<Order> {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: params.customerName,
        customer_email: params.customerEmail,
        customer_phone: params.customerPhone,
        delivery_address: params.deliveryAddress,
        delivery_lat: params.deliveryLat,
        delivery_lng: params.deliveryLng,
        subtotal: params.subtotal,
        delivery_fee: params.deliveryFee,
        total: params.total,
        payment_method: params.paymentMethod,
        payment_status: params.paymentMethod === 'mercadopago' ? 'pending' : 'pending',
        status: 'pending',
        notes: params.notes || null,
        include_ice: params.includeIce,
        mp_preference_id: params.mpPreferenceId || null
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = params.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.unitPrice * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    for (const item of params.items) {
      const { error: stockError } = await supabase.rpc('decrease_product_stock', {
        p_product_id: item.productId,
        p_quantity: item.quantity
      });

      if (stockError) {
        console.error('Error updating stock:', stockError);
      }
    }

    const { data: fullOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', order.id)
      .single();

    if (fetchError) throw fetchError;

    return fullOrder as Order;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        ),
        delivery_person:profiles!delivery_person_id (
          id,
          full_name,
          phone
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as Order;
  },

  async getOrderByNumber(orderNumber: number): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        ),
        delivery_person:profiles!delivery_person_id (
          id,
          full_name,
          phone
        )
      `)
      .eq('order_number', orderNumber)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as Order;
  },

  async getOrders(filters?: OrderFilters, page: number = 1, pageSize: number = 20): Promise<{ orders: Order[]; count: number }> {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        ),
        delivery_person:profiles!delivery_person_id (
          id,
          full_name,
          phone
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.paymentStatus) {
      query = query.eq('payment_status', filters.paymentStatus);
    }

    if (filters?.deliveryPersonId) {
      query = query.eq('delivery_person_id', filters.deliveryPersonId);
    }

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    if (filters?.search) {
      query = query.or(`customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%,order_number.eq.${filters.search}`);
    }

    const start = (page - 1) * pageSize;
    query = query.range(start, start + pageSize - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      orders: data as Order[],
      count: count || 0
    };
  },

  async updateOrderStatus(params: UpdateOrderStatusParams): Promise<Order> {
    const updateData: any = {
      status: params.status
    };

    if (params.deliveryPersonId) {
      updateData.delivery_person_id = params.deliveryPersonId;
    }

    if (params.status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', params.orderId)
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        ),
        delivery_person:profiles!delivery_person_id (
          id,
          full_name,
          phone
        )
      `)
      .single();

    if (error) throw error;

    return data as Order;
  },

  async assignDeliveryPerson(orderId: string, deliveryPersonId: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({
        delivery_person_id: deliveryPersonId,
        status: 'confirmed'
      })
      .eq('id', orderId)
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        ),
        delivery_person:profiles!delivery_person_id (
          id,
          full_name,
          phone
        )
      `)
      .single();

    if (error) throw error;

    return data as Order;
  },

  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, mpPaymentId?: string): Promise<Order> {
    const updateData: any = {
      payment_status: paymentStatus
    };

    if (mpPaymentId) {
      updateData.mp_payment_id = mpPaymentId;
    }

    if (paymentStatus === 'paid') {
      updateData.status = 'confirmed';
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .single();

    if (error) throw error;

    return data as Order;
  },

  async cancelOrder(orderId: string): Promise<Order> {
    const order = await this.getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      throw new Error('Solo se pueden cancelar pedidos pendientes o confirmados');
    }

    for (const item of order.order_items || []) {
      await supabase.rpc('increase_product_stock', {
        p_product_id: item.product_id,
        p_quantity: item.quantity
      });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId)
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .single();

    if (error) throw error;

    return data as Order;
  },

  async getTodayStats(): Promise<{
    totalOrders: number;
    totalSales: number;
    pendingOrders: number;
    completedOrders: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const { data, error } = await supabase
      .from('orders')
      .select('status, total')
      .gte('created_at', todayStr);

    if (error) throw error;

    const stats = {
      totalOrders: data.length,
      totalSales: data.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0),
      pendingOrders: data.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
      completedOrders: data.filter(o => o.status === 'delivered').length
    };

    return stats;
  }
};
