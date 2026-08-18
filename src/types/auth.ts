export type Role = 
  | 'SUPER_ADMIN' 
  | 'MANAGEMENT' 
  | 'PROJECT_MANAGER' 
  | 'SALES_MANAGER' 
  | 'SALES_AGENT' 
  | 'CONTENT_MANAGER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface SessionPayload {
  userId: string;
  role: Role;
  expiresAt: Date;
}
