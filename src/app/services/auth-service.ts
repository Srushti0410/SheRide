import { apiClient, ApiError } from '../utils/api-client';
import { API_ENDPOINTS } from '../utils/api-config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'passenger' | 'driver' | 'admin';
    token: string;
  };
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: 'passenger' | 'driver';
}

export interface SignupResponse extends LoginResponse { }

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Set token in API client
      if (response.user.token) {
        apiClient.setToken(response.user.token);
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await apiClient.post<SignupResponse>(
        API_ENDPOINTS.AUTH.SIGNUP,
        data
      );

      // Set token in API client
      if (response.user.token) {
        apiClient.setToken(response.user.token);
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      apiClient.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
      apiClient.clearToken();
    }
  }

  async verifyToken(token: string): Promise<{ valid: boolean }> {
    try {
      return await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_TOKEN, { token });
    } catch (error) {
      return { valid: false };
    }
  }
}

export const authService = new AuthService();
