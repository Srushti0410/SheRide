import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface RideBookingMapProps {
  hideInputs?: boolean;
  onRouteGenerated?: (data: { distance: number; time: number; fare: number }) => void;
  onLocationSelect?: (pickup: string, drop: string) => void;
}

export function RideBookingMap({ hideInputs }: RideBookingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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
    </div>
  );
}

export default RideBookingMap;
