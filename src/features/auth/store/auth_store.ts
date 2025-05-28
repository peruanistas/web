import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

type AuthStore = {
  user: User | null;
  profileCompleted: boolean;
  authChecked: boolean;
  setUser: (user: User | null) => void;
  setProfileCompleted: (completed: boolean) => void;
  setAuthChecked: (checked: boolean) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profileCompleted: false,
  authChecked: false,
  setUser: (user) => set({ user }),
  setProfileCompleted: (completed) => set({ profileCompleted: completed }),
  setAuthChecked: (checked) => set({ authChecked: checked }),
  clearUser: () => set({ user: null, profileCompleted: false, authChecked: true }),
}));
