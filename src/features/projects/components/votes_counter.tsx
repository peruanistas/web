import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

type VotesCounterProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export function VotesCounter({
  value,
  onChange,
  min = 1,
  max = 10,
  disabled = false
}: VotesCounterProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleIncrement = () => {
    if (!disabled && value < max) {
      const newValue = value + 1;
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (!disabled && value > min) {
      const newValue = value - 1;
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);

    // Only update the actual value if it's a valid number within range
    const numValue = parseInt(inputVal, 10);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    // Reset input to the current valid value if input is invalid
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setInputValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    } else if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className={`
          flex items-center justify-center w-10 h-10 text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors
          ${disabled || value <= min ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label="Decrementar votos"
      >
        <Minus size={18} />
      </button>

      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-16 h-10 text-center border-0 outline-none text-lg font-semibold bg-white
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
        `}
        style={{
          boxShadow: 'none',
          fontSize: '18px'
        }}
        aria-label="Número de votos"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className={`
          flex items-center justify-center w-10 h-10 text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors
          ${disabled || value >= max ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label="Incrementar votos"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
