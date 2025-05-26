export type commentItemProps = {
  author: string;
  created_at: string;
  content: string;
};

export function CommentItem({ author, created_at, content }: commentItemProps) {
  return (
    <div className="flex gap-3 py-4">
      <div className="w-8 h-8 rounded-full bg-gray-300" />
      <div className="flex-1">
        <p className="text-sm font-semibold">
          {author} <span className="text-gray-500 font-normal">• {created_at}</span>
        </p>
        <p className="text-sm text-gray-700">{content}</p>
        {/* <button className="mt-1 text-xs text-gray-500 hover:underline">Responder</button> */}
      </div>
    </div>
  );
}
