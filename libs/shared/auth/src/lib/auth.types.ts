import { Dispatch, SetStateAction } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  login(): void;
  logout(): void;
  refreshSession(): Promise<void>;
  setUser: Dispatch<SetStateAction<User | null>>;
}
