'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  error,
  placeholder = 'Ingresá tu dirección de entrega',
  required = false,
}: AddressAutocompleteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    // Inicializar servicios de Google Maps
    if (typeof window !== 'undefined' && window.google) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      
      // Crear un div temporal para el PlacesService
      const div = document.createElement('div');
      placesService.current = new google.maps.places.PlacesService(div);
      
      sessionToken.current = new google.maps.places.AutocompleteSessionToken();
    }
  }, []);

  const fetchSuggestions = async (input: string) => {
    if (!input || input.length < 3 || !autocompleteService.current) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const request: google.maps.places.AutocompletionRequest = {
        input,
        sessionToken: sessionToken.current || undefined,
        componentRestrictions: { country: 'ar' },
        types: ['address'],
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(-31.6, -68.6),
          new google.maps.LatLng(-31.5, -68.5)
        ),
      };

      autocompleteService.current.getPlacePredictions(
        request,
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
    setSelectedIndex(-1);
    fetchSuggestions(newValue);
  };

  const selectSuggestion = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesService.current) return;

    setIsLoading(true);

    placesService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['geometry', 'formatted_address'],
        sessionToken: sessionToken.current || undefined,
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();
          
          onChange(
            place.formatted_address || prediction.description,
            lat,
            lng
          );
          
          // Renovar session token después de seleccionar
          sessionToken.current = new google.maps.places.AutocompleteSessionToken();
        }
        
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = () => {
    // Delay para permitir clicks en sugerencias
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Dirección de entrega {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 3 && setShowSuggestions(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-purple-500'
          }`}
          autoComplete="off"
        />
      </div>

      {/* Sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => selectSuggestion(suggestion)}
              className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-purple-50' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {suggestion.structured_formatting.main_text}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {suggestion.structured_formatting.secondary_text}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-gray-500 mt-1">
        Ingresá tu dirección completa en San Juan para verificar cobertura
      </p>
    </div>
  );
}
