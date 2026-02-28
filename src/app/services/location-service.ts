import { apiClient, ApiError } from '../utils/api-client';
import { API_ENDPOINTS } from '../utils/api-config';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationAddress {
  display_name: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface GeocodeResponse {
  coordinates: LocationCoordinates;
  address: LocationAddress;
  formatted_address: string;
}

export interface SearchResult {
  place_id: string;
  display_name: string;
  coordinates: LocationCoordinates;
  type: string;
}

export interface RouteCalculation {
  distance: number; // in kilometers
  duration: number; // in minutes
  fare: number; // in currency
  coordinates: [number, number][]; // route path
  traffic_level: 'green' | 'yellow' | 'red';
}

export class LocationService {
  /**
   * Forward geocoding - Convert address to coordinates
   */
  async geocodeAddress(address: string): Promise<GeocodeResponse> {
    try {
      const response = await apiClient.post<GeocodeResponse>(
        API_ENDPOINTS.LOCATION.GEOCODE,
        { address }
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Geocoding error:', error.message);
        // Fallback to default location (Bangalore)
        return {
          coordinates: { lat: 12.9716, lng: 77.5946 },
          address: {
            display_name: address,
            address: address,
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
          },
          formatted_address: address,
        };
      }
      throw error;
    }
  }

  /**
   * Reverse geocoding - Convert coordinates to address
   */
  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResponse> {
    try {
      const response = await apiClient.post<GeocodeResponse>(
        API_ENDPOINTS.LOCATION.REVERSE_GEOCODE,
        { lat, lng }
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Reverse geocoding error:', error.message);
        // Fallback
        return {
          coordinates: { lat, lng },
          address: {
            display_name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          },
          formatted_address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        };
      }
      throw error;
    }
  }

  /**
   * Search for locations with autocomplete
   */
  async searchLocations(query: string, near?: LocationCoordinates): Promise<SearchResult[]> {
    try {
      const response = await apiClient.post<SearchResult[]>(
        API_ENDPOINTS.LOCATION.SEARCH,
        { query, near }
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Location search error:', error.message);
        return [];
      }
      throw error;
    }
  }

  /**
   * Calculate route and fare between two points
   */
  async calculateRoute(
    pickup: LocationCoordinates,
    drop: LocationCoordinates
  ): Promise<RouteCalculation> {
    try {
      const response = await apiClient.post<RouteCalculation>(
        API_ENDPOINTS.LOCATION.CALCULATE_ROUTE,
        { pickup, drop }
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Route calculation error:', error.message);

        // Fallback calculation
        const distance = this.calculateDistance(pickup, drop);
        const duration = Math.max(10, Math.round(distance * 3)); // ~20 km/h average
        const baseFare = 50;
        const perKmRate = 12;
        const fare = Math.round(baseFare + distance * perKmRate);

        // Generate simple route coordinates
        const steps = 20;
        const coordinates: [number, number][] = [];
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const lng = pickup.lng + (drop.lng - pickup.lng) * t;
          const lat = pickup.lat + (drop.lat - pickup.lat) * t;
          const offset = Math.sin(t * Math.PI) * 0.003;
          coordinates.push([lng + offset, lat + offset]);
        }

        return {
          distance,
          duration,
          fare,
          coordinates,
          traffic_level: distance < 5 ? 'green' : distance < 15 ? 'yellow' : 'red',
        };
      }
      throw error;
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(point1: LocationCoordinates, point2: LocationCoordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLng = this.toRad(point2.lng - point1.lng);
    const lat1 = this.toRad(point1.lat);
    const lat2 = this.toRad(point2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  /**
   * Get current location using browser geolocation API
   */
  async getCurrentLocation(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to Bangalore
          resolve({ lat: 12.9716, lng: 77.5946 });
        }
      );
    });
  }
}

export const locationService = new LocationService();
