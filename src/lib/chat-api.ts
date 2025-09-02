const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

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
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
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
}