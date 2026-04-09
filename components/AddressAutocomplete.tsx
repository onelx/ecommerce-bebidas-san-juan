"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, X } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  onValidate?: (isValid: boolean, inZone: boolean) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

interface GooglePlace {
  description: string;
  place_id: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onValidate,
  placeholder = "Ingresá tu dirección de entrega",
  error,
  disabled = false,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<GooglePlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Simulated Google Places API autocomplete
  const fetchSuggestions = async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    // Simulación de API de Google Places
    // En producción, usar: const autocompleteService = new google.maps.places.AutocompleteService();
    setTimeout(() => {
      const mockSuggestions: GooglePlace[] = [
        {
          description: `${input}, San Juan, Argentina`,
          place_id: `place_${input}_1`,
        },
        {
          description: `${input}, Capital, San Juan, Argentina`,
          place_id: `place_${input}_2`,
        },
        {
          description: `${input}, Rawson, San Juan, Argentina`,
          place_id: `place_${input}_3`,
        },
      ];
      setSuggestions(mockSuggestions);
      setIsLoading(false);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
    setValidationMessage("");

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const validateAddress = async (address: string, lat: number, lng: number) => {
    setIsValidating(true);
    setValidationMessage("");

    try {
      // Llamada al endpoint de validación de zona
      const response = await fetch("/api/delivery/validate-zone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, lng, address }),
      });

      const data = await response.json();

      if (data.inZone) {
        setValidationMessage("✓ Dirección válida - Envío disponible");
        onValidate?.(true, true);
      } else {
        setValidationMessage(
          "✗ Lo sentimos, no llegamos a esta zona todavía"
        );
        onValidate?.(true, false);
      }
    } catch (err) {
      console.error("Error validating address:", err);
      setValidationMessage("Error al validar la dirección");
      onValidate?.(false, false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSelectSuggestion = (suggestion: GooglePlace) => {
    // Simulación de Geocoding API
    // En producción: const geocoder = new google.maps.Geocoder();
    const mockLat = -31.5375 + Math.random() * 0.1;
    const mockLng = -68.5364 + Math.random() * 0.1;

    onChange(suggestion.description, mockLat, mockLng);
    setSuggestions([]);
    setShowSuggestions(false);

    // Validar la dirección seleccionada
    validateAddress(suggestion.description, mockLat, mockLng);
  };

  const handleClear = () => {
    onChange("");
    setSuggestions([]);
    setValidationMessage("");
    inputRef.current?.focus();
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <MapPin className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 3 && setShowSuggestions(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
            error
              ? "border-red-500"
              : validationMessage.includes("✓")
              ? "border-green-500"
              : validationMessage.includes("✗")
              ? "border-orange-500"
              : "border-gray-300"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />

        {isValidating ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          </div>
        ) : value && !disabled ? (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              Buscando direcciones...
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-900">{suggestion.description}</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Validation Message */}
      {validationMessage && (
        <p
          className={`mt-2 text-sm flex items-center gap-1 ${
            validationMessage.includes("✓")
              ? "text-green-600"
              : validationMessage.includes("✗")
              ? "text-orange-600"
              : "text-red-600"
          }`}
        >
          {validationMessage}
        </p>
      )}

      {/* Error Message */}
      {error && !validationMessage && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Helper Text */}
      {!error && !validationMessage && !isValidating && (
        <p className="mt-2 text-xs text-gray-500">
          Comenzá a escribir tu dirección en San Juan
        </p>
      )}
    </div>
  );
}
