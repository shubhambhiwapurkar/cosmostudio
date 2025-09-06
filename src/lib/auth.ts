'use client';

import { z } from 'zod';

export const API_BASE_URL = "https://cosmicapp-app.kindflower-34fe9cb7.eastus.azurecontainerapps.io"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  birth_date: z.string(),
  birth_time: z.string(),
  birth_place: z.string(),
});

export async function loginUser(credentials: z.infer<typeof loginSchema>) {
  const formBody = new URLSearchParams();
  formBody.append('username', credentials.email);
  formBody.append('password', credentials.password);
  formBody.append('grant_type', 'password');

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login error:', response.status, errorText);
      throw new Error('Login failed');
    }

    const data = await response.json();
    if (data.access_token && data.refresh_token) {
      storeToken(data.access_token);
      storeRefreshToken(data.refresh_token);
      return data;
    }
    throw new Error('Invalid response from login endpoint');
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export function storeToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
}

export function storeRefreshToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refresh_token', token);
  }
}

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

export function getRefreshToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const formData = new URLSearchParams();
  formData.append('grant_type', 'refresh_token');
  formData.append('refresh_token', refreshToken);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Refresh token error:', response.status, errorText);
      removeToken();
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    if (data.access_token) {
      storeToken(data.access_token);
      return data.access_token;
    }
    throw new Error('Invalid response from refresh token endpoint');
  } catch (error) {
    console.error('Token refresh failed:', error);
    removeToken();
    throw error;
  }
}

export async function registerUser(userData: z.infer<typeof registerSchema>) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}