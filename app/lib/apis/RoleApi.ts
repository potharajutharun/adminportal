// Assuming this is the content of: ../../lib/apis/RoleApi.ts

import api from "../api";

// Assuming 'api' is an axios instance or similar configured for your backend

// --- Role API Functions ---

export const createRole = (accessToken: string, roleKey: string) =>
  api.post(
    "/roles/create",
    { roleKey },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

export const ListRoles = (accessToken: string) =>
  api.get("/roles/list", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

// FIX: Modified the deleteRole function signature to only require roleId for deletion
// Also, switching to a DELETE method is a standard REST practice for resource removal.
export const deleteRole = (accessToken: string, roleId: number) =>
  api.delete(`/roles/remove/${roleId}`, {
    // If your backend expects a POST to /roles/remove with a body, use the original signature:
    // api.post("/roles/remove", { roleId }, { headers: { Authorization: `Bearer ${accessToken}` } })
    headers: { Authorization: `Bearer ${accessToken}` },
  });