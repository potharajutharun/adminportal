import api from "../api";



// =============== Standard Auth ===============
export const loginUser = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const registerUser = (email: string, password: string) =>
  api.post("/auth/register", { email, password });

export const logoutUser = () => api.post("/auth/logout");

export const refreshToken = () => api.post("/auth/refresh");

export const forgotpassword = (email: string) =>
  api.post("/auth/forgotpassword", { email });

export const resetPassword = (token: string, newPassword: string) =>
  api.post("/auth/resetpassword", {
    token,
    newPassword,
  });

// =============== OAuth ===============
export const oauthRedirect = (
  provider: "google" | "github" | "facebook" | "x"
) => {
  // Simply redirect user to backend OAuth route
  // window.location.href = `${API_BASE}/auth/${provider}`;
};

// Example: backend redirects to `/auth/callback` on success
export const exchangeOAuthCode = (code: string, provider: string) =>
  api.post(`/auth/${provider}/callback`, { code });
