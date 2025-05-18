import Select from 'react-select';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import { useMemo } from 'react';
import { getDistrictsForDepartment } from '@common/utils';
import { PE_DEPARTMENTS } from '@common/data/geo';
import '@events/styles/calendar.scss';
import 'react-day-picker/dist/style.css';

type EventLocationFiltersProps = {
  department: string;
  district: string;
  onDepartmentChange: (code: string) => void;
  onDistrictChange: (code: string) => void;
};

const departmentOptions = Object.entries(PE_DEPARTMENTS).map(([code, d]) => ({ value: code, label: d.name }));

export function EventLocationFilters({
  department,
  district,
  onDepartmentChange,
  onDistrictChange,
}: EventLocationFiltersProps) {
  const districts = useMemo(() =>
    department ? getDistrictsForDepartment(department) : [],
    [department]
  );

  const districtOptions = districts.map(([, d]) => ({ value: d.code, label: d.name }));

  return (
    <div className='z-10 bg-white pb-2'>
      <div className='mb-3'>
        <label className='block text-sm mb-1'>Departamento</label>
        <Select
          styles={{
            // little hack because the calendar (which is below this component) has a high z-index
            menu: base => ({ ...base, zIndex: 9999 }),
          }}
          options={departmentOptions}
          value={departmentOptions.find(opt => opt.value === department) || null}
          onChange={opt => onDepartmentChange(opt ? opt.value : '')}
          isClearable
          placeholder='Todos'
        />
      </div>
      <div>
        <label className='block text-sm mb-1'>Distrito</label>
        <Select
          options={districtOptions}
          value={districtOptions.find(opt => opt.value === district) || null}
          onChange={opt => onDistrictChange(opt ? opt.value : '')}
          isClearable
          isDisabled={!department} // need to select a department first
          placeholder='Todos'
        />
      </div>
    </div>
  );
}

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
