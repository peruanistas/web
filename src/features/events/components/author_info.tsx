import type { Tables } from '@db/schema';
import { User } from 'lucide-react';

type YoutubeAuthorCardProps = {
  author: Tables<'profiles'>;
};

export function AuthorInfo({
  author,
}: YoutubeAuthorCardProps) {
  return (
    <div className="flex items-center justify-between pb-4 shadow-sm max-w-3xl">
      <div className="flex items-center gap-3">
        <User strokeWidth={1} />
        <span className="text-sm text-black">
          Creado por: {author.nombres} {author.apellido_paterno} {author.apellido_materno}
        </span>
      </div>
    </div>
  );
}
