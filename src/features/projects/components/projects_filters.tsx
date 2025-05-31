import Select from 'react-select';
import { useMemo } from 'react';
import { DEPARTMENT_OPTIONS, DISTRICTS_BY_DEPARTMENT } from '@common/data/geo';

type ProjectFiltersProps = {
  department: string;
  district: string;
  onDepartmentChange: (code: string) => void;
  onDistrictChange: (code: string) => void;
};

export function ProjectFilters({
  department,
  district,
  onDepartmentChange,
  onDistrictChange,
}: ProjectFiltersProps) {
  const districtOptions = useMemo(
    () => (department ? DISTRICTS_BY_DEPARTMENT[department] || [] : []),
    [department]
  );

  return (
    <div className='flex gap-4 z-10 bg-white pb-2'>
      <div className='mb-3'>
        <Select
          styles={{
            menu: base => ({ ...base, zIndex: 9999 }),
          }}
          options={DEPARTMENT_OPTIONS}
          value={DEPARTMENT_OPTIONS.find(opt => opt.value === department) || null}
          onChange={opt => onDepartmentChange(opt ? opt.value : '')}
          isClearable
          placeholder='Todos los departamentos'
        />
      </div>
      <div>
        <Select
          options={districtOptions}
          value={districtOptions.find(opt => opt.value === district) || null}
          onChange={opt => onDistrictChange(opt ? opt.value : '')}
          isClearable
          isDisabled={!department}
          placeholder='Todos los distritos'
        />
      </div>
    </div>
  );
}
