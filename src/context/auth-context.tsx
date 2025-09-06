'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getToken, getRefreshToken, refreshAccessToken, storeToken, removeToken } from '@/lib/auth';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  getValidToken: () => Promise<string | null>;
  logout: () => void;
  setAuth: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  loading: true,
  getValidToken: async () => null,
  logout: () => {},
  setAuth: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    token: null as string | null,
    loading: true,
    tokenProvider: null as (() => Promise<string | null>) | null
  });
  const router = useRouter();

  // Define base functions first
  const setToken = useCallback((newToken: string | null) => {
    setState(prev => ({ ...prev, token: newToken }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    removeToken();
    router.push('/');
  }, [router, setToken]);

  // Define token validation and refresh logic
  const validateAndRefreshToken = useCallback(async (currentToken: string): Promise<string | null> => {
    try {
      const decodedToken: { exp: number } = jwtDecode(currentToken);
      const isExpired = decodedToken.exp * 1000 < Date.now();

      if (isExpired) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          setToken(newToken);
          return newToken;
        }
        logout();
        return null;
      }

      return currentToken;
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
      return null;
    }
  }, [logout, setToken]);

  // Define getValidToken function
  const getValidToken = useCallback(async (): Promise<string | null> => {
    const currentToken = state.token || getToken();
    if (!currentToken) return null;
    return validateAndRefreshToken(currentToken);
  }, [state.token, validateAndRefreshToken]);

  // Initialize auth state
  const initAuth = useCallback(async () => {
    try {
      const storedToken = getToken();
      if (!storedToken) {
        setLoading(false);
        return;
      }

      const validToken = await validateAndRefreshToken(storedToken);
      if (validToken) {
        setToken(validToken);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout, setLoading, setToken, validateAndRefreshToken]);

  // Initialize auth on mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Set up API client token provider
  useEffect(() => {
    if (!state.loading) {
      apiClient.setTokenProvider(getValidToken);
    }
  }, [state.loading, getValidToken]);
    
  // Define setAuth function
  const setAuth = useCallback((newToken: string) => {
    storeToken(newToken);
    setToken(newToken);
  }, [setToken]);

  const value = {
    isAuthenticated: !!state.token,
    token: state.token,
    loading: state.loading,
    getValidToken,
    logout,
    setAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};