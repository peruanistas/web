import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

// inherit from div props
type SearchBarProps = Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> & {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  debounce?: number;
};

export function SearchBar({ value, onChange, debounce = 400, placeholder = 'Buscar...', ...rest }: SearchBarProps) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  useEffect(() => {
    // Debounced search
    const handler = setTimeout(() => {
      if (input !== value) onChange(input);
    }, debounce);
    return () => clearTimeout(handler);
  }, [input, debounce, onChange, value]);

  return (
    <div
      {...rest}
      className={`flex content-between gap-0 bg-white rounded border border-border2 focus-within:border-[#0c1916] ${rest.className}`}
    >
      <input
        className='flex-1 bg-transparent outline-none px-3 py-2 border-0 shadow-none focus:ring-0 focus:outline-none'
        type='search'
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={placeholder}
        aria-label='Buscar eventos'
        autoComplete='on'
        spellCheck={false}
        style={{ boxShadow: 'none', WebkitAppearance: 'none', MozAppearance: 'textfield' }}
      />
      {input && (
        <button
          type='button'
          className='h-full px-2 py-3 flex items-center justify-center bg-transparent text-gray-500 hover:text-gray-800 transition border-0 cursor-pointer'
          aria-label='Limpiar búsqueda'
          onClick={() => { setInput(''); onChange(''); }}
          tabIndex={0}
        >
          <X size={18} />
        </button>
      )}
      <button
        type='button'
        className='h-full px-3 py-3 rounded-r bg-[#e9e9e9] text-gray-700 hover:bg-gray-300 transition border-0 flex items-center justify-center cursor-pointer'
        tabIndex={-1}
        disabled
        aria-label='Buscar'
      >
        <Search size={18} color='black' />
      </button>
    </div>
  );
}
