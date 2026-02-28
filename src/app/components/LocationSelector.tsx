import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Navigation, Search, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { locationService } from "../services/location-service";

interface LocationSelectorProps {
  title: string;
  value?: { address: string; lat: number; lng: number } | null;
  onChange: (location: { address: string; lat: number; lng: number }) => void;
  placeholder?: string;
  description?: string;
}

export function LocationSelector({
  title,
  value,
  onChange,
  placeholder = "Enter address or use map",
  description,
}: LocationSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<"search" | "map" | "live">("search");
  const [searchInput, setSearchInput] = useState(value?.address || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!showMap || !mapContainerRef.current || mapRef.current) return;

    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY || "";
    const styleUrl = apiKey
      ? `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`
      : "https://demotiles.maplibre.org/style.json";

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [value?.lng || 77.209, value?.lat || 28.6139],
      zoom: 12,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }));

    map.on("load", () => {
      map.resize();
      setTimeout(() => map.resize(), 250);

      // Add marker if location already selected
      if (value) {
        const marker = new maplibregl.Marker({ color: "#ec4899" })
          .setLngLat([value.lng, value.lat])
          .addTo(map);
        markerRef.current = marker;
      }
    });

    map.on("click", async (event) => {
      const { lng, lat } = event.lngLat;

      // Remove old marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new marker
      const marker = new maplibregl.Marker({ color: "#ec4899" })
        .setLngLat([lng, lat])
        .addTo(map);
      markerRef.current = marker;

      // Get address from coordinates
      setLoading(true);
      try {
        const result = await locationService.reverseGeocode(lat, lng);
        onChange({ address: result.formatted_address, lat, lng });
        setError(null);
      } catch (err) {
        setError("Failed to get address for this location");
      } finally {
        setLoading(false);
      }
    });

    map.on("error", (e) => {
      console.error("Map error:", e);
      if (!apiKey) {
        map.setStyle("https://demotiles.maplibre.org/style.json");
      }
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [showMap, value]);

  // Search for location
  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError("Please enter an address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await locationService.geocodeAddress(searchInput);
      if (result) {
        onChange({
          address: result.formatted_address,
          lat: result.coordinates.lat,
          lng: result.coordinates.lng,
        });
        setSearchInput(result.formatted_address);
      } else {
        setError("Location not found");
      }
    } catch (err) {
      setError("Failed to search location");
    } finally {
      setLoading(false);
    }
  };

  // Get current location
  const handleLiveLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const location = await locationService.getCurrentLocation();
      const result = await locationService.reverseGeocode(location.lat, location.lng);

      onChange({
        address: result.formatted_address,
        lat: location.lat,
        lng: location.lng,
      });

      setSearchInput(result.formatted_address);
    } catch (err) {
      setError("Unable to access your current location");
    } finally {
      setLoading(false);
    }
  };

  // Handle map selection toggle
  const handleMapToggle = () => {
    setShowMap(!showMap);
    if (!showMap) {
      setSelectedMethod("map");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Title */}
      <div>
        <h3 className="text-lg font-semibold text-white">{title} *</h3>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>

      {/* Method Selector */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedMethod("search");
            setShowMap(false);
          }}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${selectedMethod === "search"
              ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          <Search className="w-4 h-4" />
          Search
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMapToggle}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${selectedMethod === "map"
              ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          <MapPin className="w-4 h-4" />
          Map
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedMethod("live");
            setShowMap(false);
            handleLiveLocation();
          }}
          disabled={loading}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${selectedMethod === "live" && !loading
              ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            } disabled:opacity-50`}
        >
          {loading && selectedMethod === "live" ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          Live Location
        </motion.button>
      </div>

      {/* Search Method */}
      <AnimatePresence>
        {selectedMethod === "search" && !showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={placeholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !searchInput.trim()}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Method */}
      <AnimatePresence>
        {selectedMethod === "map" && showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div
              ref={mapContainerRef}
              className="w-full h-64 rounded-lg border-2 border-gray-600 overflow-hidden"
            />
            <p className="text-xs text-gray-400">
              Click on the map to select a location, or scroll to zoom
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-900 bg-opacity-30 border border-red-600 rounded-lg p-3 flex gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {value?.address && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-900 bg-opacity-30 border border-green-600 rounded-lg p-3 flex gap-2"
          >
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-300">Location Selected</p>
              <p className="text-xs text-green-200">{value.address}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
