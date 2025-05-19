import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

type AuthStore = {
  user: User | null;
  profileCompleted: boolean;
  setUser: (user: User | null) => void;
  setProfileCompleted: (completed: boolean) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profileCompleted: false,
  setUser: (user) => set({ user }),
  setProfileCompleted: (completed) => set({ profileCompleted: completed }),
  clearUser: () => set({ user: null, profileCompleted: false }),
}));
