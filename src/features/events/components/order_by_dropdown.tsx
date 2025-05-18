import Select from 'react-select';

const ORDER_OPTIONS = [
  { value: 'event_date_asc', label: 'Por fecha (cercanos)' },
  { value: 'event_date_desc', label: 'Por fecha (lejanos)' },
  // We can add more filters but I don't find them useful for now
] as const;

type OrderByDropdownProps = {
  value: string;
  onChange: (filter: string) => void;
};

export function OrderByDropdown({ value, onChange }: OrderByDropdownProps) {
  return (
    <div className='flex items-center gap-2 ml-2'>
      <label htmlFor='order-by'>Ordenar</label>
      <div style={{ minWidth: 160 }}>
        <Select
          classNamePrefix='react-select'
          styles={{
            // little hack because the calendar (which is below this component) has a high z-index
            menu: base => ({ ...base, zIndex: 9999 }),
          }}
          options={ORDER_OPTIONS}
          value={ORDER_OPTIONS.find(opt => opt.value === value) || null}
          onChange={opt => onChange(opt ? opt.value : '')}
          isClearable={false}
          isSearchable={false}
          placeholder='Ordenar'
        />
      </div>
    </div>
  );
}
