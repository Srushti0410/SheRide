import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Navigation, Clock, DollarSign, Locate, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { locationService } from "../services/location-service";

interface RideBookingMapProps {
  hideInputs?: boolean;
  onRouteGenerated?: (data: { distance: number; time: number; fare: number }) => void;
  onLocationSelect?: (pickup: string, drop: string) => void;
}

interface CarMarker {
  id: string;
  lat: number;
  lng: number;
  heading: number;
}

export default function RideBookingMapFixed({
  hideInputs,
  onRouteGenerated,
  onLocationSelect,
}: RideBookingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [routeData, setRouteData] = useState<{
    distance: number;
    time: number;
    fare: number;
  } | null>(null);
  const [isDrawingRoute, setIsDrawingRoute] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);
  const [nearbyCars, setNearbyCars] = useState<CarMarker[]>([]);
  const [focusedInput, setFocusedInput] = useState<"pickup" | "drop" | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapTilerKey = (
      import.meta.env.VITE_MAPTILER_API_KEY || import.meta.env.VITE_MAPTILER_KEY || ""
    ).trim();

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

    map.on("error", (e) => {
      console.error("🚨 Map Error:", e.error);
      if (!fallbackStyleApplied && styleUrl.includes("api.maptiler.com")) {
        fallbackStyleApplied = true;
        map.setStyle("https://demotiles.maplibre.org/style.json");
      }
    });

    map.on("load", () => {
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
            "line-color": "#10b981",
            "line-width": 4,
            "line-opacity": 0.8,
          },
        });
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const useCurrentLocation = async () => {
    try {
      const coords = await locationService.getCurrentLocation();
      setPickupCoords([coords.lng, coords.lat]);

      const geocodeResult = await locationService.reverseGeocode(coords.lat, coords.lng);
      setPickupLocation(geocodeResult.formatted_address);
      onLocationSelect?.(geocodeResult.formatted_address, dropLocation);

      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [coords.lng, coords.lat],
          zoom: 14,
          duration: 1500,
        });
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  useEffect(() => {
    if (!pickupCoords) return;

    const cars: CarMarker[] = Array.from({ length: 5 }, (_, index) => ({
      id: `car-${index}`,
      lat: pickupCoords[1] + (Math.random() - 0.5) * 0.02,
      lng: pickupCoords[0] + (Math.random() - 0.5) * 0.02,
      heading: Math.random() * 360,
    }));

    setNearbyCars(cars);
  }, [pickupCoords]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNearbyCars((prev) =>
        prev.map((car) => ({
          ...car,
          lat: car.lat + (Math.random() - 0.5) * 0.0005,
          lng: car.lng + (Math.random() - 0.5) * 0.0005,
          heading: car.heading + (Math.random() - 0.5) * 10,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!pickupCoords || !dropCoords || !mapRef.current || !mapLoaded) return;

    setIsDrawingRoute(true);

    locationService
      .calculateRoute(
        { lat: pickupCoords[1], lng: pickupCoords[0] },
        { lat: dropCoords[1], lng: dropCoords[0] }
      )
      .then((routeResult) => {
        const { distance, duration, fare, coordinates, traffic_level } = routeResult;

        const colorMap = {
          green: "#10b981",
          yellow: "#fbbf24",
          red: "#ef4444",
        };

        if (mapRef.current) {
          const layer = mapRef.current.getLayer("route");
          if (layer) {
            mapRef.current.setPaintProperty("route", "line-color", colorMap[traffic_level]);
          }
        }

        let currentStep = 0;
        const steps = coordinates.length - 1;
        const animationInterval = setInterval(() => {
          if (currentStep <= steps && mapRef.current) {
            const source = mapRef.current.getSource("route") as maplibregl.GeoJSONSource;
            if (source) {
              source.setData({
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: coordinates.slice(0, currentStep + 1),
                },
              });
            }
            currentStep++;
          } else {
            clearInterval(animationInterval);
            setIsDrawingRoute(false);
          }
        }, 50);

        const data = { distance, time: duration, fare };
        setRouteData(data);
        onRouteGenerated?.(data);

        if (mapRef.current) {
          const bounds = new maplibregl.LngLatBounds();
          bounds.extend(pickupCoords);
          bounds.extend(dropCoords);
          mapRef.current.fitBounds(bounds, { padding: 100, duration: 1000 });
        }
      })
      .catch((error) => {
        console.error("Route calculation error:", error);
        setIsDrawingRoute(false);
      });
  }, [pickupCoords, dropCoords, mapLoaded, onRouteGenerated]);

  const searchLocation = async (query: string, isPickup: boolean) => {
    if (!query.trim()) return;

    try {
      const geocodeResult = await locationService.geocodeAddress(query);
      const coords: [number, number] = [geocodeResult.coordinates.lng, geocodeResult.coordinates.lat];

      if (isPickup) {
        setPickupCoords(coords);
        setPickupLocation(geocodeResult.formatted_address);
        onLocationSelect?.(geocodeResult.formatted_address, dropLocation);
      } else {
        setDropCoords(coords);
        setDropLocation(geocodeResult.formatted_address);
        onLocationSelect?.(pickupLocation, geocodeResult.formatted_address);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-xl">
      <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />

      {!hideInputs && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-4 left-4 right-4 z-10"
        >
          <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-4 shadow-2xl">
            <motion.div
              className="relative mb-3"
              animate={{ scale: focusedInput === "pickup" ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-pink-500" />
                <Input
                  placeholder="Pickup location"
                  value={pickupLocation}
                  onChange={(event) => setPickupLocation(event.target.value)}
                  onFocus={() => setFocusedInput("pickup")}
                  onBlur={() => {
                    setFocusedInput(null);
                    if (pickupLocation) searchLocation(pickupLocation, true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") searchLocation(pickupLocation, true);
                  }}
                  className="pl-10 pr-12 border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={useCurrentLocation}
                >
                  <Locate className="w-4 h-4 text-pink-500" />
                </Button>
              </div>
              {focusedInput === "pickup" && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"
                />
              )}
            </motion.div>

            <motion.div
              className="relative"
              animate={{ scale: focusedInput === "drop" ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <Navigation className="absolute left-3 top-3 w-5 h-5 text-purple-500" />
                <Input
                  placeholder="Drop location"
                  value={dropLocation}
                  onChange={(event) => setDropLocation(event.target.value)}
                  onFocus={() => setFocusedInput("drop")}
                  onBlur={() => {
                    setFocusedInput(null);
                    if (dropLocation) searchLocation(dropLocation, false);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") searchLocation(dropLocation, false);
                  }}
                  className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
              {focusedInput === "drop" && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"
                />
              )}
            </motion.div>

            <AnimatePresence>
              {routeData && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200/50">
                    <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center">
                      <Navigation className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <p className="text-xs text-gray-600">Distance</p>
                      <p className="font-bold text-gray-900">{routeData.distance.toFixed(1)} km</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-green-600" />
                      <p className="text-xs text-gray-600">Time</p>
                      <p className="font-bold text-gray-900">{routeData.time} min</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-3 text-center">
                      <DollarSign className="w-5 h-5 mx-auto mb-1 text-pink-600" />
                      <p className="text-xs text-gray-600">Fare</p>
                      <p className="font-bold text-gray-900">₹{routeData.fare}</p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isDrawingRoute && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 flex items-center justify-center gap-2 text-sm text-purple-600"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Search className="w-4 h-4" />
                  </motion.div>
                  Calculating route...
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {nearbyCars.map((car) => (
        <motion.div
          key={car.id}
          className="absolute w-8 h-8 -ml-4 -mt-4 z-[5]"
          animate={{
            left: `${((car.lng - 77.5) * 10000) % 100}%`,
            top: `${((car.lat - 12.9) * 10000) % 100}%`,
            rotate: car.heading,
          }}
          transition={{ duration: 2, ease: "linear" }}
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-pink-500 rounded-full"
            />
            <div className="relative bg-white rounded-full p-1 shadow-lg">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-pink-600">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
          </div>
        </motion.div>
      ))}

      {pickupCoords && (
        <motion.div
          className="absolute w-12 h-12 -ml-6 -mt-6 z-[6] pointer-events-none"
          style={{ left: "50%", top: "50%" }}
        >
          <motion.div
            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-blue-500 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
          </div>
        </motion.div>
      )}

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <p className="text-gray-500 animate-pulse">Loading map...</p>
        </div>
      )}
    </div>
  );
}
