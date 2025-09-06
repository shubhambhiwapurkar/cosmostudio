import apiClient from './api-client';
import { BirthChart, DailyTransits } from './types';

interface CreateBirthChartPayload {
  birth_date: string; // YYYY-MM-DD
  birth_time: string; // HH:mm
  latitude: number;
  longitude: number;
  timezone: string;
}

export const createBirthChart = async (payload: CreateBirthChartPayload): Promise<BirthChart> => {
  return apiClient.post<BirthChart>('/api/v1/chart', payload);
};

export const getBirthChart = async (chartId: string): Promise<BirthChart> => {
  return apiClient.get<BirthChart>(`/api/v1/chart/${chartId}`);
};

export const getUserCharts = async (): Promise<BirthChart[]> => {
  return apiClient.get<BirthChart[]>('/api/v1/chart/user');
};

export const getChartTransits = async (chartId: string): Promise<DailyTransits> => {
  return apiClient.get<DailyTransits>(`/api/v1/chart/${chartId}/transits`);
};