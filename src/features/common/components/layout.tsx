import type React from 'react';

type LayoutProps = React.HTMLAttributes<HTMLElement>;

export function Layout({ children, className, ...rest }: LayoutProps) {
  return (
    <main id="layout-wrapper" className={className} {...rest}>
      {children}
    </main>
  );
}
