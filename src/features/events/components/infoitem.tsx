import type { ReactNode } from "react";

interface InfoItemProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function InfoItem({ title, icon, children }: InfoItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-bold text-lg border-b-2 border-red-600 w-fit">{title}</span>
      <div className="flex items-center gap-2 text-sm text-neutral-800">
        {icon}
        {children}
      </div>
    </div>
  );
}
