// packages/auth/src/types.ts
export interface User {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
  department_id?: string;
  created_at: string;
}

export interface Session {
  session_token: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role?: string;
  departmentId?: string;
}