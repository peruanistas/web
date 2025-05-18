import { useEffect } from 'react';
import { db } from '@db/client';
import { useAuthStore } from '@auth/store/auth_store';

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await db.auth.getSession();

      setUser(session?.user ?? null);
    };

    const { data: listener } = db.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') clearUser();
      else setUser(session?.user ?? null);
    });

    getSession();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};
