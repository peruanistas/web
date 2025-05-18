import React from 'react';
import { LucideArrowRight } from 'lucide-react';

interface ContinueReadingButtonProps {
  onClick: () => void;
}

const ContinueReadingButton: React.FC<ContinueReadingButtonProps> = ({ onClick }) => {
  return (
    <button
          onClick={onClick}
          style={{ backgroundColor: '#c4320a' }}
      className="text-white px-4 py-2 rounded-lg flex items-center"
    >
      Continuar leyendo
      <LucideArrowRight className="ml-2" />
    </button>
  );
};

export default ContinueReadingButton;