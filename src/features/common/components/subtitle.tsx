import type { ReactNode } from 'react';
import React from 'react';

type InfoItemProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export default function SectionSubtitle({ title, icon, children }: InfoItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold text-lg border-b-2 border-red-600 w-fit">
        {title}
      </span>
      <div className="flex items-start gap-3 text-sm text-neutral-800 leading-relaxed">
        {icon && <div className="mt-0.5">{icon}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
}
