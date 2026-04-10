export type UserRole = 'customer' | 'admin' | 'delivery';

export type PaymentMethod = 'mercadopago' | 'cash';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'on_the_way' 
  | 'delivered' 
  | 'cancelled';

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  category?: Category;
  image_url: string | null;
  stock: number;
  is_available: boolean;
  is_pack: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_lat: number | null;
  delivery_lng: number | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  status: OrderStatus;
  delivery_person_id: string | null;
  delivery_person?: Profile;
  notes: string | null;
  include_ice: boolean;
  created_at: string;
  delivered_at: string | null;
  items?: OrderItem[];
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  polygon: { type: 'Polygon'; coordinates: number[][][] } | null;
  delivery_fee: number;
  is_active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  include_ice: boolean;
}

export interface CreateOrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_lat?: number;
  delivery_lng?: number;
  payment_method: PaymentMethod;
  notes?: string;
  include_ice: boolean;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[];
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  delivery_person_id?: string;
  delivered_at?: string;
}

export interface ProductFilters {
  category_id?: string;
  search?: string;
  is_available?: boolean;
  available_only?: boolean;
  is_pack?: boolean;
  min_price?: number;
  max_price?: number;
  limit?: number;
  offset?: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  date_from?: string;
  date_to?: string;
  search?: string;
  delivery_person_id?: string;
  limit?: number;
  offset?: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface DeliveryValidationResult {
  is_valid: boolean;
  zone?: DeliveryZone;
  delivery_fee?: number;
  distance_km?: number;
  message?: string;
}

export interface DashboardStats {
  today_orders: number;
  today_sales: number;
  pending_orders: number;
  low_stock_products: number;
  total_customers: number;
  top_products: Array<{
    product: Product;
    total_sold: number;
    revenue: number;
  }>;
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export interface MercadoPagoPaymentNotification {
  id: number;
  live_mode: boolean;
  type: string;
  date_created: string;
  user_id: number;
  api_version: string;
  action: string;
  data: {
    id: string;
  };
}

export interface AddressAutocompleteResult {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface AddressDetails {
  formatted_address: string;
  lat: number;
  lng: number;
  components: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
}

export interface RealtimeOrderUpdate {
  order_id: string;
  status: OrderStatus;
  payment_status?: PaymentStatus;
  delivery_person?: Profile;
  timestamp: string;
}

export interface NotificationPayload {
  to?: string;
  message: string;
  type?: 'whatsapp' | 'email' | 'sms';
  data?: Record<string, unknown>;
  customer_phone?: string;
  order_id?: string;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  category_id: string;
  image_url?: string;
  stock: number;
  is_available?: boolean;
  is_pack?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  on_the_way: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  failed: 'Fallido',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mercadopago: 'Mercado Pago',
  cash: 'Efectivo',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  on_the_way: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};
