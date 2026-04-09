'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onValidZone?: (isValid: boolean) => void;
}

interface PlacePrediction {
  description: string;
  place_id: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = 'Ingresá tu dirección de entrega',
  error,
  disabled = false,
  onValidZone
}: AddressAutocompleteProps) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidZone, setIsValidZone] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      const div = document.createElement('div');
      placesService.current = new google.maps.places.PlacesService(div);
    }
  }, []);

  const validateZone = async (lat: number, lng: number) => {
    setIsValidating(true);
    try {
      const response = await fetch('/api/delivery/validate-zone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng })
      });
      
      const data = await response.json();
      setIsValidZone(data.isValid);
      if (onValidZone) {
        onValidZone(data.isValid);
      }
    } catch (error) {
      console.error('Error validating zone:', error);
      setIsValidZone(false);
      if (onValidZone) {
        onValidZone(false);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setIsValidZone(null);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (inputValue.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setIsLoading(true);

    debounceTimer.current = setTimeout(() => {
      if (autocompleteService.current) {
        autocompleteService.current.getPlacePredictions(
          {
            input: inputValue,
            componentRestrictions: { country: 'ar' },
            types: ['address'],
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(-31.6, -68.6),
              new google.maps.LatLng(-31.5, -68.4)
            )
          },
          (results, status) => {
            setIsLoading(false);
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              setPredictions(results);
              setShowPredictions(true);
            } else {
              setPredictions([]);
              setShowPredictions(false);
            }
          }
        );
      }
    }, 300);
  };

  const handleSelectPrediction = (prediction: PlacePrediction) => {
    if (placesService.current) {
      placesService.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['geometry', 'formatted_address']
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const lat = place.geometry?.location?.lat();
            const lng = place.geometry?.location?.lng();
            const address = place.formatted_address || prediction.description;
            
            onChange(address, lat, lng);
            setPredictions([]);
            setShowPredictions(false);

            if (lat && lng) {
              validateZone(lat, lng);
            }
          }
        }
      );
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <MapPin className="w-5 h-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => predictions.length > 0 && setShowPredictions(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${isValidZone === true ? 'border-green-500' : ''}
            ${isValidZone === false ? 'border-red-500' : ''}
          `}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading && (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          )}
          {isValidating && (
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          )}
          {isValidZone === true && !isValidating && (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          )}
        </div>
      </div>

      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              onClick={() => handleSelectPrediction(prediction)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-0"
            >
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{prediction.description}</span>
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      {isValidZone === true && (
        <p className="mt-1.5 text-sm text-green-600 flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4" />
          Dirección válida - Hacemos envíos a esta zona
        </p>
      )}

      {isValidZone === false && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span> 
          Lo sentimos, aún no llegamos a esta zona. Solo enviamos dentro de San Juan Capital.
        </p>
      )}
    </div>
  );
}
