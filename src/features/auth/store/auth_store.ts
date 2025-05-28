import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

type AuthStore = {
  user: User | null;
  profileCompleted: boolean;
  authChecked: boolean;
  isConfirmed: boolean;
  setUser: (user: User | null) => void;
  setProfileCompleted: (completed: boolean) => void;
  setAuthChecked: (checked: boolean) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profileCompleted: false,
  authChecked: false,
  isConfirmed: false,
  setUser: (user) => set({ user, isConfirmed: !!user?.confirmed_at }),
  setProfileCompleted: (completed) => set({ profileCompleted: completed }),
  setAuthChecked: (checked) => set({ authChecked: checked }),
  clearUser: () => set({ user: null, profileCompleted: false, authChecked: true, isConfirmed: false }),
}));

