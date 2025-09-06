const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

export class ChatAPI {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } else {
          // For non-JSON responses (like HTML error pages)
          const text = await response.text();
          errorMessage = `Server returned non-JSON response (${contentType}): ${text.substring(0, 100)}...`;
        }
      } catch (error) {
        const e = error as Error;
        errorMessage += ` (Failed to parse error response: ${e.message})`;
      }
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch (error) {
      const e = error as Error;
      throw new Error(`Failed to parse JSON response: ${e.message}`);
    }
  }

  async createSession(title?: string, context?: any) {
    return this.request('/api/v1/chat/sessions', {
      method: 'POST',
      body: JSON.stringify({ title, context }),
    });
  }

  async sendMessage(sessionId: string, content: string) {
    return this.request(`/api/v1/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getMessages(sessionId: string) {
    return this.request(`/api/v1/chat/sessions/${sessionId}/messages`);
  }

  async getChart(chartId: string) {
    return this.request(`/api/v1/chart/${chartId}`);
  }
}