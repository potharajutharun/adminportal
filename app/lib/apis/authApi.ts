import api from "../api";
import { buildGoogleOAuthUrl, resolveTenantId } from "../auth/config";

export const loginUser = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const registerUser = (
  email: string,
  password: string,
  tenant_id?: number
) =>
  api.post("/auth/register", {
    email,
    password,
    tenant_id: resolveTenantId(tenant_id),
  });

// Server expects refreshToken in body; for cookie-based sessions this can be empty.
export const logoutUser = (refreshToken?: string) =>
  api.post("/auth/logout", refreshToken ? { refreshToken } : {});

export const refreshToken = (refreshTokenValue?: string) =>
  api.post(
    "/auth/refreshtoken",
    refreshTokenValue ? { refreshToken: refreshTokenValue } : {}
  );

export const forgotpassword = (email: string) =>
  api.post("/auth/forgotpassword", { email });

export const resetPassword = (token: string, newPassword: string) =>
  api.post("/auth/resetpassword", {
    token,
    newPassword,
  });

export const verifyEmail = (token: string) =>
  api.post("/auth/verify-email", { token });

export const oauthRedirect = (provider: "google", tenantId?: number) => {
  if (typeof window === "undefined") return;
  if (provider !== "google") {
    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
  window.location.href = buildGoogleOAuthUrl(tenantId);
};

export const exchangeOAuthCode = (code: string, provider: string) =>
  api.post(`/auth/${provider}/callback`, { code });
