import axios, { AxiosError } from "axios";
import { refreshToken } from "./apis/authApi";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://auth-service-pmo0.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // cookies sent automatically
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper to retry queued requests after refresh
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Axios response interceptor for 401 handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await refreshToken(); // backend reads cookie, issues new token
          const newAccessToken = res.data.accessToken;
          onRefreshed(newAccessToken);
          isRefreshing = false;

          api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (err) {
          isRefreshing = false;
          refreshSubscribers = [];
          // Refresh failed — force logout logic can be handled in AuthContext
          throw err;
        }
      } else {
        // Wait until refresh is done, then retry
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
