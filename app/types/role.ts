export interface Role {
  role_id: number;
  role_key: string;
  tenant_id?: string | null;
  created_at?: Date;
  user_id?: number;
}


export interface CreateRoleRequest {
  role_name: string;
  description: string;
}
