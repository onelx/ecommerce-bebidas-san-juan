'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  placeholder = 'Ingresá tu dirección de entrega',
  className = '',
  error,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    const initAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        setScriptError(true);
        setIsLoading(false);
        return;
      }

      if (!inputRef.current) return;

      try {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['address'],
            componentRestrictions: { country: 'ar' },
            fields: ['address_components', 'geometry', 'formatted_address', 'name'],
          }
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          if (!place.geometry || !place.geometry.location) {
            console.warn('No se pudo obtener la ubicación del lugar');
            return;
          }

          const addressComponents = place.address_components || [];
          const city = addressComponents.find((comp) =>
            comp.types.includes('locality')
          )?.long_name;

          if (city && city.toLowerCase().includes('san juan')) {
            const formattedAddress = place.formatted_address || place.name || '';
            onChange(formattedAddress);

            if (onPlaceSelected) {
              onPlaceSelected(place);
            }
          } else {
            alert('Por favor, seleccioná una dirección dentro de San Juan Capital');
            onChange('');
          }
        });

        autocompleteRef.current = autocomplete;
        setIsLoading(false);
      } catch (err) {
        console.error('Error al inicializar Google Places:', err);
        setScriptError(true);
        setIsLoading(false);
      }
    };

    if (window.google && window.google.maps && window.google.maps.places) {
      initAutocomplete();
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(checkGoogleMaps);
          initAutocomplete();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkGoogleMaps);
        if (!autocompleteRef.current) {
          setScriptError(true);
          setIsLoading(false);
        }
      }, 5000);
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange, onPlaceSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  if (scriptError) {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-3 py-3 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        <p className="mt-1 text-xs text-orange-600">
          Google Maps no está disponible. Ingresá tu dirección manualmente.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {isLoading ? (
          <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
        ) : (
          <MapPin className="h-5 w-5 text-gray-400" />
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={isLoading}
        className={`block w-full pl-10 pr-3 py-3 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!error && (
        <p className="mt-1 text-xs text-gray-500">
          Comenzá a escribir tu dirección en San Juan Capital
        </p>
      )}
    </div>
  );
}
