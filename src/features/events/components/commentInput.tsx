import { useState } from 'react';

export function CommentInput({ handleAddComment }: { handleAddComment: (comment: {id: number, author: string, timeAgo: string, content: string}) => void }) {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleComment = () => {
    if (inputValue.trim() === '') {
      return;
    }
    console.log('Comment:', inputValue);
    if (typeof handleAddComment === 'function') {
      handleAddComment({
        id:1,
        author: 'sebas',
        timeAgo: 'Hace 1 día',
        content: inputValue,
      });
    }


    setInputValue('');
    setFocused(false);
  };

  return (
    <div className="flex gap-3 py-3 border-b border-border">
      <div className="w-8 h-8 rounded-full bg-gray-300" />
      <input
        type="text"
        placeholder="Únete a la conversación..."
        className={
          'flex-1 border-none outline-none text-sm placeholder-gray-500 ' +
          'overflow-auto resize-none max-h-[4.5em] min-h-[2.25em] ' +
          'break-words whitespace-pre-line'
        }
        style={{
          display: 'block',
          lineHeight: '1.5em',
        }}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onFocus={() => setFocused(true)}
        /* onBlur={() => setFocused(false)} */
      />
      {focused && (
        <div className="flex gap-2">
          <button
            className="text-white px-4 py-1 rounded-md"
            style={{ backgroundColor: 'var(--main-color-bt-bg)' }}
            onClick={handleComment}
          >
            Comentar
          </button>
          <button
            className="px-4 py-1 rounded-md border border-black"
            onClick={() => {
              setFocused(false);
            }}
          >
            cancelar
          </button>
        </div>
      )}
    </div>
  );
}
