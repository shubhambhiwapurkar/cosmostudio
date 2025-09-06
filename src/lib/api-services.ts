import apiClient from './api-client';
import type {
  User,
  BirthChartData,
  ChartData,
  ChatSession,
  ChatMessage,
  DailyContent,
  LocationData,
  Coordinates,
  AuthResponse,
  RefreshResponse
} from './types';

// Auth Service
export const authService = {
  login: async (email: string, password: string) => {
    const formBody = new URLSearchParams();
    formBody.append('username', email);
    formBody.append('password', password);

    return apiClient.request<{ access_token: string; refresh_token: string }>('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    });
  },

  register: async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    birth_time: string;
    birth_place: string;
  }) => {
    return apiClient.post<User>('/api/v1/auth/signup', userData);
  },

  refreshToken: async (refreshToken: string) => {
    return apiClient.request<{ access_token: string }>('/api/v1/auth/refresh-token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  },

  getCurrentUser: async () => {
    return apiClient.get<User>('/api/v1/user/me');
  },

  deleteAccount: async () => {
    return apiClient.delete('/api/v1/account');
  },
};

// Birth Chart Service
export const birthChartService = {
  createChart: async (data: {
    birth_date: string;
    birth_time: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }) => {
    return apiClient.post<{ birthData: BirthChartData; chartData: ChartData }>('/api/v1/chart', data);
  },

  getChart: async (chartId: string) => {
    return apiClient.get<{ birthData: BirthChartData; chartData: ChartData }>(`/api/v1/chart/${chartId}`);
  },

  getUserCharts: async () => {
    return apiClient.get<Array<{ birthData: BirthChartData; chartData: ChartData }>>('/api/v1/chart/user');
  },

  getChartTransits: async (chartId: string) => {
    return apiClient.get<{
      date: string;
      transits: Array<{
        planet: string;
        aspect: string;
        target: string;
        description: string;
      }>;
    }>(`/api/v1/chart/${chartId}/transits`);
  },
};

// Chat Service
export const chatService = {
  createSession: async (title?: string, context?: any) => {
    return apiClient.post<ChatSession>('/api/v1/chat/sessions', { title, context });
  },

  sendMessage: async (sessionId: string, content: string, messageType: string = 'text') => {
    return apiClient.post<ChatMessage>(`/api/v1/chat/sessions/${sessionId}/messages`, {
      content,
      message_type: messageType,
    });
  },

  getMessages: async (sessionId: string) => {
    return apiClient.get<{ messages: ChatMessage[] }>(`/api/v1/chat/sessions/${sessionId}/messages`);
  },
};

// Daily Content Service
export const dailyContentService = {
  getDailyContent: async (date?: string) => {
    const endpoint = date
      ? `/api/v1/daily/content?date=${date}`
      : '/api/v1/daily/content';
    return apiClient.get<DailyContent>(endpoint);
  },
};

// Geocoding Service for Birth Chart
export const geocodingService = {
  getCoordinates: async (place: string): Promise<{
    latitude: number;
    longitude: number;
    timezone: string;
  }> => {
    try {
      // Using Nominatim API (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'CosmicInsights/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      if (!data.length) {
        throw new Error('Location not found');
      }

      // For timezone, we can use the abstract-timezone API
      const tzResponse = await fetch(
        `https://timezone.abstractapi.com/v1/current_time/?api_key=YOUR_FREE_KEY&location=${data[0].lat},${data[0].lon}`
      );
      
      if (!tzResponse.ok) {
        throw new Error('Timezone lookup failed');
      }

      const tzData = await tzResponse.json();

      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        timezone: tzData.timezone_name || 'UTC'
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to get location coordinates');
    }
  }
};
