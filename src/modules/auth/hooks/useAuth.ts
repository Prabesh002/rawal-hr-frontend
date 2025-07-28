import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { AUTH_STORAGE_KEY } from '../constants';

import { UserResponse } from '../api/models/UserResponse';

interface AuthState {
  isAuthenticated: boolean;
  user: UserResponse | null;
  login: (user: UserResponse) => void;
  logout: () => void;
}

type AuthPersist = PersistOptions<AuthState>;

export const useAuth = create<AuthState, [["zustand/persist", AuthPersist]]>(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
    }
  )
);
