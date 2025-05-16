import { Redirect, Route, Switch } from 'wouter';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { HomePage } from '@home/pages/home';
import './index.css';
import { SignUpPage } from './features/auth/pages/signup';

export function PeruanistasRoot() {
  return (
    <Switch>
      <Route path='/' component={HomePage} />
      <Route path='/signup' component={SignUpPage} />
      <Route>
        {/* 404 */} <Redirect to='/' />
      </Route>
    </Switch>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PeruanistasRoot />
  </StrictMode>
);
