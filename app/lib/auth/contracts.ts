export interface AuthUser {
  id: number;
  email: string;
  name?: string | null;
  role?: string | null;
  status?: string | null;
  tenant_id?: number;
  [key: string]: unknown;
}

export interface AuthPayload {
  accessToken: string;
  user: AuthUser;
  refreshToken?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isAuthPayload = (value: unknown): value is AuthPayload => {
  if (!isRecord(value)) return false;
  const hasRequiredFields =
    typeof value.accessToken === "string" && isRecord(value.user);
  if (!hasRequiredFields) return false;
  if ("refreshToken" in value && typeof value.refreshToken !== "string") {
    return false;
  }
  return true;
};

export const extractAuthPayload = (raw: unknown): AuthPayload => {
  if (isAuthPayload(raw)) return raw;

  if (isRecord(raw) && isAuthPayload(raw.data)) {
    return raw.data;
  }

  throw new Error("Unexpected auth response format");
};
