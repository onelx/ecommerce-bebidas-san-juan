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
  category?: Category
  image_url: string
  stock: number
  is_available: boolean
  is_pack: boolean
  created_at: string
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

export interface Order {
  id: string
  order_number: number
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  delivery_lat: number
  delivery_lng: number
  subtotal: number
  delivery_fee: number
  total: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  mp_preference_id?: string
  mp_payment_id?: string
  status: OrderStatus
  delivery_person_id?: string
  delivery_person?: Profile
  notes?: string
  include_ice: boolean
  created_at: string
  delivered_at?: string
  order_items?: OrderItem[]
}

export interface DeliveryZone {
  id: string
  name: string
  polygon: any
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
  itemCount: number
}

export interface CheckoutData {
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  delivery_lat: number
  delivery_lng: number
  payment_method: PaymentMethod
  notes?: string
  include_ice: boolean
}

export interface MercadoPagoPreference {
  id: string
  init_point: string
  sandbox_init_point: string
}

export interface DeliveryValidation {
  is_valid: boolean
  zone?: DeliveryZone
  delivery_fee: number
  message?: string
}

export interface AdminStats {
  today_orders: number
  today_revenue: number
  pending_orders: number
  low_stock_products: number
  top_products: Array<{
    product_id: string
    product_name: string
    total_quantity: number
    total_revenue: number
  }>
}

export interface FilterOptions {
  category?: string
  search?: string
  available_only?: boolean
  is_pack?: boolean
  min_price?: number
  max_price?: number
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface OrderFilters {
  status?: OrderStatus
  payment_status?: PaymentStatus
  date_from?: string
  date_to?: string
  search?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface RealtimeOrderUpdate {
  order_id: string
  status: OrderStatus
  delivery_person_id?: string
  delivered_at?: string
}

export interface WhatsAppNotification {
  to: string
  message: string
  order_number: number
}

export interface AddressAutocompleteResult {
  description: string
  place_id: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export interface AddressDetails {
  formatted_address: string
  lat: number
  lng: number
  place_id: string
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  category_id: string
  image_url: string
  stock: number
  is_available: boolean
  is_pack: boolean
}

export interface OrderStatusUpdate {
  status: OrderStatus
  delivery_person_id?: string
}

export interface MercadoPagoWebhookData {
  id: number
  live_mode: boolean
  type: string
  date_created: string
  application_id: number
  user_id: number
  version: number
  api_version: string
  action: string
  data: {
    id: string
  }
}

export interface MercadoPagoPaymentInfo {
  id: number
  status: string
  status_detail: string
  external_reference: string
  preference_id: string
  payment_method_id: string
  payment_type_id: string
  transaction_amount: number
  date_approved: string | null
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  on_the_way: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  failed: 'Fallido'
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mercadopago: 'Mercado Pago',
  cash: 'Efectivo'
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'badge-warning',
  confirmed: 'badge-info',
  preparing: 'badge-info',
  on_the_way: 'badge-info',
  delivered: 'badge-success',
  cancelled: 'badge-error'
}

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: 'badge-warning',
  paid: 'badge-success',
  failed: 'badge-error'
}
