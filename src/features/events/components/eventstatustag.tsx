import { CalendarDays } from 'lucide-react';

export function EventStatusTag() {
  return (
    <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-black text-sm font-medium">
      <span className="bg-red-300 text-red-800 rounded-full p-1 mr-2">
        <CalendarDays className="w-4 h-4" />
      </span>
      Evento terminado
    </div>
  );
}
