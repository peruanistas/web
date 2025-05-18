import Select from 'react-select';
import { useMemo } from 'react';
import { getDistrictsForDepartment } from '@common/utils';
import { PE_DEPARTMENTS } from '@common/data/geo';

type ProjectFiltersProps = {
  department: string;
  district: string;
  onDepartmentChange: (code: string) => void;
  onDistrictChange: (code: string) => void;
};

const departmentOptions = Object.entries(PE_DEPARTMENTS).map(([code, d]) => ({ value: code, label: d.name }));

export function ProjectFilters({
  department,
  district,
  onDepartmentChange,
  onDistrictChange,
}: ProjectFiltersProps) {
  const districts = useMemo(() =>
    department ? getDistrictsForDepartment(department) : [],
    [department]
  );

  const districtOptions = districts.map(([, d]) => ({ value: d.code, label: d.name }));

  return (
    <div className='flex gap-4 z-10 bg-white pb-2'>
      <div className='mb-3'>
        <Select
          styles={{
            // little hack because the calendar (which is below this component) has a high z-index
            menu: base => ({ ...base, zIndex: 9999 }),
          }}
          options={departmentOptions}
          value={departmentOptions.find(opt => opt.value === department) || null}
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
          isDisabled={!department} // need to select a department first
          placeholder='Todos los distritos'
        />
      </div>
    </div>
  );
}
