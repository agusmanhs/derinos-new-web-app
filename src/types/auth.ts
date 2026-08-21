export interface Permission {
  id: string;
  action: string;
  description: string | null;
  module: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions?: string[]; // Array of action strings
}

export interface User {
  id: string;
  email: string;
  name: string;
  roleId: string | null;
  role?: Role | null;
  avatar?: string;
}

export interface SessionPayload {
  userId: string;
  roleName: string;
  permissions: string[];
  expiresAt: Date;
}
