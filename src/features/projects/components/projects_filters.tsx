import Select from 'react-select';
import { useMemo } from 'react';
import { DEPARTMENT_OPTIONS, PROVINCES_BY_DEPARTMENT, DISTRICTS_BY_PROVINCE } from '@common/data/geo';

type ProjectFiltersProps = {
  department: string;
  province: string;
  district: string;
  onDepartmentChange: (code: string) => void;
  onProvinceChange: (code: string) => void;
  onDistrictChange: (code: string) => void;
};

export function ProjectFilters({
  department,
  province,
  district,
  onDepartmentChange,
  onProvinceChange,
  onDistrictChange,
}: ProjectFiltersProps) {
  const provinceOptions = useMemo(
    () => (department ? PROVINCES_BY_DEPARTMENT[department] || [] : []),
    [department]
  );

  const districtOptions = useMemo(
    () => (province ? DISTRICTS_BY_PROVINCE[province] || [] : []),
    [province]
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
      <div className='mb-3'>
        <Select
          styles={{
            menu: base => ({ ...base, zIndex: 9999 }),
          }}
          options={provinceOptions}
          value={provinceOptions.find(opt => opt.value === province) || null}
          onChange={opt => onProvinceChange(opt ? opt.value : '')}
          isClearable
          isDisabled={!department}
          placeholder='Todas las provincias'
        />
      </div>
      <div>
        <Select
          options={districtOptions}
          value={districtOptions.find(opt => opt.value === district) || null}
          onChange={opt => onDistrictChange(opt ? opt.value : '')}
          isClearable
          isDisabled={!province}
          placeholder='Todos los distritos'
        />
      </div>
    </div>
  );
}
