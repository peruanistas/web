import { CommentInput } from './commentInput';
import { useEffect, useState } from 'react';
import { db } from '@db/client';
import type { CommentType } from './commentInput';
import { useAuthStore } from '@auth/store/auth_store';
import { CommentItem } from './commentItem';
import { Admonition } from '@common/components/admonition';
import { Info } from 'lucide-react';

type commentType ={
  id: number,
  author_id: string,
  content: string | null,
  created_at: string,
  event_id: string | null,
  project_id: string | null
}

// TODO: implement dynamic comment retrieving and uploading
//       refer to the Trello for details
export function CommentsSection({project_id, event_id}: CommentType) {
  const {user} = useAuthStore();
  const [comments, setcomments]= useState<commentType[]>([]);
  const [author, setAuthor] = useState('');
  const [refresh, setRefresh] = useState(false);

  function handleRefresh() {
    setRefresh(!refresh);
  }

  useEffect(()=>{
  let query = db.from('comments').select('*');

  if (project_id) {
    query = query.eq('project_id', project_id);
  }
  if (event_id) {
    query = query.eq('event_id', event_id);
  }

  query.then((response) => {
    if (response.error) {
      console.log('Error al obtener los comentarios', response.error);
    } else {
      setcomments(response.data);
    }
  });

    if (user) {
      db.from('profiles')
        .select('nombres, apellidos')
        .eq('id', user.id)
        .single()
        .then((response) => {
          if (response.error) {
            console.log('Error al obtener el perfil', response.error);
            alert('Error al obtener el perfil. Por favor, inténtalo de nuevo más tarde.');
          } else {
            console.log('Perfil obtenido', response.data);
            setAuthor(`${response.data.nombres} ${response.data.apellidos}`);
          }
        });
    }

  },[user, refresh]);





  return (

    <section className="mt-8">
      <h2 className="text-lg font-semibold border-b-2 border-red-600 w-fit mb-4">
      Comentarios <span className="text-gray-500 font-normal">({comments.length})</span>
      </h2>

      <CommentInput project_id={project_id} event_id={event_id} handleRefresh={handleRefresh}/>
      {comments.length === 0 && (
      <Admonition title="Se el primero en comentar!" icon={<Info />}/>
      )}
      {comments.map((comment: commentType, index: number) => {
      // Convert ISO string to local date string
      const formattedDate = comment.created_at
        ? new Date(comment.created_at).toLocaleString()
        : new Date().toLocaleString();
      return (
        <CommentItem
        key={index}
        author={author}
        created_at={formattedDate}
        content={comment.content || ''}
        />
      );
      })}
    </section>
  );
}
