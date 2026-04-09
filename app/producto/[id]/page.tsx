import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { productsService } from '@/lib/productsService';
import { ProductCard } from '@/components/ProductCard';
import { AddToCartButton } from './AddToCartButton';
import { formatPrice } from '@/lib/utils/formatPrice';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string) {
  try {
    return await productsService.getProductById(id);
  } catch (error) {
    return null;
  }
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  try {
    const products = await productsService.getProducts({
      categoryId,
      available: true,
      limit: 4,
    });
    return products.filter(p => p.id !== currentProductId);
  } catch (error) {
    return [];
  }
}

export default async function ProductoPage({ params }: PageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category_id, product.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-indigo-600">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-indigo-600">Catálogo</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                  <svg className="w-32 h-32 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
              {product.is_pack && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-semibold text-sm">
                  Pack
                </div>
              )}
              {!product.is_available && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg">
                    No Disponible
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-5xl font-bold text-indigo-600">
                    {formatPrice(product.price)}
                  </span>
                </div>

                {product.description && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Detalles</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Delivery en 30-45 minutos</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Producto de calidad premium</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Stock: {product.stock > 10 ? 'Disponible' : `Solo ${product.stock} unidades`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              {product.is_available && (
                <AddToCartButton product={product} />
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
