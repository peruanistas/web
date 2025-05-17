import { Redirect, Route, Switch } from 'wouter';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { HomePage } from '@home/pages/home';
import { SignUpPage } from '@auth/pages/signup';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventsPage } from '@events/pages/events';
import { LoginPage } from '@auth/pages/login';
import ProjectsCreatePage from '@projects/pages/project_create';
import ProjectsDetailsPage from '@projects/pages/details';
import EventsCreatePage from '@events/pages/events_create';
import './index.css';

export function PeruanistasRoot() {
  return (
    <Switch>
      <Route path='/' component={HomePage} />
      <Route path='/signup' component={SignUpPage} />
      <Route path='/login' component={LoginPage} />
      <Route path='/eventos/' component={EventsPage} />
      <Route path='/eventos/crear' component={EventsCreatePage} />
      <Route path='/proyectos/crear' component={ProjectsCreatePage} />
      <Route path='proyectos/:id' >
        {({id}) => {
          return <ProjectsDetailsPage id={id} />;
        }
      }
      </Route>
      <Route>
        {/* 404 */} <Redirect to='/' />
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
