import api from "../api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

// =============== Standard Auth ===============
export const loginUser = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const registerUser = (name: string, email: string, password: string) =>
  api.post("/auth/register", { name, email, password });

export const logoutUser = () => api.post("/auth/logout");

export const refreshToken = () => api.post("/auth/refresh");


// =============== OAuth ===============
export const oauthRedirect = (
  provider: "google" | "github" | "facebook" | "x"
) => {
  // Simply redirect user to backend OAuth route
  window.location.href = `${API_BASE}/auth/${provider}`;
};

// Example: backend redirects to `/auth/callback` on success
export const exchangeOAuthCode = (code: string, provider: string) =>
  api.post(`/auth/${provider}/callback`, { code });
