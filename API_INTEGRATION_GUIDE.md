# SheRide API Integration Guide

## Step-by-Step API Integration Instructions

This guide will help you integrate backend APIs into the SheRide platform. Follow these steps carefully.

---

## 🚀 STEP 1: Set Up API Configuration

### 1.1 Create Environment Variables File

Create a file `.env` in the root directory:

```bash
# .env file (root directory)
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000
```

### 1.2 Create API Configuration File

Create `src/app/utils/api-config.ts`:

```typescript
// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    VERIFY_TOKEN: '/auth/verify',
  },
  PROFILE: {
    GET: '/profiles/:userId',
    UPDATE: '/profiles/:userId',
    COMPLETE: '/profiles/:userId/complete',
    UPLOAD_DOCUMENT: '/profiles/:userId/documents',
  },
  CRIMES: {
    GET_HOTSPOTS: '/crimes/hotspots',
    GET_NEARBY: '/crimes/hotspots/nearby',
    GET_STATISTICS: '/crimes/statistics',
  },
  RIDES: {
    CREATE: '/rides',
    GET: '/rides/:rideId',
    BOOK: '/rides/:rideId/book',
    CANCEL: '/rides/:rideId/cancel',
    GET_HISTORY: '/rides/history',
    GET_AVAILABLE: '/rides/available',
  },
  USERS: {
    GET: '/users/:userId',
    UPDATE: '/users/:userId',
    GET_VERIFICATION_STATUS: '/users/:userId/verification',
  },
};
```

---

## 🔌 STEP 2: Create API Service/Client

### 2.1 Create API Service File

Create `src/app/utils/api-client.ts`:

```typescript
import { API_CONFIG, API_ENDPOINTS } from './api-config';

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
      const userData = JSON.parse(user);
      this.token = userData.token;
    }
  }

  // Set token manually
  setToken(token: string) {
    this.token = token;
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
      throw error;
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL, API_CONFIG.TIMEOUT);
```

---

## 📡 STEP 3: Create API Services for Each Module

### 3.1 Authentication Service

Create `src/app/services/auth-service.ts`:

```typescript
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

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async signup(data: SignupRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.SIGNUP,
        data
      );
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
    } catch (error) {
      console.error('Logout error:', error);
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
```

### 3.2 Profile Service

Create `src/app/services/profile-service.ts`:

```typescript
import { apiClient, ApiError } from '../utils/api-client';
import { API_ENDPOINTS } from '../utils/api-config';
import { UserProfile } from '../context/AuthContext';

export interface ProfileResponse {
  id: string;
  userId: string;
  profile: UserProfile;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export class ProfileService {
  async getProfile(userId: string): Promise<ProfileResponse> {
    try {
      const endpoint = API_ENDPOINTS.PROFILE.GET.replace(':userId', userId);
      return await apiClient.get<ProfileResponse>(endpoint);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async updateProfile(userId: string, profile: UserProfile): Promise<ProfileResponse> {
    try {
      const endpoint = API_ENDPOINTS.PROFILE.UPDATE.replace(':userId', userId);
      return await apiClient.put<ProfileResponse>(endpoint, profile);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async completeProfile(userId: string, profile: UserProfile): Promise<ProfileResponse> {
    try {
      const endpoint = API_ENDPOINTS.PROFILE.COMPLETE.replace(':userId', userId);
      return await apiClient.post<ProfileResponse>(endpoint, profile);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async uploadDocument(
    userId: string,
    file: File,
    docType: 'idProof' | 'insuranceProof'
  ): Promise<{ url: string; verified: boolean }> {
    try {
      const endpoint = API_ENDPOINTS.PROFILE.UPLOAD_DOCUMENT.replace(':userId', userId);
      return await apiClient.uploadFile(endpoint, file, { docType });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
}

export const profileService = new ProfileService();
```

### 3.3 Crime Hotspots Service

Create `src/app/services/crime-service.ts`:

```typescript
import { apiClient, ApiError } from '../utils/api-client';
import { API_ENDPOINTS } from '../utils/api-config';
import { CrimeHotspot } from '../utils/crime-heatmap';

export class CrimeService {
  async getHotspots(): Promise<CrimeHotspot[]> {
    try {
      return await apiClient.get<CrimeHotspot[]>(API_ENDPOINTS.CRIMES.GET_HOTSPOTS);
    } catch (error) {
      console.error('Error fetching crime hotspots:', error);
      throw error;
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
      console.error('Error fetching nearby hotspots:', error);
      throw error;
    }
  }

  async getStatistics(lat: number, lng: number): Promise<{
    safetyRating: number;
    incidentsLastMonth: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }> {
    try {
      const endpoint = `${API_ENDPOINTS.CRIMES.GET_STATISTICS}?lat=${lat}&lng=${lng}`;
      return await apiClient.get(endpoint);
    } catch (error) {
      console.error('Error fetching crime statistics:', error);
      throw error;
    }
  }
}

export const crimeService = new CrimeService();
```

