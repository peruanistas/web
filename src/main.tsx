import React, { useEffect, useRef, useState } from 'react';
import { StrictMode } from 'react';
import { Route, Switch } from 'wouter';
import { createRoot } from 'react-dom/client';
import { HomePage } from '@home/pages/home';
import { SignUpPage } from '@auth/pages/signup';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventsPage } from '@events/pages/events';
import { LoginPage } from '@auth/pages/login';
import { ProjectsCreatePage } from '@projects/pages/project_create';
import { ProjectsDetailsPage } from '@projects/pages/project_detail';
import { EventsCreatePage } from '@events/pages/events_create';
import { EventDetailBasic } from '@events/pages/event_detail';
import { NotFoundPage } from '@common/pages/404';
import { CompleteRegisterPage } from '@auth/pages/complete_register';
import { AuthProvider } from '@auth/providers/auth_provider';
import { MegaprojectsPage } from '@megaprojects/pages/megaprojects';
import { MegaprojectsDetailsPage } from '@megaprojects/pages/megaproject_detail';
import { ProjectsPage } from '@projects/pages/projects';
import { useQueryFavicon } from '@hooks/query_favicon';
import { NewCreatePage } from '@publications/pages/publication_create';
import { AboutPage } from '@about/pages/about';
import { PublicationDetail } from '@publications/pages/publication_detail';

import 'react-day-picker/style.css';
import 'leaflet/dist/leaflet.css';
import './index.css';
import { RouteGuard } from '@auth/guards/route-guards';
import { Toaster } from 'sonner';
import { ConfirmEmailPage } from '@auth/pages/confirm_email';
import { GroupsPage } from '@groups/pages/groups';
import { GroupsCreatePage } from '@groups/pages/groups_create';
import { GroupDetail } from '@groups/pages/group_detail';
import { ProfilePage } from '@profile/pages/profile';
import { UserProfileDetail } from '@profile/pages/user_profile';
import { AylluPage } from './features/ayllu/pages/ayllu';
// import { DonationWindow } from '@common/components/donation_window';
import { useAuthStore } from '@auth/store/auth_store';
import { db } from '@db/client';

export function PeruanistasRouter() {
  useQueryFavicon();
  const { user } = useAuthStore();
  const retryAuthInterval = useRef<number>(0);

  useEffect(() => {
    const handleFocus = async () => {
      if (user) return; // User is already authenticated

      const storedCredentials = localStorage.getItem('auth_credentials');
      if (!storedCredentials) return;

      try {
        const { email, password } = JSON.parse(storedCredentials);
        const { error } = await db.auth.signInWithPassword({
          email,
          password,
        });

        if (error?.code === 'email_not_confirmed') {
          // Keep trying until the email is confirmed
          return;
        }

        if (error?.code === 'invalid_credentials') {
          // Invalid credentials, remove the credentials
          localStorage.removeItem('auth_credentials');
          return;
        }

        if (!error) {
          localStorage.removeItem('auth_credentials');
        }
      } catch (error) {
        console.error('Error reauthenticating:', error);
      }
    };

    // Add focus event listener
    retryAuthInterval.current = window.setInterval(handleFocus, 3000);

    // Also try immediately when component mounts
    handleFocus();

    return () => {
      clearInterval(retryAuthInterval.current);
    };
  }, [user]);

  return (
    <Switch>
      <Route path='/' component={HomePage} />

      <Route path='/about' component={AboutPage} />

      <Route path='/signup' component={SignUpPage} />
      <Route path='/login' component={LoginPage} />
      <Route path='/confirmar-correo' component={ConfirmEmailPage} />
      <Route path='/completar-registro' component={CompleteRegisterPage} />

      <Route path='/perfil' component={ProfilePage} />
      <Route path="/u/:id">
        {({ id }) => <UserProfileDetail id={id} />}
      </Route>


      <Route path='/eventos' component={EventsPage} />
      <Route path='/eventos/crear' component={EventsCreatePage} />
      <Route path='/eventos/:id'>
        {({ id }) => <EventDetailBasic id={id} />}
      </Route>

      <Route path='/grupos' component={GroupsPage} />
      <Route path='/grupos/crear' component={GroupsCreatePage} />
      <Route path='/grupos/:id'>
        {({ id }) => <GroupDetail id={id} />}
      </Route>

      <Route path='/proyectos' component={ProjectsPage} />
      <Route path='/proyectos/crear' component={ProjectsCreatePage} />
      <Route path='/proyectos/:id'>
        {({ id }) => <ProjectsDetailsPage id={id} />}
      </Route>

      <Route path='/megaproyectos' component={MegaprojectsPage} />
      <Route path='/megaproyectos/:id'>
        {({ id }) => <MegaprojectsDetailsPage id={id} />}
      </Route>

      <Route path='/ayllu' component={AylluPage} />

      <Route path='/feed/crear' component={NewCreatePage} />
      <Route path='/feed/:id'>
        {({ id }) => <PublicationDetail id={id} />}
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
}

const queryClient = new QueryClient();

// https://tanstack.com/query/v4/docs/framework/react/devtools
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

function PeruanistasRoot() {
  const [showDevtools, setShowDevtools] = useState(import.meta.env.DEV); // shown by default in DEV

  useEffect(() => {
    // @ts-expect-error adding a new global function
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouteGuard>
            {/* <DonationWindow /> */}
            <PeruanistasRouter />
          </RouteGuard>
        </AuthProvider>
        <Toaster position="bottom-right" richColors />
        {showDevtools && (
          <React.Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </React.Suspense>
        )}
      </QueryClientProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<PeruanistasRoot />);
