import { BACKEND_URL } from '../config/api.config';

export interface ApiOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiFetch<T = any>(endpoint: string, options: ApiOptions = {}, retries = 1): Promise<T> {
  const { timeoutMs = 12000, headers = {}, ...restOptions } = options;
  
  const url = endpoint.startsWith('http') ? endpoint : `${BACKEND_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'close',
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timer);

    const text = await res.text();
    let data: any = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }
    }

    if (!res.ok) {
      const errorMsg = data?.message || (Array.isArray(data?.message) ? data.message.join(', ') : `HTTP Error ${res.status}`);
      throw new Error(errorMsg);
    }

    return data as T;
  } catch (err: any) {
    clearTimeout(timer);
    
    // Auto retry once on transient iOS connection drops or cold starts
    if (retries > 0 && (err.message?.includes('connection was lost') || err.message?.includes('cannot parse response') || err.message?.includes('Network request failed') || err.name === 'AbortError')) {
      return apiFetch<T>(endpoint, options, retries - 1);
    }

    if (err.name === 'AbortError') {
      throw new Error('Network request timed out. Please check your internet connection.');
    }
    throw err;
  }
}
