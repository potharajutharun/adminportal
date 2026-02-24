import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { extractAuthPayload } from "./auth/contracts";
import { AUTH_API_BASE } from "./auth/config";

type RetryableRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({
  baseURL: AUTH_API_BASE,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: AUTH_API_BASE,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const subscribeTokenRefresh = (
  resolve: (token: string) => void,
  reject: (error: unknown) => void
) => {
  refreshSubscribers.push({ resolve, reject });
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((subscriber) => subscriber.resolve(token));
  refreshSubscribers = [];
};

const onRefreshFailed = (error: unknown) => {
  refreshSubscribers.forEach((subscriber) => subscriber.reject(error));
  refreshSubscribers = [];
};

const isRefreshRequest = (request?: RetryableRequestConfig) => {
  return request?.url?.includes("/auth/refreshtoken");
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = (error.config || {}) as RetryableRequestConfig;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest(originalRequest)
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await refreshClient.post("/auth/refreshtoken");
          const { accessToken } = extractAuthPayload(response.data);

          onRefreshed(accessToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${accessToken}`,
          };

          return api(originalRequest);
        } catch (refreshError) {
          onRefreshFailed(refreshError);
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${token}`,
          };
          resolve(api(originalRequest));
        }, reject);
      });
    }

    return Promise.reject(error);
  }
);

export default api;
