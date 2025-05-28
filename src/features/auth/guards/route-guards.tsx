import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@auth/store/auth_store';

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useLocation();
  const { user, profileCompleted, authChecked } = useAuthStore();

  useEffect(() => {
    if (!authChecked) return;

    const authRoutes = ['/login', '/signup', '/completar-registro'];
    const isOnAuthPage = authRoutes.includes(location);
    const isOnCompleteRegister = location === '/completar-registro';

    if (!user && isOnCompleteRegister) {
      setLocation('/login');
    } else if (user && !profileCompleted && !isOnCompleteRegister) {
      setLocation('/completar-registro');
    } else if (user && profileCompleted && isOnAuthPage) {
      setLocation('/');
    }
  }, [user, profileCompleted, authChecked, location, setLocation]);

  if (!authChecked) return null;

  return <>{children}</>;
};
