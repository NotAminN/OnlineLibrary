import { toast } from '../utils/toast.js';
import { storage } from '../storage.js';

const RAW_API_URL = import.meta.env.VITE_API_URL;
// When served by Django (same origin), use the relative '/api' path.
// In dev (vite on 5173), the proxy in vite.config.js forwards '/api' to the backend.
const API_URL = (RAW_API_URL !== undefined && String(RAW_API_URL).trim()) || '/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
  }

  getTokens() {
    const tokens = storage.get('lumina:auth:tokens');
    return tokens || null;
  }

  setTokens(tokens) {
    storage.set('lumina:auth:tokens', tokens);
  }

  clearTokens() {
    storage.remove('lumina:auth:tokens');
  }

  async fetch(endpoint, options = {}) {
    let tokens = this.getTokens();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (tokens && tokens.access) {
      headers['Authorization'] = `Bearer ${tokens.access}`;
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && tokens && tokens.refresh) {
      // Try to refresh token
      try {
        const refreshRes = await fetch(`${this.baseUrl}/auth/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: tokens.refresh }),
        });

        if (refreshRes.ok) {
          const newTokens = await refreshRes.json();
          tokens = { ...tokens, access: newTokens.access };
          this.setTokens(tokens);

          // Retry request
          headers['Authorization'] = `Bearer ${tokens.access}`;
          response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
          });
        } else {
          // Refresh failed, clear tokens and redirect to login
          this.clearTokens();
          window.location.href = 'login.html';
        }
      } catch (err) {
        this.clearTokens();
        window.location.href = 'login.html';
      }
    }

    if (!response.ok) {
      let message = 'An error occurred.';
      try {
        const errData = await response.json();
        message = errData.message || errData.detail || JSON.stringify(errData);
      } catch (e) {
        message = response.statusText;
      }
      throw new Error(message);
    }

    // Some endpoints like 204 No Content don't have a body
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  get(endpoint, params = null) {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
           searchParams.append(key, value);
        }
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    return this.fetch(url, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data) {
    return this.fetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.fetch(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
