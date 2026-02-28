import { API_CONFIG } from './api-config';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private token: string | null = null;

  constructor(baseUrl: string, timeout: number) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.loadToken();
  }

  // Load JWT token from localStorage
  private loadToken() {
    const user = localStorage.getItem('sheride_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        this.token = userData.token;
      } catch (error) {
        console.error('Error loading token:', error);
      }
    }
  }

  // Set token manually
  setToken(token: string) {
    this.token = token;
    const user = localStorage.getItem('sheride_user');
    if (user) {
      const userData = JSON.parse(user);
      userData.token = token;
      localStorage.setItem('sheride_user', JSON.stringify(userData));
    }
  }

  // Clear token
  clearToken() {
    this.token = null;
  }

  // Get headers with auth token
  private getHeaders() {
    const headers: Record<string, string> = {
      ...API_CONFIG.HEADERS,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    overrideUrl?: string
  ): Promise<T> {
    const url = overrideUrl || `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const options: RequestInit = {
        method,
        headers: this.getHeaders(),
        signal: controller.signal,
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      clearTimeout(timeoutId);

      // Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || `HTTP Error ${response.status}`,
          errorData
        );
      }

      // Parse response
      if (response.status === 204) {
        return {} as T; // No content
      }

      const responseData: { status: string; data: T; message?: string } =
        await response.json();

      if (responseData.status === 'error') {
        throw new ApiError(
          response.status,
          responseData.message || 'API Error',
          responseData.data
        );
      }

      return responseData.data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError(0, 'Network error. Please check your connection.');
      }

      throw new ApiError(500, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Convenience methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('PATCH', endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  // Upload file (FormData)
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }

    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : '',
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || `HTTP Error ${response.status}`,
          errorData
        );
      }

      const responseData = await response.json();
      return responseData.data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, error instanceof Error ? error.message : 'Upload failed');
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL, API_CONFIG.TIMEOUT);
