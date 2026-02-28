import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Navigation, Search } from "lucide-react";
import { Input } from "./ui/input";

interface RideBookingMapProps {
  hideInputs?: boolean;
  onRouteGenerated?: (data: { distance: number; time: number; fare: number }) => void;
  onLocationSelect?: (pickup: string, drop: string) => void;
}

export function RideBookingMap({ hideInputs, onRouteGenerated, onLocationSelect }: RideBookingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [pickupInput, setPickupInput] = useState("");
  const [dropInput, setDropInput] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<any[]>([]);
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);
  const pickupMarkerRef = useRef<maplibregl.Marker | null>(null);
  const dropMarkerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapTilerKey = (
      import.meta.env.VITE_MAPTILER_API_KEY || import.meta.env.VITE_MAPTILER_KEY || ""
    ).trim();

    if (!mapTilerKey) {
      console.error("❌ MapTiler key missing. Check .env file in root.");
    }

    const styleUrl = mapTilerKey
      ? `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerKey}`
      : "https://demotiles.maplibre.org/style.json";

    let fallbackStyleApplied = false;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [77.5946, 12.9716],
      zoom: 13,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      console.log("🗺️ Map loaded successfully");
      setMapLoaded(true);
      map.resize();
      setTimeout(() => map.resize(), 250);

      if (!map.getSource("route")) {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [],
            },
          },
        });
      }

      if (!map.getLayer("route")) {
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#ec4899",
            "line-width": 4,
            "line-opacity": 0.9,
          },
        });
      }
    });

    map.on("error", (e) => {
      console.error("🚨 Map Error:", e.error);
      if (!fallbackStyleApplied && styleUrl.includes("api.maptiler.com")) {
        fallbackStyleApplied = true;
        map.setStyle("https://demotiles.maplibre.org/style.json");
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Geocoding search for pickup location
  const searchPickupLocation = async (query: string) => {
    if (query.length < 3) {
      setPickupSuggestions([]);
      return;
    }

    const mapTilerKey = (import.meta.env.VITE_MAPTILER_API_KEY || "").trim();
    if (!mapTilerKey) return;

    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${mapTilerKey}&country=IN&limit=5`
      );
      const data = await response.json();
      setPickupSuggestions(data.features || []);
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  // Geocoding search for drop location
  const searchDropLocation = async (query: string) => {
    if (query.length < 3) {
      setDropSuggestions([]);
      return;
    }

    const mapTilerKey = (import.meta.env.VITE_MAPTILER_API_KEY || "").trim();
    if (!mapTilerKey) return;

    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${mapTilerKey}&country=IN&limit=5`
      );
      const data = await response.json();
      setDropSuggestions(data.features || []);
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  // Handle pickup location selection
  const handlePickupSelect = (feature: any) => {
    const coords = feature.geometry.coordinates as [number, number];
    setPickupInput(feature.place_name);
    setPickupCoords(coords);
    setPickupSuggestions([]);

    if (mapRef.current) {
      // Remove old marker if exists
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.remove();
      }
      
      // Add new pickup marker
      const el = document.createElement('div');
      el.className = 'w-8 h-8 bg-pink-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center';
      el.innerHTML = '<div class="w-3 h-3 bg-white rounded-full"></div>';
      
      pickupMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat(coords)
        .addTo(mapRef.current);

      mapRef.current.flyTo({ center: coords, zoom: 14 });
    }

    if (onLocationSelect && dropInput) {
      onLocationSelect(feature.place_name, dropInput);
    }
  };

  // Handle drop location selection
  const handleDropSelect = (feature: any) => {
    const coords = feature.geometry.coordinates as [number, number];
    setDropInput(feature.place_name);
    setDropCoords(coords);
    setDropSuggestions([]);

    if (mapRef.current) {
      // Remove old marker if exists
      if (dropMarkerRef.current) {
        dropMarkerRef.current.remove();
      }
      
      // Add new drop marker
      const el = document.createElement('div');
      el.className = 'w-8 h-8 bg-purple-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center';
      el.innerHTML = '<div class="w-3 h-3 bg-white rounded-full"></div>';
      
      dropMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat(coords)
        .addTo(mapRef.current);

      mapRef.current.flyTo({ center: coords, zoom: 14 });
    }

    if (onLocationSelect && pickupInput) {
      onLocationSelect(pickupInput, feature.place_name);
    }
  };

  // Generate route when both coordinates are available
  useEffect(() => {
    if (!pickupCoords || !dropCoords || !mapRef.current) return;

    const map = mapRef.current;

    // Simple straight line route (for demo - real apps would use routing API)
    const route = {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: [pickupCoords, dropCoords],
      },
    };

    const source = map.getSource("route") as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(route);
    }

    // Calculate distance and time
    const distance = calculateDistance(pickupCoords, dropCoords);
    const time = Math.ceil(distance / 30 * 60); // Assuming 30 km/h average
    const baseFare = 50;
    const fare = Math.ceil(baseFare + distance * 12);

    if (onRouteGenerated) {
      onRouteGenerated({ distance, time, fare });
    }

    // Fit map to show both markers
    const bounds = new maplibregl.LngLatBounds();
    bounds.extend(pickupCoords);
    bounds.extend(dropCoords);
    map.fitBounds(bounds, { padding: 100 });
  }, [pickupCoords, dropCoords, onRouteGenerated]);

  // Calculate distance using Haversine formula
  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((coord2[1] - coord1[1]) * Math.PI) / 180;
    const dLon = ((coord2[0] - coord1[0]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1[1] * Math.PI) / 180) *
        Math.cos((coord2[1] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div
      className={`relative w-full h-[600px] rounded-2xl overflow-hidden shadow-xl ${hideInputs ? "" : ""
        }`}
    >
      <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <p className="text-gray-500 animate-pulse">Loading map...</p>
        </div>
      )}

      {/* Location Input UI */}
      {!hideInputs && (
        <div className="absolute top-4 left-4 right-4 z-10 space-y-3">
          {/* Pickup Location Input */}
          <div className="relative bg-white rounded-xl shadow-lg">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0" />
              <Input
                type="text"
                placeholder="Enter pickup location..."
                value={pickupInput}
                onChange={(e) => {
                  setPickupInput(e.target.value);
                  searchPickupLocation(e.target.value);
                }}
                className="border-0 focus-visible:ring-0 px-0 text-base"
              />
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
            
            {/* Pickup Suggestions Dropdown */}
            {pickupSuggestions.length > 0 && (
              <div className="max-h-60 overflow-y-auto border-t border-gray-100">
                {pickupSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePickupSelect(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-pink-50 transition-colors flex items-start gap-3"
                  >
                    <MapPin className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {suggestion.text}
                      </p>
                      <p className="text-xs text-gray-500">
                        {suggestion.place_name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Drop Location Input */}
          <div className="relative bg-white rounded-xl shadow-lg">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <Navigation className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <Input
                type="text"
                placeholder="Enter drop location..."
                value={dropInput}
                onChange={(e) => {
                  setDropInput(e.target.value);
                  searchDropLocation(e.target.value);
                }}
                className="border-0 focus-visible:ring-0 px-0 text-base"
              />
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
            
            {/* Drop Suggestions Dropdown */}
            {dropSuggestions.length > 0 && (
              <div className="max-h-60 overflow-y-auto border-t border-gray-100">
                {dropSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDropSelect(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors flex items-start gap-3"
                  >
                    <Navigation className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {suggestion.text}
                      </p>
                      <p className="text-xs text-gray-500">
                        {suggestion.place_name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RideBookingMap;
