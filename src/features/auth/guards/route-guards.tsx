import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@auth/store/auth_store';

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useLocation();
  const { user, profileCompleted } = useAuthStore();

  useEffect(() => {
    const authRoutes = ['/login', '/signup', '/completar-registro'];

    const isOnAuthPage = authRoutes.includes(location);
    const isOnCompleteRegister = location === '/completar-registro';

    if (!user && isOnCompleteRegister) {
      setLocation('/login'); // visitante no accede a /completar-registro
    } else if (user && !profileCompleted && !isOnCompleteRegister) {
      setLocation('/completar-registro'); // forzamos completar registro
    } else if (user && profileCompleted && isOnAuthPage) {
      setLocation('/'); // ya tiene perfil completo, no accede a auth pages
    }
  }, [user, profileCompleted, location, setLocation]);

  return <>{children}</>;
};
