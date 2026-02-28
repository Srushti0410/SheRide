// Crime heatmap data for SheRide safety features
export interface CrimeHotspot {
  id: string;
  lat: number;
  lng: number;
  intensity: number; // 0-100, higher = more crime incidents
  location: string;
  incidentsLastMonth: number;
  safetyRating: "safe" | "caution" | "high-risk";
  description: string;
}

// Mock crime data for demonstration (in production, this would come from a backend)
export const crimeHotspots: CrimeHotspot[] = [
  {
    id: "hotspot-1",
    lat: 28.6139,
    lng: 77.209,
    intensity: 75,
    location: "New Delhi Central",
    incidentsLastMonth: 12,
    safetyRating: "high-risk",
    description: "High traffic area with moderate incidents reported",
  },
  {
    id: "hotspot-2",
    lat: 28.5355,
    lng: 77.391,
    intensity: 45,
    location: "South Delhi",
    incidentsLastMonth: 5,
    safetyRating: "caution",
    description: "Occasional incidents, use caution during late night",
  },
  {
    id: "hotspot-3",
    lat: 28.7041,
    lng: 77.1025,
    intensity: 30,
    location: "North Delhi",
    incidentsLastMonth: 2,
    safetyRating: "safe",
    description: "Generally safe area with low incident rates",
  },
  {
    id: "hotspot-4",
    lat: 28.4595,
    lng: 77.0976,
    intensity: 65,
    location: "West Delhi",
    incidentsLastMonth: 8,
    safetyRating: "high-risk",
    description: "Known hotspot, avoid traveling alone at night",
  },
  {
    id: "hotspot-5",
    lat: 28.5562,
    lng: 77.0508,
    intensity: 20,
    location: "Gurgaon",
    incidentsLastMonth: 1,
    safetyRating: "safe",
    description: "Safe area with excellent security infrastructure",
  },
  {
    id: "hotspot-6",
    lat: 28.6692,
    lng: 77.4538,
    intensity: 55,
    location: "Noida",
    incidentsLastMonth: 7,
    safetyRating: "caution",
    description: "Moderate incidents reported in surrounding areas",
  },
];

export function getSafetyRatingColor(rating: "safe" | "caution" | "high-risk"): string {
  switch (rating) {
    case "safe":
      return "#10b981"; // Green
    case "caution":
      return "#f59e0b"; // Amber
    case "high-risk":
      return "#ef4444"; // Red
  }
}

export function getIntensityColor(intensity: number): string {
  if (intensity < 30) {
    return "#10b981"; // Green - Safe
  } else if (intensity < 60) {
    return "#f59e0b"; // Amber - Caution
  } else {
    return "#ef4444"; // Red - High Risk
  }
}

export function getCrimeHotspotsNear(
  lat: number,
  lng: number,
  radiusKm: number = 5
): CrimeHotspot[] {
  const R = 6371; // Radius of earth in km
  return crimeHotspots.filter((hotspot) => {
    const dLat = (hotspot.lat - lat) * (Math.PI / 180);
    const dLng = (hotspot.lng - lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
      Math.cos((hotspot.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= radiusKm;
  });
}

export function getAverageSafetyRating(
  lat: number,
  lng: number,
  radiusKm: number = 5
): number {
  const nearby = getCrimeHotspotsNear(lat, lng, radiusKm);
  if (nearby.length === 0) return 0;
  const avgIntensity = nearby.reduce((sum, h) => sum + h.intensity, 0) / nearby.length;
  return Math.round(avgIntensity);
}
