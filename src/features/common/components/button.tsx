type ButtonVariant = 'white' | 'red';

type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  variant?: ButtonVariant;
};

export function Button({ children, type, disabled, style, className, variant }: ButtonProps) {
  let color;
  let backgroundColor;
  let borderColor;

  switch (variant ?? 'white') {
    // tailwind styles
    case 'white':
      color = 'text-gray-900';
      backgroundColor = 'bg-white';
      borderColor = 'border-gray-300';
      break;
    case 'red':
      color = 'text-white';
      backgroundColor = 'bg-primary';
      borderColor = 'border-[#A31818]';
      break;
    default:
      throw new Error(`Unknown Button variant: ${variant}`);
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`px-5 rounded-lg h-10 cursor-pointer border ${color} ${backgroundColor} ${borderColor} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
