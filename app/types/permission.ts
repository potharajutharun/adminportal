// app/types/permission.ts

export interface RoleSummary {
  role_id: number;
  role_key: string;
}

export interface Permission {
  id: number;
  permission_key: string;
  resource_name: string;
  is_global: boolean; // For analytical insight
  last_updated: string; // ISO date string
  roles: RoleSummary[]; // List of roles that have this permission
}