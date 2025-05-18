import Select from 'react-select';

type OrderByDropdownProps = {
  value: string;
  orderOptions: readonly { value: string, label: string }[],
  onChange: (filter: string) => void;
};

export function OrderByDropdown({ value, orderOptions, onChange }: OrderByDropdownProps) {
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
          options={orderOptions}
          value={orderOptions.find(opt => opt.value === value) || null}
          onChange={opt => onChange(opt ? opt.value : '')}
          isClearable={false}
          isSearchable={false}
          placeholder='Ordenar'
        />
      </div>
    </div>
  );
}
