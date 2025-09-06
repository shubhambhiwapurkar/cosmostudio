type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

type TokenProvider = () => Promise<string | null>;

interface ApiClient {
  setTokenProvider: (provider: TokenProvider) => void;
  request: <T>(endpoint: string, options: RequestOptions) => Promise<T>;
  get: <T>(endpoint: string, headers?: Record<string, string>) => Promise<T>;
  post: <T>(endpoint: string, body: any, headers?: Record<string, string>) => Promise<T>;
  put: <T>(endpoint: string, body: any, headers?: Record<string, string>) => Promise<T>;
  delete: <T>(endpoint: string, headers?: Record<string, string>) => Promise<T>;
}

let tokenProvider: TokenProvider | null = null;

const apiClient: ApiClient = {
  setTokenProvider: (provider: TokenProvider) => {
    tokenProvider = provider;
  },

  request: async <T>(endpoint: string, options: RequestOptions): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (tokenProvider) {
      const token = await tokenProvider();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error('API base URL not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.');
    }

    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
    console.log(`Making API request to: ${url}`);
    
    const response = await fetch(url, {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: 'include', // Include cookies if they exist
    });

    if (!response.ok) {
      let errorMessage = 'Something went wrong';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } else {
          const text = await response.text();
          console.error('Non-JSON error response:', text);
          if (response.status === 401) {
            errorMessage = 'Authentication failed. Please log in again.';
          }
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    try {
      return await response.json() as T;
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      throw new Error('Invalid response format from server');
    }
  },

  get: <T>(endpoint: string, headers?: Record<string, string>): Promise<T> => {
    return apiClient.request<T>(endpoint, { method: 'GET', headers });
  },

  post: <T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> => {
    return apiClient.request<T>(endpoint, { method: 'POST', body, headers });
  },

  put: <T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> => {
    return apiClient.request<T>(endpoint, { method: 'PUT', body, headers });
  },

  delete: <T>(endpoint: string, headers?: Record<string, string>): Promise<T> => {
    return apiClient.request<T>(endpoint, { method: 'DELETE', headers });
  },
};

export default apiClient;