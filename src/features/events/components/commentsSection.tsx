import { CommentInput } from './commentInput';
import { MessageSquare } from 'lucide-react';

// TODO: implement dynamic comment retrieving and uploading
//       refer to the Trello for details
export function CommentsSection() {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold border-b-2 border-red-600 w-fit mb-4">
        Comentarios <span className="text-gray-500 font-normal">(12)</span>
      </h2>

      <CommentInput />

      <div className='flex flex-col justify-center gap-2 w-full h-48 bg-gray-100'>
      <div className='flex items-center justify-center'>
        <MessageSquare />
      </div>
      <div className='flex flex-col gap-2 items-center justify-center text-center text-gray-500 w-full'>
        <p>
          Pronto podrás comentar en tus publicaciones favoritas.
        </p>
        <p>
          ¡Atento a nuestras siguientes actualizaciones!
        </p>
      </div>
    </div>

      {/* <CommentItem
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
      /> */}
    </section>
  );
}
