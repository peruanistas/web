export function CommentInput() {
  return (
    <div className="flex gap-3 py-4 border-b">
      <div className="w-8 h-8 rounded-full bg-gray-300" />
      <input
        type="text"
        placeholder="Únete a la conversación..."
        className="flex-1 border-none outline-none text-sm placeholder-gray-500"
      />
    </div>
  );
}
