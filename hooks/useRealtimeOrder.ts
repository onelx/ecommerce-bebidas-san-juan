import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';

export function useRealtimeOrder(orderId: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
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

        if (error) throw error;

        setOrder(data as Order);
        setError(null);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el pedido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();

    const channel = supabase
      .channel(`order:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        async (payload) => {
          if (payload.eventType === 'UPDATE') {
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

            if (!error && data) {
              setOrder(data as Order);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return { order, isLoading, error };
}
