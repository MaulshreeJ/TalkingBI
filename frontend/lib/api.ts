import type {
  UploadResponse,
  QueryResponse,
  SuggestResponse,
  SessionStatus,
  MetricsResponse,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Upload a CSV and create a session
  async upload(
    file: File,
    mode: 'dashboard' | 'query' | 'both' = 'both',
    onProgress?: (pct: number) => void
  ): Promise<UploadResponse> {
    const form = new FormData();
    form.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/upload?mode=${mode}`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          try {
            reject(new Error(JSON.parse(xhr.responseText).detail || 'Upload failed'));
          } catch {
            reject(new Error('Upload failed'));
          }
        }
      };
      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(form);
    });
  },

  // Send a natural language query
  async query(sessionId: string, query: string): Promise<QueryResponse> {
    return request<QueryResponse>(`/query/${sessionId}`, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },

  // Get query suggestions
  async suggest(sessionId: string, prefix = ''): Promise<SuggestResponse> {
    const q = prefix ? `&q=${encodeURIComponent(prefix)}` : '';
    return request<SuggestResponse>(`/suggest/${sessionId}?${q}`);
  },

  // Get session status
  async sessionStatus(sessionId: string): Promise<SessionStatus> {
    return request<SessionStatus>(`/session/${sessionId}/status`);
  },

  // Delete session
  async deleteSession(sessionId: string): Promise<void> {
    await request(`/session/${sessionId}`, { method: 'DELETE' });
  },

  // Get metrics for a session
  async metrics(sessionId: string): Promise<MetricsResponse> {
    return request<MetricsResponse>(`/metrics/session/${sessionId}`);
  },

  // Health check
  async health(): Promise<{ status: string }> {
    return request<{ status: string }>('/health');
  },
};
