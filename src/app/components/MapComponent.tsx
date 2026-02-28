import React, { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { crimeHotspots, getIntensityColor } from "../utils/crime-heatmap";

interface MapRef {
  lat: number;
  lng: number;
  address: string;
}

interface MapComponentProps {
  onLocationSelect?: (location: MapRef) => void;
  selectedLocation?: MapRef;
  showHeatmap?: boolean;
  interactive?: boolean;
}

export function MapComponent({
  onLocationSelect,
  selectedLocation,
  showHeatmap = true,
  interactive = true,
}: MapComponentProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.209 });
  const [selectedMarker, setSelectedMarker] = useState<MapRef | null>(selectedLocation || null);
  const [searchAddress, setSearchAddress] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const selectedMarkerRef = useRef<maplibregl.Marker | null>(null);

  const mapTilerApiKey = useMemo(() => {
    // Get the API key from Vite environment variables
    const key = (((import.meta as any).env?.VITE_MAPTILER_API_KEY as string) || "").trim();
    console.log("🔑 MapTiler API Key check:", {
      hasKey: key.length > 0,
      keyLength: key.length,
      keyStart: key.substring(0, 5),
    });
    return key;
  }, []);
  const hasMapTilerKey = useMemo(() => mapTilerApiKey.length > 0, [mapTilerApiKey]);

  const updateSelection = (location: MapRef) => {
    setSelectedMarker(location);
    setMapCenter({ lat: location.lat, lng: location.lng });
    if (onLocationSelect) {
      onLocationSelect(location);
    }

    if (mapRef.current) {
      if (!selectedMarkerRef.current) {
        selectedMarkerRef.current = new maplibregl.Marker({ color: "#ec4899" })
          .setLngLat([location.lng, location.lat])
          .addTo(mapRef.current);
      } else {
        selectedMarkerRef.current.setLngLat([location.lng, location.lat]);
      }
      mapRef.current.flyTo({ center: [location.lng, location.lat], zoom: 13 });
    }
  };

  const handleLocationSelect = (hotspot: any) => {
    const location: MapRef = {
      lat: hotspot.lat,
      lng: hotspot.lng,
      address: hotspot.location,
    };
    updateSelection(location);
  };

  const handleFallbackMapClick = (_e: React.MouseEvent) => {
    if (!interactive) return;
    // Simulate location selection
    const lat = mapCenter.lat + (Math.random() - 0.5) * 0.1;
    const lng = mapCenter.lng + (Math.random() - 0.5) * 0.1;

    const location: MapRef = {
      lat,
      lng,
      address: "Selected Location",
    };
    updateSelection(location);
  };

  useEffect(() => {
    if (!interactive || !mapContainerRef.current || mapRef.current) {
      console.log("MapLibre init skipped:", { interactive, hasMapTilerKey, hasContainer: !!mapContainerRef.current, hasMapRef: !!mapRef.current });
      return;
    }

    console.log("🗺️ Initializing MapLibre with key:", hasMapTilerKey ? mapTilerApiKey.substring(0, 10) + "..." : "(fallback style)");

    const styleUrl = hasMapTilerKey
      ? `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerApiKey}`
      : "https://demotiles.maplibre.org/style.json";
    console.log("Style URL:", styleUrl);
    let fallbackStyleApplied = false;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [mapCenter.lng, mapCenter.lat],
      zoom: 11,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }));

    map.on("load", () => {
      map.resize();
      setTimeout(() => map.resize(), 250);
      setTimeout(() => map.resize(), 500);
      console.log("✅ MapLibre loaded successfully");
      setMapReady(true);
      setMapError(null);
    });

    map.on("error", (e) => {
      console.error("❌ MapLibre error:", e);

      if (!fallbackStyleApplied && styleUrl.includes("api.maptiler.com")) {
        fallbackStyleApplied = true;
        map.setStyle("https://demotiles.maplibre.org/style.json");
        return;
      }

      setMapError("Map failed to load. Check your MapTiler key.");
    });

    map.on("click", async (event) => {
      if (!interactive) return;
      const { lng, lat } = event.lngLat;
      const address = await reverseGeocode(lat, lng, mapTilerApiKey);
      updateSelection({ lat, lng, address });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      selectedMarkerRef.current = null;
      setMapReady(false);
    };
  }, [interactive, hasMapTilerKey, mapTilerApiKey, mapCenter.lat, mapCenter.lng]);

  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;

    if (!showHeatmap) {
      if (map.getLayer("crime-hotspots-heat")) map.removeLayer("crime-hotspots-heat");
      if (map.getSource("crime-hotspots")) map.removeSource("crime-hotspots");
      return;
    }

    if (map.getSource("crime-hotspots")) return;

    map.addSource("crime-hotspots", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: crimeHotspots.map((hotspot) => ({
          type: "Feature",
          properties: {
            intensity: hotspot.intensity,
            safetyRating: hotspot.safetyRating,
            location: hotspot.location,
          },
          geometry: {
            type: "Point",
            coordinates: [hotspot.lng, hotspot.lat],
          },
        })),
      },
    });

    map.addLayer({
      id: "crime-hotspots-heat",
      type: "heatmap",
      source: "crime-hotspots",
      paint: {
        "heatmap-weight": ["interpolate", ["linear"], ["get", "intensity"], 0, 0, 100, 1],
        "heatmap-intensity": 1.5,
        "heatmap-radius": 50,
        "heatmap-opacity": 0.8,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(16,185,129,0)",
          0.2,
          "rgba(16,185,129,0.6)",
          0.4,
          "rgba(245,158,11,0.7)",
          0.7,
          "rgba(239,68,68,0.8)",
          1,
          "rgba(127,29,29,0.9)",
        ],
      },
    });

    // Heatmap is interactive via click event on the main map div (already handled above)
  }, [mapReady, showHeatmap]);

  useEffect(() => {
    if (selectedLocation) {
      updateSelection(selectedLocation);
    }
  }, [selectedLocation]);

  const handleSearch = async () => {
    if (!searchAddress.trim() || !hasMapTilerKey) return;
    setIsSearching(true);
    try {
      const result = await forwardGeocode(searchAddress, mapTilerApiKey);
      if (result) {
        updateSelection(result);
      }
    } catch (error) {
      setMapError(error instanceof Error ? error.message : "Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const useFallbackMap = !!mapError;

  return (
    <div className="w-full h-full space-y-4">
      {/* Map Header with Search */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {showHeatmap ? "Crime Safety Map" : "Location Selector"}
        </h3>
        {interactive && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search location..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <Button
              variant="outline"
              className="px-4 py-2 bg-pink-500 text-white hover:bg-pink-600"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        )}
      </div>

      {/* Main Map Container */}
      {useFallbackMap ? (
        <div
          onClick={handleFallbackMapClick}
          className="relative w-full h-96 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 overflow-hidden cursor-crosshair"
        >
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-opacity-50">
            {/* Grid pattern for map */}
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e7ff" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Crime Heatmap Visualization */}
          {showHeatmap && (
            <div className="absolute inset-0">
              {crimeHotspots.map((hotspot) => {
                const x = ((hotspot.lng - 77.0508) / (77.4538 - 77.0508)) * 100;
                const y = ((28.7041 - hotspot.lat) / (28.7041 - 28.4595)) * 100;

                return (
                  <div
                    key={hotspot.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{
                      left: `${Math.max(0, Math.min(100, x))}%`,
                      top: `${Math.max(0, Math.min(100, y))}%`,
                    }}
                    onClick={() => handleLocationSelect(hotspot)}
                  >
                    {/* Heatmap Circle */}
                    <div
                      className="absolute w-12 h-12 rounded-full opacity-40 blur-md cursor-pointer hover:opacity-60 transition-opacity"
                      style={{
                        backgroundColor: getIntensityColor(hotspot.intensity),
                        transform: "translate(-50%, -50%)",
                      }}
                    ></div>

                    {/* Marker Icon */}
                    <MapPin
                      className="relative z-10 transform -translate-x-1/2 -translate-y-1/2"
                      size={20}
                      color={getIntensityColor(hotspot.intensity)}
                      fill={getIntensityColor(hotspot.intensity)}
                    />

                    {/* Tooltip */}
                    <div className="absolute left-0 top-full mt-2 w-48 p-3 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-normal">
                      <p className="font-semibold text-sm">{hotspot.location}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Incidents (Last Month): {hotspot.incidentsLastMonth}
                      </p>
                      <p className="text-xs text-gray-600">Risk Level: {hotspot.safetyRating}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Location Marker */}
          {selectedMarker && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-full group z-20"
              style={{
                left: "50%",
                top: "50%",
              }}
            >
              <div className="w-6 h-6 bg-pink-500 rounded-full border-4 border-white shadow-lg animate-bounce"></div>
              <div className="absolute left-0 -bottom-12 bg-pink-500 text-white px-3 py-1 rounded text-xs font-semibold whitespace-nowrap">
                Selected
              </div>
            </div>
          )}

          {/* No Map API Message */}
          <div className="absolute bottom-4 left-4 text-xs text-gray-600 bg-white bg-opacity-75 px-3 py-1 rounded">
            📍 Click on hotspots or map to select
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[500px] rounded-lg border-2 border-blue-200 overflow-hidden">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
        </div>
      )}

      {/* Heatmap Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Safety Legend</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#10b981" }}></div>
            <span className="text-sm text-gray-700">Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#f59e0b" }}></div>
            <span className="text-sm text-gray-700">Caution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ef4444" }}></div>
            <span className="text-sm text-gray-700">High Risk</span>
          </div>
        </div>
      </div>

      {/* Crime Hotspots List */}
      {showHeatmap && (
        <div className="bg-white rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 p-4 border-b">Crime Hotspots</h4>
          <div className="max-h-64 overflow-y-auto">
            {crimeHotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                onClick={() => handleLocationSelect(hotspot)}
                className="w-full text-left p-4 border-b hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div>
                    {hotspot.safetyRating === "safe" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {hotspot.safetyRating === "caution" && (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    )}
                    {hotspot.safetyRating === "high-risk" && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{hotspot.location}</p>
                    <p className="text-xs text-gray-600">{hotspot.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Incidents: {hotspot.incidentsLastMonth} | Intensity: {hotspot.intensity}%
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

async function forwardGeocode(query: string, apiKey: string): Promise<MapRef | null> {
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Geocoding failed. Check your MapTiler key.");
  }
  const data = await response.json();
  const feature = data?.features?.[0];
  if (!feature) return null;
  const center = feature.center || feature.geometry?.coordinates;
  if (!center) return null;
  return {
    lng: center[0],
    lat: center[1],
    address: feature.place_name || feature.text || "Selected Location",
  };
}

async function reverseGeocode(lat: number, lng: number, apiKey: string): Promise<string> {
  const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    return "Selected Location";
  }
  const data = await response.json();
  const feature = data?.features?.[0];
  return feature?.place_name || feature?.text || "Selected Location";
}
