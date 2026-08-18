import { User } from '@/types/auth';

// Mock database of users mapped to their roles
const MOCK_USERS: User[] = [
  { id: 'usr-1', email: 'admin@derinos.com', name: 'Super Admin', role: 'SUPER_ADMIN', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 'usr-2', email: 'management@derinos.com', name: 'Director', role: 'MANAGEMENT', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 'usr-3', email: 'pm@derinos.com', name: 'Project Manager', role: 'PROJECT_MANAGER', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 'usr-4', email: 'salesmgr@derinos.com', name: 'Sales Manager', role: 'SALES_MANAGER', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 'usr-5', email: 'agent@derinos.com', name: 'Sales Agent', role: 'SALES_AGENT', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 'usr-6', email: 'content@derinos.com', name: 'Content Editor', role: 'CONTENT_MANAGER', avatar: 'https://i.pravatar.cc/150?u=6' },
];

export const AuthService = {
  async authenticate(email: string, password: string): Promise<User | null> {
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock validation: accept any password for valid mock emails
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user && password.length >= 4) {
      return user;
    }

    return null;
  },

  async getUserById(id: string): Promise<User | null> {
    return MOCK_USERS.find(u => u.id === id) || null;
  }
};
