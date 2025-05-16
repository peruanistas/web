import type React from 'react';

type LayoutProps = {
  children?: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <main id='layout-wrapper'>
      {children}
    </main>
  );
}
