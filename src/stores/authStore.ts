import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
  degree: 'apprentice' | 'fellowcraft' | 'master';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // TODO: Implement actual API call
    // This is a mock implementation
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      set({
        user: {
          id: 1,
          name: 'Administrator',
          role: 'admin',
          degree: 'master'
        },
        isAuthenticated: true
      });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  }
}));