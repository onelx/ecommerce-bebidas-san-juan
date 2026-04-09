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
  full_name: string | null
  phone: string | null
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  order: number
  created_at?: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string | null
  category?: Category
  image_url: string | null
  stock: number
  is_available: boolean
  is_pack: boolean
  created_at: string
  updated_at: string
}

export interface DeliveryZone {
  id: string
  name: string
  polygon: any // GeoJSON polygon
  delivery_fee: number
  is_active: boolean
  created_at: string
}

export interface Order {
  id: string
  order_number: number
  customer_name: string
  customer_email: string | null
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
  delivery_person?: Profile
  notes: string | null
  include_ice: boolean
  created_at: string
  delivered_at: string | null
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  unit_price: number
  subtotal: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  itemCount: number
}

export interface CheckoutData {
  customer_name: string
  customer_email?: string
  customer_phone: string
  delivery_address: string
  delivery_lat?: number
  delivery_lng?: number
  payment_method: PaymentMethod
  notes?: string
  include_ice: boolean
}

export interface AdminStats {
  today_orders: number
  today_revenue: number
  pending_orders: number
  low_stock_products: number
  top_products: Array<{
    product: Product
    total_quantity: number
    total_revenue: number
  }>
}

export interface DeliveryValidation {
  is_valid: boolean
  zone?: DeliveryZone
  delivery_fee: number
  message?: string
}

export interface MPPreferenceResponse {
  preference_id: string
  init_point: string
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface ProductFilters {
  category?: string
  search?: string
  available?: boolean
  is_pack?: boolean
  min_price?: number
  max_price?: number
}

export interface OrderFilters {
  status?: OrderStatus
  payment_status?: PaymentStatus
  date_from?: string
  date_to?: string
  customer_phone?: string
}

export interface CreateProductInput {
  name: string
  description?: string
  price: number
  category_id?: string
  image_url?: string
  stock: number
  is_available?: boolean
  is_pack?: boolean
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string
}

export interface CreateOrderInput {
  items: Array<{
    product_id: string
    quantity: number
    unit_price: number
  }>
  customer_name: string
  customer_email?: string
  customer_phone: string
  delivery_address: string
  delivery_lat?: number
  delivery_lng?: number
  delivery_fee: number
  payment_method: PaymentMethod
  notes?: string
  include_ice: boolean
}

export interface UpdateOrderStatusInput {
  order_id: string
  status: OrderStatus
  delivery_person_id?: string
}

export interface WhatsAppNotification {
  to: string
  message: string
  order_number?: number
}

export interface RealtimeOrderUpdate {
  id: string
  status: OrderStatus
  delivery_person_id?: string
  delivered_at?: string
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

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  preparing: 'badge-preparing',
  on_the_way: 'badge-on-the-way',
  delivered: 'badge-delivered',
  cancelled: 'badge-cancelled',
}
