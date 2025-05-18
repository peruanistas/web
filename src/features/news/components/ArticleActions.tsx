import React from 'react';
import { LucideShare2, LucideHeart, LucideMessageSquare } from 'lucide-react';

interface ArticleActionsProps {
  onShare?: () => void;
  onFavorite?: () => void;
  onComments?: () => void;
}

const ArticleActions: React.FC<ArticleActionsProps> = ({
  onShare,
  onFavorite,
  onComments,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <button
        onClick={onShare}
        className="bg-white hover:bg-gray-300 w-9 h-9 rounded flex items-center justify-center"
      >
        <LucideShare2 className="w-6 h-6" />
      </button>

      <button
        onClick={onFavorite}
        className="bg-white hover:bg-gray-300 w-9 h-9 rounded flex items-center justify-center"
      >
        <LucideHeart className="w-6 h-6" />
      </button>

      <button
        onClick={onComments}
        className="bg-white-200 hover:bg-gray-300 w-9 h-9 rounded flex items-center justify-center"
      >
        <LucideMessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ArticleActions;