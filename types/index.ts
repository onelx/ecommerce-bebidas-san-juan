export type UserRole = 'customer' | 'admin' | 'delivery'

export type PaymentMethod = 'mercadopago' | 'cash'

export type PaymentStatus = 'pending' | 'paid' | 'failed'

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'on_the_way' 
  | 'delivered' 
  | 'cancelled'

export interface Profile {
  id: string
  full_name: string
  phone: string
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string
  order: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  image_url: string
  stock: number
  is_available: boolean
  is_pack: boolean
  created_at: string
  category?: Category
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number
  product?: Product
}

export interface Order {
  id: string
  order_number: number
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  delivery_lat: number | null
  delivery_lng: number | null
  subtotal: number
  delivery_fee: number
  total: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  mp_preference_id: string | null
  mp_payment_id: string | null
  status: OrderStatus
  delivery_person_id: string | null
  notes: string | null
  include_ice: boolean
  created_at: string
  delivered_at: string | null
  order_items?: OrderItem[]
  delivery_person?: Profile
}

export interface DeliveryZone {
  id: string
  name: string
  polygon: string
  delivery_fee: number
  is_active: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  delivery_fee: number
  total: number
  include_ice: boolean
}

export interface DeliveryValidationResult {
  is_valid: boolean
  zone?: DeliveryZone
  delivery_fee: number
  message?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface CreateOrderData {
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  delivery_lat: number | null
  delivery_lng: number | null
  items: {
    product_id: string
    quantity: number
    unit_price: number
  }[]
  payment_method: PaymentMethod
  notes?: string
  include_ice: boolean
  subtotal: number
  delivery_fee: number
  total: number
}

export interface MercadoPagoPreference {
  id: string
  init_point: string
  sandbox_init_point: string
}

export interface AdminStats {
  today_orders: number
  today_revenue: number
  pending_orders: number
  low_stock_products: number
  top_products: Array<{
    product: Product
    total_sold: number
    revenue: number
  }>
}

export interface ProductFilter {
  category_id?: string
  search?: string
  is_available?: boolean
  is_pack?: boolean
  min_price?: number
  max_price?: number
}

export interface OrderFilter {
  status?: OrderStatus
  payment_status?: PaymentStatus
  from_date?: string
  to_date?: string
  customer_email?: string
  order_number?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface WebhookMercadoPagoData {
  action: string
  api_version: string
  data: {
    id: string
  }
  date_created: string
  id: number
  live_mode: boolean
  type: string
  user_id: string
}

export interface GoogleMapsPlace {
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  place_id: string
  name?: string
}

export interface WhatsAppMessage {
  to: string
  body: string
  template?: string
  variables?: Record<string, string>
}

export interface OrderStatusUpdate {
  order_id: string
  status: OrderStatus
  delivery_person_id?: string
  notes?: string
}

export interface StockUpdate {
  product_id: string
  quantity_change: number
  reason?: string
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  on_the_way: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  failed: 'Fallido',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mercadopago: 'Mercado Pago',
  cash: 'Efectivo',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  customer: 'Cliente',
  admin: 'Administrador',
  delivery: 'Repartidor',
}
