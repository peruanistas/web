import { CommentItem } from './commentItem';
import { CommentInput } from './commentInput';

export function CommentsSection() {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold border-b-2 border-red-600 w-fit mb-4">
        Comentarios <span className="text-gray-500 font-normal">(12)</span>
      </h2>

      <CommentInput />

      <CommentItem
        author="Doris Rojas"
        timeAgo="Hace 1 día"
        content="Lorem ipsum ip dolorum sit amet."
      />
      <CommentItem
        author="Doris Rojas"
        timeAgo="Hace 1 día"
        content="Lorem ipsum ip dolorum sit amet."
      />
      <CommentItem
        author="Doris Rojas"
        timeAgo="Hace 1 día"
        content="Lorem ipsum ip dolorum sit amet."
      />
    </section>
  );
}
