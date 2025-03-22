import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export const stocksApi = {
  getPortfolio: async () => {
    const response = await api.get<ApiResponse<any>>('/stocks/portfolio');
    return response.data;
  },

  getHoldings: async () => {
    const response = await api.get<ApiResponse<any>>('/stocks/holdings');
    return response.data;
  },

  getPositions: async () => {
    const response = await api.get<ApiResponse<any>>('/stocks/positions');
    return response.data;
  },

  getMarketData: async () => {
    const response = await api.get<ApiResponse<any>>('/stocks/market');
    return response.data;
  },

  getMarketNews: async () => {
    const response = await api.get<ApiResponse<any>>('/stocks/news');
    return response.data;
  }
};

export default api; 