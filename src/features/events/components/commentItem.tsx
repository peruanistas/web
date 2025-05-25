import type { ReactNode } from "react";

type Props = {
  author: string;
  timeAgo: string;
  content: ReactNode;
};

export function CommentItem({ author, timeAgo, content }: Props) {
  return (
    <div className="flex gap-3 py-4">
      <div className="w-8 h-8 rounded-full bg-gray-300" />
      <div className="flex-1">
        <p className="text-sm font-semibold">
          {author} <span className="text-gray-500 font-normal">• {timeAgo}</span>
        </p>
        <p className="text-sm text-gray-700">{content}</p>
        {/* <button className="mt-1 text-xs text-gray-500 hover:underline">Responder</button> */}
      </div>
    </div>
  );
}
