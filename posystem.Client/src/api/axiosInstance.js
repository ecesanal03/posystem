// src/api/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('authToken');
    console.log('Token in interceptor:', token);
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
      console.log('Request headers:', request.headers);
      console.log('Request URL:', request.url);
      console.log('Request method:', request.method);
    } else {
      console.log('No token found in localStorage');
    }
    console.log('Starting Request:', request);
    return request;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    console.error('Error config:', error.config);

    // Handle 401 errors
    if (error.response?.status === 401) {
      // Clear the invalid token
      localStorage.removeItem('authToken');
      
      // Get the current location
      const currentPath = window.location.pathname;
      
      // Redirect to login while preserving the intended destination
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
    
    return Promise.reject(error);
  }
);

export default instance;
