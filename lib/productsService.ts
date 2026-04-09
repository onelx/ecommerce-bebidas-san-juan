import { supabase } from './supabase';
import type { Product, Category } from '@/types';

interface ProductFilters {
  categoryId?: string;
  search?: string;
  isAvailable?: boolean;
  isPack?: boolean;
}

interface CreateProductParams {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  stock: number;
  isAvailable?: boolean;
  isPack?: boolean;
}

interface UpdateProductParams extends Partial<CreateProductParams> {
  id: string;
}

export const productsService = {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters?.isAvailable !== undefined) {
      query = query.eq('is_available', filters.isAvailable);
    }

    if (filters?.isPack !== undefined) {
      query = query.eq('is_pack', filters.isPack);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data as Product[];
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as Product;
  },

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (categoryError) throw categoryError;

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('category_id', category.id)
      .eq('is_available', true)
      .order('name');

    if (error) throw error;

    return data as Product[];
  },

  async getRelatedProducts(productId: string, categoryId: string, limit: number = 4): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('category_id', categoryId)
      .neq('id', productId)
      .eq('is_available', true)
      .limit(limit);

    if (error) throw error;

    return data as Product[];
  },

  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data as Product[];
  },

  async getPackProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_pack', true)
      .eq('is_available', true)
      .order('price', { ascending: false });

    if (error) throw error;

    return data as Product[];
  },

  async createProduct(params: CreateProductParams): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: params.name,
        description: params.description,
        price: params.price,
        category_id: params.categoryId,
        image_url: params.imageUrl,
        stock: params.stock,
        is_available: params.isAvailable ?? true,
        is_pack: params.isPack ?? false
      })
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;

    return data as Product;
  },

  async updateProduct(params: UpdateProductParams): Promise<Product> {
    const { id, ...updates } = params;

    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
    if (updates.stock !== undefined) updateData.stock = updates.stock;
    if (updates.isAvailable !== undefined) updateData.is_available = updates.isAvailable;
    if (updates.isPack !== undefined) updateData.is_pack = updates.isPack;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;

    return data as Product;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ is_available: false })
      .eq('id', id);

    if (error) throw error;
  },

  async updateStock(productId: string, quantity: number): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({ stock: quantity })
      .eq('id', productId)
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;

    return data as Product;
  },

  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .lte('stock', threshold)
      .eq('is_available', true)
      .order('stock', { ascending: true });

    if (error) throw error;

    return data as Product[];
  },

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order');

    if (error) throw error;

    return data as Category[];
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as Category;
  }
};