### 3.4 Rides Service

Create `src/app/services/rides-service.ts`:

```typescript
import { apiClient, ApiError } from '../utils/api-client';
import { API_ENDPOINTS } from '../utils/api-config';

export interface RideRequest {
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  dropLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  rideType: 'regular' | 'girls-only';
  scheduledTime?: string;
}

export interface RideResponse {
  id: string;
  passengerId: string;
  driverId?: string;
  pickupLocation: any;
  dropLocation: any;
  rideType: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  estimatedTime: number;
  createdAt: string;
  updatedAt: string;
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

  async getRideHistory(userId: string): Promise<RideResponse[]> {
    try {
      const endpoint = `${API_ENDPOINTS.RIDES.GET_HISTORY}?userId=${userId}`;
      return await apiClient.get<RideResponse[]>(endpoint);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async getAvailableRides(lat: number, lng: number): Promise<RideResponse[]> {
    try {
      const endpoint = `${API_ENDPOINTS.RIDES.GET_AVAILABLE}?lat=${lat}&lng=${lng}`;
      return await apiClient.get<RideResponse[]>(endpoint);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
}

export const ridesService = new RidesService();
```

---

## 💾 STEP 4: Update AuthContext to Use API

Create/Update `src/app/context/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authService } from "../services/auth-service";

export type UserRole = "passenger" | "driver" | "admin" | null;

export interface UserProfile {
  age?: number;
  gender?: "male" | "female" | "other";
  profilePhoto?: string;
  idProof?: string;
  idNumber?: string;
  licenseNumber?: string;
  vehicleModel?: string;
  vehicleNumber?: string;
  insuranceProof?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  homeLocation?: { lat: number; lng: number; address: string };
  workLocation?: { lat: number; lng: number; address: string };
  verificationStatus?: "pending" | "approved" | "rejected";
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
  profile?: UserProfile;
  isProfileComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  selectRole: (role: UserRole) => void;
  updateProfile: (profile: UserProfile) => void;
  completeProfile: () => void;
  loginWithAPI: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("sheride_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    const newUser = { ...userData, isProfileComplete: false };
    setUser(newUser);
    localStorage.setItem("sheride_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sheride_user");
    authService.logout().catch(console.error);
  };

  const selectRole = (role: UserRole) => {
    if (user && role) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("sheride_user", JSON.stringify(updatedUser));
    }
  };

  const updateProfile = (profile: UserProfile) => {
    if (user) {
      const updatedUser = { ...user, profile };
      setUser(updatedUser);
      localStorage.setItem("sheride_user", JSON.stringify(updatedUser));
    }
  };

  const completeProfile = () => {
    if (user) {
      const updatedUser = { ...user, isProfileComplete: true };
      setUser(updatedUser);
      localStorage.setItem("sheride_user", JSON.stringify(updatedUser));
    }
  };

  // API-based login
  const loginWithAPI = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      const userData: User = {
        ...response.user,
        isProfileComplete: false,
      };
      login(userData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        selectRole,
        updateProfile,
        completeProfile,
        loginWithAPI,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

---

## 📝 STEP 5: Update Components to Use API

### 5.1 Update Profile Completion Page

Update `src/app/pages/profile-completion.tsx` to use API:

```typescript
// Add import at top
import { profileService } from "../services/profile-service";

// In handleSubmit function, replace the setTimeout with API call:

const handleSubmit = async () => {
  if (!validateAllFields()) {
    alert("Please complete all required fields");
    return;
  }

  setLoading(true);
  try {
    const profileData = {
      age: parseInt(age),
      gender,
      emergencyContact,
      emergencyPhone,
      homeLocation,
      workLocation,
      idProof,
      idNumber,
      licenseNumber: user?.role === "driver" ? licenseNumber : undefined,
      vehicleModel: user?.role === "driver" ? vehicleModel : undefined,
      vehicleNumber: user?.role === "driver" ? vehicleNumber : undefined,
      insuranceProof: user?.role === "driver" ? insuranceProof : undefined,
      verificationStatus: "pending" as const,
    };

    // Call API to complete profile
    await profileService.completeProfile(user!.id, profileData);

    updateProfile(profileData);
    completeProfile();

    // Redirect to appropriate dashboard
    const dashboardPath = user?.role === "driver" ? "/driver" : "/passenger";
    navigate(dashboardPath);
  } catch (error) {
    alert(error instanceof Error ? error.message : "Error submitting profile");
  } finally {
    setLoading(false);
  }
};
```

### 5.2 Update MapComponent to Use Crime API

Update the MapComponent to fetch real crime data:

```typescript
// Add import
import { crimeService } from "../services/crime-service";
import { useEffect, useState } from "react";

