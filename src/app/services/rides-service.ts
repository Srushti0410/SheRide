import { apiClient, ApiError } from '../utils/api-client';
import { API_ENDPOINTS } from '../utils/api-config';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface RideRequest {
  pickupLocation: Location;
  dropLocation: Location;
  rideType: 'regular' | 'girls-only';
  scheduledTime?: string;
  passengerNotes?: string;
}

export interface RideResponse {
  id: string;
  passengerId: string;
  driverId?: string;
  pickupLocation: Location;
  dropLocation: Location;
  rideType: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  estimatedTime: number;
  driverDetails?: {
    id: string;
    name: string;
    rating: number;
    vehicle: string;
    licensePlate: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RideHistoryResponse {
  total: number;
  rides: RideResponse[];
}

export class RidesService {
  async createRide(rideData: RideRequest): Promise<RideResponse> {
    try {
      return await apiClient.post<RideResponse>(API_ENDPOINTS.RIDES.CREATE, rideData);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async getRide(rideId: string): Promise<RideResponse> {
    try {
      const endpoint = API_ENDPOINTS.RIDES.GET.replace(':rideId', rideId);
      return await apiClient.get<RideResponse>(endpoint);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async bookRide(rideId: string): Promise<RideResponse> {
    try {
      const endpoint = API_ENDPOINTS.RIDES.BOOK.replace(':rideId', rideId);
      return await apiClient.post<RideResponse>(endpoint);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async updateRideStatus(rideId: string, status: string): Promise<RideResponse> {
    try {
      const endpoint = API_ENDPOINTS.RIDES.GET.replace(':rideId', rideId);
      return await apiClient.patch<RideResponse>(endpoint, { status });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async cancelRide(rideId: string, reason?: string): Promise<RideResponse> {
    try {
      const endpoint = API_ENDPOINTS.RIDES.CANCEL.replace(':rideId', rideId);
      return await apiClient.post<RideResponse>(endpoint, { reason });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async getRideHistory(userId: string, limit: number = 10, offset: number = 0): Promise<RideHistoryResponse> {
    try {
      const endpoint = `${API_ENDPOINTS.RIDES.GET_HISTORY}?userId=${userId}&limit=${limit}&offset=${offset}`;
      return await apiClient.get<RideHistoryResponse>(endpoint);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async getAvailableRides(lat: number, lng: number, radius: number = 10): Promise<RideResponse[]> {
    try {
      const endpoint = `${API_ENDPOINTS.RIDES.GET_AVAILABLE}?lat=${lat}&lng=${lng}&radius=${radius}`;
      return await apiClient.get<RideResponse[]>(endpoint);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async acceptRide(rideId: string): Promise<RideResponse> {
    try {
      const endpoint = `${API_ENDPOINTS.RIDES.GET.replace(':rideId', rideId)}/accept`;
      return await apiClient.post<RideResponse>(endpoint);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async completeRide(rideId: string, rating: number, review?: string): Promise<RideResponse> {
    try {
      const endpoint = `${API_ENDPOINTS.RIDES.GET.replace(':rideId', rideId)}/complete`;
      return await apiClient.post<RideResponse>(endpoint, { rating, review });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
}

export const ridesService = new RidesService();
