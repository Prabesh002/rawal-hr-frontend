import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { AUTH_STORAGE_KEY } from '../constants';

import { UserResponse } from '../api/models/UserResponse';

interface AuthState {
  isAuthenticated: boolean;
  user: UserResponse | null;
  isAdmin: boolean;
  login: (user: UserResponse) => void;
  logout: () => void;
}

type AuthPersist = PersistOptions<AuthState>;

export const useAuth = create<AuthState, [["zustand/persist", AuthPersist]]>(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isAdmin: false,
      login: (user) => set({ isAuthenticated: true, user, isAdmin: user.is_admin }),
      logout: () => set({ isAuthenticated: false, user: null, isAdmin: false }),
    }),
    {
      name: AUTH_STORAGE_KEY,
    }
  )
);