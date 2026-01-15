import Select from 'react-select';
import { useMemo } from 'react';
import { DEPARTMENT_OPTIONS, PROVINCES_BY_DEPARTMENT, DISTRICTS_BY_PROVINCE } from '@common/data/geo';
import { IOARR_TYPE_NAMES } from '@projects/utils';

const IOARR_TYPE_OPTIONS = Object.entries(IOARR_TYPE_NAMES).map(([value, label]) => ({
  value,
  label,
}));

type ProjectFiltersProps = {
  department: string;
  province: string;
  district: string;
  ioarrType?: string;
  onDepartmentChange: (code: string) => void;
  onProvinceChange: (code: string) => void;
  onDistrictChange: (code: string) => void;
  onIoarrTypeChange?: (type: string) => void;
};

export function ProjectFilters({
  department,
  province,
  district,
  ioarrType,
  onDepartmentChange,
  onProvinceChange,
  onDistrictChange,
  onIoarrTypeChange,
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
    <div className='flex flex-wrap gap-4 z-10 bg-white pb-2'>
      {/* IOARR Type Filter - Featured */}
      {onIoarrTypeChange && (
        <div className='mb-3'>
          <Select
            styles={{
              menu: base => ({ ...base, zIndex: 9999 }),
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? '#f59e0b' : '#fcd34d',
                boxShadow: state.isFocused ? '0 0 0 1px #f59e0b' : 'none',
                '&:hover': {
                  borderColor: '#f59e0b',
                },
              }),
              placeholder: base => ({
                ...base,
                color: '#92400e',
              }),
            }}
            options={IOARR_TYPE_OPTIONS}
            value={IOARR_TYPE_OPTIONS.find(opt => opt.value === ioarrType) || null}
            onChange={opt => onIoarrTypeChange(opt ? opt.value : '')}
            isClearable
            placeholder='Todos los tipos'
          />
        </div>
      )}
      {/* Location Filters */}
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
      <div className='mb-3'>
        <Select
          styles={{
            menu: base => ({ ...base, zIndex: 9999 }),
          }}
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
