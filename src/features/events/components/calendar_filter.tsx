import { DayPicker, type DateRange } from 'react-day-picker';
import '@events/styles/calendar.scss';

type CalendarFilterProps = {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
};

export function CalendarFilter({ value, onChange }: CalendarFilterProps) {
  return (
    <div className='hidden md:block border border-border rounded-sm bg-white px-4 py-2'>
      <DayPicker
        mode='range'
        selected={value}
        onSelect={onChange}
        showOutsideDays
        classNames={{
          today: 'bg-red-100 text-primary border-primary rounded-1',
          selected: '!bg-primary border-primary rounded-1 text-white',
          range_start: 'bg-primary text-white rounded-l-full',
          range_end: 'bg-primary text-white rounded-r-full',
        }}
      />
    </div>
  );
}
