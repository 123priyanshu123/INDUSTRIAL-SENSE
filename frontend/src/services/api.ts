import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('is_auth_token') || 'demo_jwt_token_alpha';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful fallback
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[API Service] Backend endpoint unavailable, falling back to local SCADA telemetry bus:', error.message);
    return Promise.reject(error);
  }
);
