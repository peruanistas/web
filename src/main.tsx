import { Route, Switch } from 'wouter';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { HomePage } from '@home/pages/home';
import { SignUpPage } from '@auth/pages/signup';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventsPage } from '@events/pages/events';
import { LoginPage } from '@auth/pages/login';
import ProjectsCreatePage from '@projects/pages/project_create';
import ProjectsDetailsPage from '@projects/pages/project_detail';
import EventsCreatePage from '@events/pages/events_create';
import { NotFoundPage } from '@common/pages/404';
import { CompleteRegisterPage } from '@auth/pages/complete_register';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
import './index.css';

export function PeruanistasRoot() {
  return (
    <Switch>
      <Route path='/' component={HomePage} />
      <Route path='/signup' component={SignUpPage} />
      <Route path='/login' component={LoginPage} />
      <Route path='/completar-registro' component={CompleteRegisterPage} />
      <Route path='/eventos' component={EventsPage} />
      <Route path='/eventos/crear' component={EventsCreatePage} />
      <Route path='/proyectos/crear' component={ProjectsCreatePage} />
      <Route path='proyectos/:id' >
        {({ id }) => {
          return <ProjectsDetailsPage id={id} />;
        }
        }
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PeruanistasRoot />
    </QueryClientProvider>
  </StrictMode>
);
