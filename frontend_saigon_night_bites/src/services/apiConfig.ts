import axios from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const apiConfig = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: attach access token ──────────────────────────────────────────────
apiConfig.interceptors.request.use((config) => {
  const token = localStorage.getItem('snb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Silent refresh queue ───────────────────────────────────────────────────────
let isRefreshing = false;
let waitQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function drainQueue(error: unknown, token: string | null) {
  waitQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  waitQueue = [];
}

function clearSession() {
  localStorage.removeItem('snb_token');
  localStorage.removeItem('snb_refresh_token');
  localStorage.removeItem('snb_refresh_expires_at');
  localStorage.removeItem('snb_user');
}

// ── Response: handle 401 with silent refresh, toast on forced logout ──────────
apiConfig.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only intercept 401, skip if already retried or is an auth route
    if (
      error.response?.status !== 401 ||
      original._retry ||
      original.url?.includes('/auth/')
    ) {
      return Promise.reject(error);
    }

    // Queue concurrent requests while refresh is in progress
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return apiConfig(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('snb_refresh_token');
    if (!refreshToken) {
      isRefreshing = false;
      clearSession();
      const from = encodeURIComponent(window.location.pathname);
      window.location.replace(`/auth?from=${from}&reason=no_session`);
      return Promise.reject(error);
    }

    try {
      // Use plain axios to avoid triggering this interceptor again
      const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
      const { accessToken, refreshToken: newRefreshToken, refreshExpiresAt } = res.data.data;

      localStorage.setItem('snb_token', accessToken);
      localStorage.setItem('snb_refresh_token', newRefreshToken);
      localStorage.setItem('snb_refresh_expires_at', refreshExpiresAt);

      apiConfig.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      drainQueue(null, accessToken);

      original.headers.Authorization = `Bearer ${accessToken}`;
      return apiConfig(original);
    } catch (refreshErr) {
      drainQueue(refreshErr, null);
      clearSession();
      toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      const from = encodeURIComponent(window.location.pathname);
      setTimeout(() => window.location.replace(`/auth?from=${from}&reason=expired`), 1500);
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);