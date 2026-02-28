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
  LOCATION: {
    GEOCODE: '/location/geocode',
    REVERSE_GEOCODE: '/location/reverse-geocode',
    SEARCH: '/location/search',
    CALCULATE_ROUTE: '/location/route',
  },
  USERS: {
    GET: '/users/:userId',
    UPDATE: '/users/:userId',
    GET_VERIFICATION_STATUS: '/users/:userId/verification',
  },
};
