import { Redirect, Route, Switch } from 'wouter';
import { createRoot } from 'react-dom/client';
import { HomePage } from '@pages/home';
import { StrictMode } from 'react';
import '@styles/index.css';

export function PeruanistasRoot() {
  return (
    <Switch>
      <Route path='/' component={HomePage} />
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
