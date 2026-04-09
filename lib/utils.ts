import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDeliveryFee(
  distance?: number,
  isNightTime?: boolean
): number {
  const baseFee = parseFloat(process.env.NEXT_PUBLIC_BASE_DELIVERY_FEE || '500');
  
  if (!distance) return baseFee;
  
  let fee = baseFee;
  
  if (distance > 5) {
    fee += (distance - 5) * 100;
  }
  
  if (isNightTime) {
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour < 6) {
      fee *= 1.5;
    }
  }
  
  return Math.round(fee);
}

export function formatOrderNumber(orderNumber: number): string {
  return `#${String(orderNumber).padStart(6, '0')}`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    on_the_way: 'En camino',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
}

export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
  };
  return labels[status] || status;
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    mercadopago: 'Mercado Pago',
    cash: 'Efectivo',
  };
  return labels[method] || method;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
  return phoneRegex.test(phone);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function calculateCartTotal(items: { quantity: number; unit_price: number }[]): number {
  return items.reduce((total, item) => total + item.quantity * item.unit_price, 0);
}

export function isWithinDeliveryHours(): boolean {
  const currentHour = new Date().getHours();
  return true;
}

export function estimateDeliveryTime(distance?: number): string {
  if (!distance) return '30-45 min';
  
  const baseTime = 30;
  const additionalTime = Math.floor(distance / 2) * 5;
  const totalTime = baseTime + additionalTime;
  
  return `${totalTime}-${totalTime + 15} min`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function generateOrderNotificationMessage(
  orderNumber: number,
  status: string,
  customerName: string
): string {
  const messages: Record<string, string> = {
    confirmed: `Hola ${customerName}! Tu pedido ${formatOrderNumber(orderNumber)} fue confirmado. Lo estamos preparando.`,
    preparing: `${customerName}, tu pedido ${formatOrderNumber(orderNumber)} se está preparando. Pronto estará en camino!`,
    on_the_way: `${customerName}, tu pedido ${formatOrderNumber(orderNumber)} está en camino! Llegamos en breve.`,
    delivered: `Gracias por tu compra ${customerName}! Tu pedido ${formatOrderNumber(orderNumber)} fue entregado. Esperamos que lo disfrutes!`,
    cancelled: `${customerName}, lamentamos informarte que tu pedido ${formatOrderNumber(orderNumber)} fue cancelado. Contactanos para más info.`,
  };
  
  return messages[status] || `Actualización de tu pedido ${formatOrderNumber(orderNumber)}`;
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: { lat: number; lng: number }[]
): boolean {
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;
    
    const intersect =
      yi > point.lng !== yj > point.lng &&
      point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}
