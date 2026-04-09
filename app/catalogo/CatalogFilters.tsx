'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CatalogFiltersProps {
  categories: Category[];
  searchParams: Record<string, string | undefined>;
}

export function CatalogFilters({ categories, searchParams }: CatalogFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [search, setSearch] = useState(searchParams.busqueda || '');
  const [minPrice, setMinPrice] = useState(searchParams.precio_min || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.precio_max || '');

  const updateFilters = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(params.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    startTransition(() => {
      router.push(`/catalogo?${newParams.toString()}`);
    });
  };

  const handleCategoryChange = (slug: string) => {
    const currentCategory = params.get('categoria');
    updateFilters({ categoria: currentCategory === slug ? '' : slug });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ busqueda: search });
  };

  const handlePriceFilter = () => {
    updateFilters({
      precio_min: minPrice,
      precio_max: maxPrice,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    startTransition(() => {
      router.push('/catalogo');
    });
  };

  const hasActiveFilters = params.toString().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-3 text-gray-800">Buscar</h3>
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-gray-800">Categorías</h3>
        <div className="space-y-2">
          {categories.map((category) => {
            const isActive = params.get('categoria') === category.slug;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-gray-800">Rango de Precio</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Mínimo</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="$0"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Máximo</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="$999999"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handlePriceFilter}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full border-2 border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Limpiar Filtros
        </button>
      )}

      {isPending && (
        <div className="text-center text-sm text-gray-500">
          Actualizando...
        </div>
      )}
    </div>
  );
}
