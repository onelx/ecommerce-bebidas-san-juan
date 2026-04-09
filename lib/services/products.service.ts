import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { Product, ProductFilters, ApiResponse } from '@/types';

export class ProductsService {
  static async getProducts(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.available_only) {
        query = query.eq('is_available', true).gt('stock', 0);
      }

      if (filters?.is_pack !== undefined) {
        query = query.eq('is_pack', filters.is_pack);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return { error: 'Error al obtener productos' };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Exception in getProducts:', error);
      return { error: 'Error inesperado al obtener productos' };
    }
  }

  static async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return { error: 'Producto no encontrado' };
      }

      return { data };
    } catch (error) {
      console.error('Exception in getProductById:', error);
      return { error: 'Error inesperado al obtener producto' };
    }
  }

  static async createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        return { error: 'Error al crear producto' };
      }

      return { data, message: 'Producto creado exitosamente' };
    } catch (error) {
      console.error('Exception in createProduct:', error);
      return { error: 'Error inesperado al crear producto' };
    }
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        return { error: 'Error al actualizar producto' };
      }

      return { data, message: 'Producto actualizado exitosamente' };
    } catch (error) {
      console.error('Exception in updateProduct:', error);
      return { error: 'Error inesperado al actualizar producto' };
    }
  }

  static async deleteProduct(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabaseAdmin
        .from('products')
        .update({ is_available: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        return { error: 'Error al eliminar producto' };
      }

      return { data: null, message: 'Producto eliminado exitosamente' };
    } catch (error) {
      console.error('Exception in deleteProduct:', error);
      return { error: 'Error inesperado al eliminar producto' };
    }
  }

  static async updateStock(id: string, quantity: number): Promise<ApiResponse<Product>> {
    try {
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', id)
        .single();

      if (fetchError || !product) {
        return { error: 'Producto no encontrado' };
      }

      const newStock = product.stock + quantity;

      const { data, error } = await supabaseAdmin
        .from('products')
        .update({ 
          stock: newStock,
          is_available: newStock > 0 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating stock:', error);
        return { error: 'Error al actualizar stock' };
      }

      return { data };
    } catch (error) {
      console.error('Exception in updateStock:', error);
      return { error: 'Error inesperado al actualizar stock' };
    }
  }

  static async getLowStockProducts(threshold: number = 10): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lte('stock', threshold)
        .eq('is_available', true)
        .order('stock', { ascending: true });

      if (error) {
        console.error('Error fetching low stock products:', error);
        return { error: 'Error al obtener productos con stock bajo' };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Exception in getLowStockProducts:', error);
      return { error: 'Error inesperado' };
    }
  }
}