// Inside MapComponent function, add:
const [hotspots, setHotspots] = useState(crimeHotspots);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchHotspots = async () => {
    if (!showHeatmap) return;
    setLoading(true);
    try {
      const data = await crimeService.getHotspots();
      setHotspots(data);
    } catch (error) {
      console.error('Error fetching crime hotspots:', error);
      // Fall back to mock data
      setHotspots(crimeHotspots);
    } finally {
      setLoading(false);
    }
  };

  fetchHotspots();
}, [showHeatmap]);

// Use 'hotspots' instead of 'crimeHotspots' in JSX
```

---

## 🔧 STEP 6: Backend Endpoints You Need to Create

### Node.js/Express Backend Template

Create these endpoints in your backend:

```javascript
// routes/auth.js
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate credentials
    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY);

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/profiles/:userId/complete', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile, isProfileComplete: true },
      { new: true }
    );

    res.json({
      status: 'success',
      data: {
        id: updatedUser._id,
        profile: updatedUser.profile,
        verificationStatus: 'pending'
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/crimes/hotspots', async (req, res) => {
  try {
    const hotspots = await CrimeHotspot.find();
    res.json({ status: 'success', data: hotspots });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/crimes/hotspots/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    const hotspots = await CrimeHotspot.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    });

    res.json({ status: 'success', data: hotspots });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
```

---

## 🧪 STEP 7: Test API Integration

### 7.1 Test with Postman

1. Import these endpoints into Postman
2. Test each endpoint with sample data
3. Verify response format matches

### 7.2 Test in Application

```typescript
// Create test file: src/app/utils/test-api.ts

import { authService } from "../services/auth-service";
import { profileService } from "../services/profile-service";
import { crimeService } from "../services/crime-service";

export async function testAPIs() {
  try {
    console.log('Testing Auth Service...');
    const loginResponse = await authService.login({
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✓ Login successful:', loginResponse);

    console.log('Testing Crime Service...');
    const hotspots = await crimeService.getHotspots();
    console.log('✓ Hotspots fetched:', hotspots);

    console.log('Testing Nearby Hotspots...');
    const nearbyHotspots = await crimeService.getNearbyHotspots(28.6139, 77.209, 5);
    console.log('✓ Nearby hotspots:', nearbyHotspots);

  } catch (error) {
    console.error('✗ API Test Failed:', error);
  }
}

// Call this in your main.tsx or a debug component
```

---

## 🚨 STEP 8: Error Handling Best Practices

### 8.1 Global Error Handler Hook

Create `src/app/hooks/useApiCall.ts`:

```typescript
import { useState } from 'react';
import { ApiError } from '../utils/api-client';

export function useApiCall<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (apiFunction: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}
```

### 8.2 Using in Components

```typescript
import { useApiCall } from '../hooks/useApiCall';
import { crimeService } from '../services/crime-service';

export function MyComponent() {
  const { data: hotspots, loading, error, execute } = useApiCall();

  const loadHotspots = async () => {
    try {
      await execute(() => crimeService.getHotspots());
    } catch (error) {
      console.error('Failed to load hotspots');
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {hotspots && <div>{/* Display hotspots */}</div>}
      <button onClick={loadHotspots}>Load Hotspots</button>
    </div>
  );
}
```

---

## 📋 STEP 9: Environment Setup Checklist

```bash
# .env (Root Directory)
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000
```

```bash
# .env.production
VITE_API_BASE_URL=https://api.sheride.com/api
VITE_API_TIMEOUT=10000
```

---

## 🎯 Summary: Implementation Checklist

- [ ] Create `.env` file with API base URL
- [ ] Create `api-config.ts` with endpoints
- [ ] Create `api-client.ts` with fetch wrapper
- [ ] Create all service files (auth, profile, crime, rides)
- [ ] Update AuthContext with `loginWithAPI`
- [ ] Update ProfileCompletionPage to use API
- [ ] Update MapComponent to fetch crime data
- [ ] Create useApiCall hook for error handling
- [ ] Test all endpoints with Postman
- [ ] Deploy backend API
- [ ] Update .env.production with live API URL

---

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS errors | Add CORS middleware to backend |
| 401 Unauthorized | Check token in localStorage |
| 404 Not Found | Verify API endpoint paths |
| Network timeout | Increase VITE_API_TIMEOUT |
| Invalid response | Check response format matches |

---

**Next Step:** Start with STEP 1 (.env file) and work through each step sequentially.
