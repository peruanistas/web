import Select from 'react-select';
import { useMemo } from 'react';
import { DEPARTMENT_OPTIONS, DISTRICTS_BY_DEPARTMENT } from '@common/data/geo';

type EventLocationFiltersProps = {
  department: string;
  district: string;
  onDepartmentChange: (code: string) => void;
  onDistrictChange: (code: string) => void;
};

export function EventLocationFilters({
  department,
  district,
  onDepartmentChange,
  onDistrictChange,
}: EventLocationFiltersProps) {
  const districtOptions = useMemo(
    () => (department ? DISTRICTS_BY_DEPARTMENT[department] || [] : []),
    [department]
  );

  return (
    <div className='z-10 bg-white pb-2'>
      <div className='mb-3'>
        <label className='block text-sm mb-1'>Departamento</label>
        <Select
          styles={{
            // little hack because the calendar (which is below this component) has a high z-index
            menu: base => ({ ...base, zIndex: 9999 }),
          }}
          options={DEPARTMENT_OPTIONS}
          value={DEPARTMENT_OPTIONS.find(opt => opt.value === department) || null}
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
          isDisabled={!department}  
          placeholder='Todos'
        />
      </div>
    </div>
  );
}
