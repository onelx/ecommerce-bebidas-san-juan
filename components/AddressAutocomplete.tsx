'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onBlur,
  error,
  placeholder = 'Ingresá tu dirección de entrega',
  disabled = false,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Google Maps API key no configurada');
      setLoadError(true);
      return;
    }

    if (typeof window.google !== 'undefined' && window.google.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      console.error('Error al cargar Google Maps API');
      setLoadError(true);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !inputRef.current || loadError) {
      return;
    }

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: 'ar' },
          types: ['address'],
          fields: ['formatted_address', 'geometry', 'name'],
        }
      );

      const listener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();

        if (!place || !place.geometry) {
          onChange(inputRef.current?.value || '');
          return;
        }

        const address = place.formatted_address || place.name || '';
        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();

        onChange(address, lat, lng);
      });

      return () => {
        if (listener) {
          window.google.maps.event.removeListener(listener);
        }
      };
    } catch (err) {
      console.error('Error inicializando autocomplete:', err);
      setLoadError(true);
    }
  }, [isScriptLoaded, onChange, loadError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  if (loadError) {
    return (
      <div>
        <label htmlFor="address-fallback" className="block text-sm font-medium text-gray-700 mb-2">
          Dirección de entrega
        </label>
        <input
          id="address-fallback"
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <p className="mt-2 text-xs text-gray-500">
          Autocompletado no disponible. Ingresá la dirección manualmente.
        </p>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="address-autocomplete" className="block text-sm font-medium text-gray-700 mb-2">
        Dirección de entrega
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="address-autocomplete"
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled || !isScriptLoaded}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled || !isScriptLoaded ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {!isScriptLoaded && !loadError && (
        <p className="mt-2 text-xs text-gray-500">Cargando autocompletado...</p>
      )}
      <p className="mt-2 text-xs text-gray-500">
        Buscá tu dirección en San Juan, Argentina
      </p>
    </div>
  );
}
