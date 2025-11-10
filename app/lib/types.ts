

export interface CreateRoleRequest {
  role_name: string;
  description: string;
}

export interface AssignRoleRequest {
  user_id: number;
  role_id: number;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}
