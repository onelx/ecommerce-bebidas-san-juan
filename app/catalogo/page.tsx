import { Suspense } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { productsService } from '@/lib/productsService';
import { CatalogFilters } from './CatalogFilters';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: {
    categoria?: string;
    busqueda?: string;
    precio_min?: string;
    precio_max?: string;
  };
}

async function getProducts(searchParams: PageProps['searchParams']) {
  try {
    const filters: any = { available: true };
    
    if (searchParams.categoria) {
      filters.categorySlug = searchParams.categoria;
    }
    
    if (searchParams.busqueda) {
      filters.search = searchParams.busqueda;
    }
    
    if (searchParams.precio_min) {
      filters.minPrice = parseFloat(searchParams.precio_min);
    }
    
    if (searchParams.precio_max) {
      filters.maxPrice = parseFloat(searchParams.precio_max);
    }

    const products = await productsService.getProducts(filters);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    return await productsService.getCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Catálogo de Productos</h1>
          <p className="text-indigo-100">
            Encontrá tus bebidas favoritas y recibilas en minutos
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <Suspense fallback={<div>Cargando filtros...</div>}>
                <CatalogFilters categories={categories} searchParams={searchParams} />
              </Suspense>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg
                  className="w-24 h-24 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  No encontramos productos
                </h3>
                <p className="text-gray-500 mb-6">
                  Intentá con otros filtros o categorías
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-gray-600">
                    {products.length} {products.length === 1 ? 'producto' : 'productos'} encontrados
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
