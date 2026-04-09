import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DeliveryZoneValidation {
  isValid: boolean;
  zoneName: string | null;
  deliveryFee: number;
  message: string;
}

export function useDeliveryZone() {
  const [isValidating, setIsValidating] = useState(false);

  const validateAddress = async (
    lat: number,
    lng: number
  ): Promise<DeliveryZoneValidation> => {
    setIsValidating(true);

    try {
      const { data, error } = await supabase.rpc('validate_delivery_zone', {
        p_lat: lat,
        p_lng: lng
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const zone = data[0];
        return {
          isValid: true,
          zoneName: zone.name,
          deliveryFee: parseFloat(zone.delivery_fee),
          message: `Hacemos envíos a ${zone.name}. Costo de envío: $${zone.delivery_fee}`
        };
      }

      return {
        isValid: false,
        zoneName: null,
        deliveryFee: 0,
        message: 'Lo sentimos, aún no llegamos a esa zona. Por favor, ingresá una dirección dentro de San Juan Capital.'
      };
    } catch (error) {
      console.error('Error validating delivery zone:', error);
      return {
        isValid: false,
        zoneName: null,
        deliveryFee: 0,
        message: 'Error al validar la zona de entrega. Por favor, intentá nuevamente.'
      };
    } finally {
      setIsValidating(false);
    }
  };

  const getDeliveryFee = async (lat: number, lng: number): Promise<number> => {
    try {
      const { data, error } = await supabase.rpc('validate_delivery_zone', {
        p_lat: lat,
        p_lng: lng
      });

      if (error) throw error;

      if (data && data.length > 0) {
        return parseFloat(data[0].delivery_fee);
      }

      return 0;
    } catch (error) {
      console.error('Error getting delivery fee:', error);
      return 0;
    }
  };

  return {
    validateAddress,
    getDeliveryFee,
    isValidating
  };
}
