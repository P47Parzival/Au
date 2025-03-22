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

export interface PortfolioData {
  total_value: number;
  holdings: Array<{
    tradingsymbol: string;
    exchange: string;
    quantity: number;
    ltp: number;
    averageprice: number;
    profitandloss: number;
    pnlpercentage: number;
  }>;
  positions: Array<{
    tradingsymbol: string;
    netQuantity: number;
    dayPl: number;
  }>;
  historical_data: Array<{
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  metrics: {
    daily_change: number;
    total_investments: number;
    daily_pl: number;
  };
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: boolean;
}

interface ApiResult<T> {
  status: boolean;
  data: T | null;
  message?: string;
}

export const stocksApi = {
  getPortfolio: async (): Promise<ApiResult<PortfolioData>> => {
    try {
      const response = await api.get<PortfolioData>('/stocks/portfolio');
      return {
        status: true,
        data: response.data
      };
    } catch (error) {
      console.error('Portfolio fetch error:', error);
      return {
        status: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch portfolio data'
      };
    }
  },

  getHoldings: async () => {
    try {
      const response = await api.get<ApiResponse<any>>('/stocks/holdings');
      return {
        status: true,
        data: response.data
      };
    } catch (error) {
      console.error('Holdings fetch error:', error);
      return {
        status: false,
        data: [],
        message: error instanceof Error ? error.message : 'Failed to fetch holdings data'
      };
    }
  },

  getPositions: async () => {
    try {
      const response = await api.get<ApiResponse<any>>('/stocks/positions');
      return {
        status: true,
        data: response.data
      };
    } catch (error) {
      console.error('Positions fetch error:', error);
      return {
        status: false,
        data: [],
        message: error instanceof Error ? error.message : 'Failed to fetch positions data'
      };
    }
  },

  getMarketData: async () => {
    try {
      const response = await api.get<ApiResponse<any>>('/stocks/market');
      return {
        status: true,
        data: response.data
      };
    } catch (error) {
      console.error('Market data fetch error:', error);
      return {
        status: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch market data'
      };
    }
  },

  getMarketNews: async () => {
    try {
      const response = await api.get<ApiResponse<any>>('/stocks/news');
      return {
        status: true,
        data: response.data
      };
    } catch (error) {
      console.error('Market news fetch error:', error);
      return {
        status: false,
        data: [],
        message: error instanceof Error ? error.message : 'Failed to fetch market news'
      };
    }
  }
};

export default api; 