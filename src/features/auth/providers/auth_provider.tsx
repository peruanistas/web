import { useEffect } from 'react';
import { db } from '@db/client';
import { useAuthStore } from '@auth/store/auth_store';

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, setProfileCompleted, setAuthChecked } = useAuthStore();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await db.auth.getSession();

      const user = session?.user ?? null;
      setUser(user);

      if (user) {
        setUser(user); // Esto actualiza también `isConfirmed`

        const { data, error } = await db
          .from('profiles')
          .select('profile_completed')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfileCompleted(data.profile_completed);
        }
      }
      setAuthChecked(true);
    };

    const { data: listener } = db.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUser(user); // Esto actualiza también `isConfirmed`

      if (user) {
        db.from('profiles')
          .select('profile_completed')
          .eq('id', user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setProfileCompleted(data.profile_completed);
            }
            setAuthChecked(true);
          });
      } else {
        setAuthChecked(true);
      }
    });

    getSession();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};
