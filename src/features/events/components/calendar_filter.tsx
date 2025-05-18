import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import '@events/styles/calendar.scss';

export function CalendarFilter() {
  const [selected, setSelected] = useState<Date>();

  return (
    <div className='border border-border rounded-sm bg-white px-4 py-2'>
      <DayPicker
        animate
        captionLayout='dropdown'
        mode='single'
        selected={selected}
        onSelect={setSelected}
        required={false}
        startMonth={new Date(2025, 0)}
        classNames={{
          today: 'bg-red-100 text-primary border-primary rounded-1',
          selected: '!bg-primary border-primary rounded-1 text-white',
        }}
      />
    </div>
  );
}
