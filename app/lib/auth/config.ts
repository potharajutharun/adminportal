const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

const parseTenantId = (value: string | undefined): number | null => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
};

export const AUTH_API_BASE = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_AUTH_API_BASE ??
    process.env.NEXT_PUBLIC_API_BASE ??
    "http://localhost:4000/api/v1"
);

export const DEFAULT_AUTH_TENANT_ID = parseTenantId(
  process.env.NEXT_PUBLIC_AUTH_TENANT_ID
);

export const resolveTenantId = (overrideTenantId?: number): number => {
  if (overrideTenantId && Number.isInteger(overrideTenantId) && overrideTenantId > 0) {
    return overrideTenantId;
  }
  if (DEFAULT_AUTH_TENANT_ID) {
    return DEFAULT_AUTH_TENANT_ID;
  }
  throw new Error(
    "Tenant ID missing. Set NEXT_PUBLIC_AUTH_TENANT_ID or pass tenant_id explicitly."
  );
};

export const buildGoogleOAuthUrl = (tenantId?: number) => {
  const resolvedTenantId = resolveTenantId(tenantId);
  const query = new URLSearchParams({ tenant_id: String(resolvedTenantId) });
  return `${AUTH_API_BASE}/auth/google?${query.toString()}`;
};
