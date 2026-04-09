'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: { address: string; lat: number; lng: number }) => void;
  error?: string;
  disabled?: boolean;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  error,
  disabled = false
}: AddressAutocompleteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      const mapDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(mapDiv);
    }
  }, []);

  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  const fetchSuggestions = async (input: string) => {
    if (!autocompleteService.current) return;

    setIsLoading(true);

    try {
      const request: google.maps.places.AutocompletionRequest = {
        input,
        componentRestrictions: { country: 'ar' },
        location: new window.google.maps.LatLng(-31.5375, -68.5364),
        radius: 50000,
        types: ['address']
      };

      autocompleteService.current.getPlacePredictions(
        request,
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = async (placeId: string) => {
    if (!placesService.current) return;

    setIsLoading(true);
    setShowSuggestions(false);

    try {
      placesService.current.getDetails(
        {
          placeId,
          fields: ['formatted_address', 'geometry']
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const address = place.formatted_address || '';
            const lat = place.geometry?.location?.lat() || 0;
            const lng = place.geometry?.location?.lng() || 0;

            onChange(address);
            onPlaceSelect({ address, lat, lng });
          }
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error getting place details:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Dirección de entrega
      </label>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          disabled={disabled}
          placeholder="Ej: San Martín 123, San Juan"
          className={`
            w-full pl-11 pr-4 py-3 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-purple-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSelectSuggestion(suggestion.place_id)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {suggestion.structured_formatting.main_text}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {suggestion.structured_formatting.secondary_text}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}

      <p className="mt-2 text-xs text-gray-500">
        Ingresá tu dirección en San Juan para verificar la zona de cobertura
      </p>
    </div>
  );
}
