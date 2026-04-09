export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          role: UserRole
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          role?: UserRole
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          role?: UserRole
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          image_url: string | null
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          image_url?: string | null
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          image_url?: string | null
          order?: number
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category_id: string
          image_url: string | null
          stock: number
          is_available: boolean
          is_pack: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category_id: string
          image_url?: string | null
          stock?: number
          is_available?: boolean
          is_pack?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category_id?: string
          image_url?: string | null
          stock?: number
          is_available?: boolean
          is_pack?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
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
        }
        Insert: {
          id?: string
          order_number?: number
          customer_name: string
          customer_email: string
          customer_phone: string
          delivery_address: string
          delivery_lat?: number | null
          delivery_lng?: number | null
          subtotal: number
          delivery_fee: number
          total: number
          payment_method: PaymentMethod
          payment_status?: PaymentStatus
          mp_preference_id?: string | null
          mp_payment_id?: string | null
          status?: OrderStatus
          delivery_person_id?: string | null
          notes?: string | null
          include_ice?: boolean
          created_at?: string
          delivered_at?: string | null
        }
        Update: {
          id?: string
          order_number?: number
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          delivery_address?: string
          delivery_lat?: number | null
          delivery_lng?: number | null
          subtotal?: number
          delivery_fee?: number
          total?: number
          payment_method?: PaymentMethod
          payment_status?: PaymentStatus
          mp_preference_id?: string | null
          mp_payment_id?: string | null
          status?: OrderStatus
          delivery_person_id?: string | null
          notes?: string | null
          include_ice?: boolean
          created_at?: string
          delivered_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
        }
      }
      delivery_zones: {
        Row: {
          id: string
          name: string
          polygon: unknown
          delivery_fee: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          polygon: unknown
          delivery_fee: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          polygon?: unknown
          delivery_fee?: number
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      payment_method: PaymentMethod
      payment_status: PaymentStatus
      order_status: OrderStatus
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update']

export type DeliveryZone = Database['public']['Tables']['delivery_zones']['Row']
export type DeliveryZoneInsert = Database['public']['Tables']['delivery_zones']['Insert']
export type DeliveryZoneUpdate = Database['public']['Tables']['delivery_zones']['Update']

export interface ProductWithCategory extends Product {
  category: Category
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    product: Product
  })[]
  delivery_person?: Profile | null
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  includeIce: boolean
}

export interface DeliveryAddress {
  address: string
  lat: number
  lng: number
  zone?: DeliveryZone
}

export interface CheckoutData {
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: DeliveryAddress
  paymentMethod: PaymentMethod
  notes?: string
  includeIce: boolean
}

export interface MercadoPagoPreference {
  id: string
  init_point: string
  sandbox_init_point: string
}

export interface OrderStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedToday: number
  averageOrderValue: number
  topProducts: Array<{
    product: Product
    totalSold: number
    revenue: number
  }>
}

export interface ValidationResult {
  valid: boolean
  zone?: DeliveryZone
  deliveryFee?: number
  message?: string
}

export interface NotificationPayload {
  orderId: string
  customerPhone: string
  message: string
  status: OrderStatus
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

export interface FilterParams {
  categoryId?: string
  search?: string
  available?: boolean
  isPack?: boolean
  minPrice?: number
  maxPrice?: number
  sortBy?: 'name' | 'price' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export interface OrderFilters {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  dateFrom?: string
  dateTo?: string
  search?: string
  deliveryPersonId?: string
}
