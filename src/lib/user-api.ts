import apiClient from './api-client';
import { User } from './types';

export const getCurrentUser = async (): Promise<User> => {
  return apiClient.get<User>('/api/v1/user/me');
};

export const deleteAccount = async (): Promise<{ message: string; status: string }> => {
  return apiClient.delete<{ message: string; status: string }>('/api/v1/account');
};