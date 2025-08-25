import axios from 'axios';

// Create axios instance with base configuration
// For Next.js, we call the local API routes, not the backend directly
const api = axios.create({
  baseURL: '', // Empty baseURL means relative to current domain
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// HTTP client utility for API routes
export const apiClient = {
  async request(url, options = {}) {
    try {
      // Check if the backend is reachable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - backend server may not be running');
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused - backend server is not running');
      }
      if (error.code === 'ENOTFOUND') {
        throw new Error('Backend server not found - check the URL');
      }
      throw error;
    }
  },

  async post(url, data) {
    const response = await this.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return response;
  },

  async get(url) {
    const response = await this.request(url, {
      method: 'GET',
    });
    
    return response;
  }
};

export default api;
