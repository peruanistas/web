type ButtonVariant = 'white' | 'red';

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
};

export function Button({ children, variant }: ButtonProps) {
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
      borderColor = 'border-red-600';
      break;
    default:
      throw new Error(`Unknown Button variant: ${variant}`);
  }

  return (
    <button
      className={`px-5 rounded-lg h-10 border ${color} ${backgroundColor} ${borderColor}`}
    >
      {children}
    </button>
  );
}
