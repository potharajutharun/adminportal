const REFRESH_TOKEN_STORAGE_KEY = "auth_refresh_token";

export const getStoredRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
};

export const setStoredRefreshToken = (token?: string | null) => {
  if (typeof window === "undefined") return;
  if (!token) {
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
};

export const clearStoredRefreshToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};
