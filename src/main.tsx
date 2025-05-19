import React, { useEffect, useState } from 'react';
import { StrictMode } from 'react';
import { Route, Switch } from 'wouter';
import { createRoot } from 'react-dom/client';
import { HomePage } from '@home/pages/home';
import { SignUpPage } from '@auth/pages/signup';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventsPage } from '@events/pages/events';
import { LoginPage } from '@auth/pages/login';
import ProjectsCreatePage from '@projects/pages/project_create';
import ProjectsDetailsPage from '@projects/pages/project_detail';
import EventsCreatePage from '@events/pages/events_create';
import { EventDetailBasic } from '@events/pages/event_detail';
import { NotFoundPage } from '@common/pages/404';
import { CompleteRegisterPage } from '@auth/pages/complete_register';
import { AuthProvider } from '@auth/providers/auth_provider';
import { ProjectsPage } from '@projects/pages/projects';
import { useQueryFavicon } from '@hooks/query_favicon';
import { ArticlePage } from '@news/pages/ArticlePage';
import NewCreatePage from '@news/pages/new_create';

import 'react-day-picker/style.css';
import 'leaflet/dist/leaflet.css';
import './index.css';

export function PeruanistasRouter() {
  useQueryFavicon();

  return (
    <Switch>
      <Route path='/' component={HomePage} />
      <Route path='/signup' component={SignUpPage} />
      <Route path='/login' component={LoginPage} />
      <Route path='/completar-registro' component={CompleteRegisterPage} />

      <Route path='/eventos' component={EventsPage} />
      <Route path='/eventos/crear' component={EventsCreatePage} />
      <Route path='/eventos/:id'>
        {({ id }) => <EventDetailBasic id={id} />}
      </Route>
      <Route path='/proyectos' component={ProjectsPage} />
      <Route path='/proyectos/crear' component={ProjectsCreatePage} />
      <Route path='/proyectos/:id'>
        {({ id }) => <ProjectsDetailsPage id={id} />}
      </Route>
      <Route path='/noticias' component={ArticlePage} />
      <Route path='/noticias/crear' component={NewCreatePage} />
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
}

const queryClient = new QueryClient();

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
          <PeruanistasRouter />
        </AuthProvider>
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
