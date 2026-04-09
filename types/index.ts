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
  full_name: string | null;
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
  customer_email: string | null;
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
  order_items?: OrderItem[];
}

export interface DeliveryZone {
  id: string;
  name: string;
  polygon: string;
  delivery_fee: number;
  is_active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_email?: string;
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

export interface ProductFilters {
  category_id?: string;
  search?: string;
  available_only?: boolean;
  is_pack?: boolean;
}

export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  delivery_person_id?: string;
}

export interface AdminStats {
  today_orders: number;
  today_sales: number;
  pending_orders: number;
  low_stock_products: number;
  top_products: {
    product: Product;
    total_sold: number;
    revenue: number;
  }[];
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export interface DeliveryValidation {
  is_valid: boolean;
  zone?: DeliveryZone;
  delivery_fee: number;
  message?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface RealtimeOrderUpdate {
  order_id: string;
  status: OrderStatus;
  delivery_person_id?: string;
  delivered_at?: string;
}

export interface GoogleMapsPlace {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface NotificationPayload {
  order_id: string;
  customer_phone: string;
  message: string;
}
