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
  phone: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  category?: Category;
  image_url: string;
  stock: number;
  is_available: boolean;
  is_pack: boolean;
  created_at: string;
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

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_lat: number;
  delivery_lng: number;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  mp_preference_id?: string;
  mp_payment_id?: string;
  status: OrderStatus;
  delivery_person_id?: string;
  delivery_person?: Profile;
  notes?: string;
  include_ice: boolean;
  items?: OrderItem[];
  created_at: string;
  delivered_at?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  polygon: GeoJSON.Geometry;
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

export interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_lat: number;
  delivery_lng: number;
  payment_method: PaymentMethod;
  notes?: string;
  include_ice: boolean;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  available_only?: boolean;
  is_pack?: boolean;
  min_price?: number;
  max_price?: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  delivery_person_id?: string;
  search?: string;
}

export interface AdminStats {
  today_orders: number;
  today_revenue: number;
  pending_orders: number;
  low_stock_products: number;
  top_products: Array<{
    product: Product;
    total_quantity: number;
    total_revenue: number;
  }>;
}

export interface DeliveryValidation {
  is_valid: boolean;
  zone?: DeliveryZone;
  delivery_fee: number;
  message?: string;
}

export interface MercadoPagoPreference {
  preference_id: string;
  init_point: string;
  sandbox_init_point?: string;
}

export interface WhatsAppNotification {
  to: string;
  message: string;
  order_id: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SupabaseRealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: T;
  schema: string;
  table: string;
}
