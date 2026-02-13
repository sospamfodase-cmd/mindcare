import { User } from '../types';

const ADMIN_USER: User = {
  username: 'dra.bianca',
  isAdmin: true
};

// Mock authentication service
// In a real app, this would connect to a backend like Supabase or Firebase
export const authService = {
  login: async (password: string): Promise<User | null> => {
    // Simulating API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const validPassword = import.meta.env.VITE_ADMIN_PASSWORD;
        if (validPassword && password === validPassword) { 
          localStorage.setItem('user', JSON.stringify(ADMIN_USER));
          resolve(ADMIN_USER);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('user');
  }
};
