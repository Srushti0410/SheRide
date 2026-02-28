import { apiClient } from '../utils/api-client';
import { API_ENDPOINTS } from '../utils/api-config';
import { CrimeHotspot, crimeHotspots as mockHotspots } from '../utils/crime-heatmap';

export interface CrimeStatistics {
  safetyRating: number;
  incidentsLastMonth: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  averageIncidentRate: number;
}

export class CrimeService {
  async getHotspots(): Promise<CrimeHotspot[]> {
    try {
      return await apiClient.get<CrimeHotspot[]>(API_ENDPOINTS.CRIMES.GET_HOTSPOTS);
    } catch (error) {
      console.warn('Error fetching crime hotspots from API, using mock data:', error);
      return mockHotspots;
    }
  }

  async getNearbyHotspots(
    lat: number,
    lng: number,
    radiusKm: number = 5
  ): Promise<CrimeHotspot[]> {
    try {
      const endpoint = `${API_ENDPOINTS.CRIMES.GET_NEARBY}?lat=${lat}&lng=${lng}&radius=${radiusKm}`;
      return await apiClient.get<CrimeHotspot[]>(endpoint);
    } catch (error) {
      console.warn('Error fetching nearby hotspots from API, using mock data:', error);
      // Fall back to mock data with client-side filtering
      return this.getNearbyHotspotsLocal(lat, lng, radiusKm);
    }
  }

  // Local fallback for nearby hotspots
  private getNearbyHotspotsLocal(lat: number, lng: number, radiusKm: number): CrimeHotspot[] {
    const R = 6371; // Radius of earth in km
    return mockHotspots.filter((hotspot) => {
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

  async getStatistics(lat: number, lng: number): Promise<CrimeStatistics> {
    try {
      const endpoint = `${API_ENDPOINTS.CRIMES.GET_STATISTICS}?lat=${lat}&lng=${lng}`;
      return await apiClient.get<CrimeStatistics>(endpoint);
    } catch (error) {
      console.warn('Error fetching crime statistics from API, using calculated data:', error);
      // Calculate from mock data
      const nearby = this.getNearbyHotspotsLocal(lat, lng, 5);
      const avgIntensity = nearby.length > 0
        ? nearby.reduce((sum, h) => sum + h.intensity, 0) / nearby.length
        : 0;

      return {
        safetyRating: Math.round(100 - avgIntensity),
        incidentsLastMonth: nearby.reduce((sum, h) => sum + h.incidentsLastMonth, 0),
        trend: 'stable',
        averageIncidentRate: Math.round(avgIntensity),
      };
    }
  }
}

export const crimeService = new CrimeService();
