import axios from 'axios';
import { 
  CreateCardRequest, 
  CreateCardResponse, 
  GetEffectsResponse, 
  ApiResponse 
} from '@schoolletloose/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens (if needed later)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const cardAPI = {
  /**
   * Get all available card effects
   */
  getEffects: async (): Promise<GetEffectsResponse> => {
    const response = await api.get<ApiResponse<GetEffectsResponse>>('/effects');
    return response.data.data!;
  },

  /**
   * Get effects by card type
   */
  getEffectsByType: async (cardType: string): Promise<GetEffectsResponse> => {
    const response = await api.get<ApiResponse<GetEffectsResponse>>(`/effects/type/${cardType}`);
    return response.data.data!;
  },

  /**
   * Create a new card
   */
  createCard: async (cardData: CreateCardRequest): Promise<CreateCardResponse> => {
    const response = await api.post<ApiResponse<CreateCardResponse>>('/cards', cardData);
    return response.data.data!;
  },

  /**
   * Get card by ID
   */
  getCard: async (cardId: string) => {
    const response = await api.get(`/cards/${cardId}`);
    return response.data.data;
  },

  /**
   * Get all cards with pagination
   */
  getCards: async (page = 1, limit = 20) => {
    const response = await api.get(`/cards?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  /**
   * Upload card artwork
   */
  uploadArtwork: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('artwork', file);
    
    const response = await api.post('/cards/upload-artwork', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  }
};

export const roomAPI = {
  /**
   * Get room information
   */
  getRoom: async (roomId: string) => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data.data;
  },

  /**
   * Get list of active rooms
   */
  getRooms: async () => {
    const response = await api.get('/rooms');
    return response.data.data;
  },

  /**
   * Create a new room
   */
  createRoom: async (roomData: { name: string; isPrivate?: boolean }) => {
    const response = await api.post('/rooms', roomData);
    return response.data.data;
  }
};

// Utility functions
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default api;
