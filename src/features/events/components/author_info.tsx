import type { Tables } from '@db/schema';
import { User } from 'lucide-react';
import { Link } from 'wouter';

type YoutubeAuthorCardProps = {
  author: Tables<'profiles'>;
};

export function AuthorInfo({
  author,
}: YoutubeAuthorCardProps) {
  return (
    <div className="flex items-center justify-between pb-4 max-w-3xl">
      <Link to={`/u/${author.id}`} className="flex items-center gap-2">
        {author.avatar_url ? (
          <img
            src={author.avatar_url}
            alt="Avatar de usuario"
            className="w-8 h-8 rounded-full object-cover"
          />
          ) : (
            <div className="flex items-center justify-center border border-[#c5c5c5] rounded-full w-8 h-8">
              <User size={32} strokeWidth={1} />
            </div>
        )}
        <span className="font-medium text-gray-700 hover:text-primary">
          {author.nombres} {author.apellido_paterno} {author.apellido_materno}
        </span>
      </Link>
    </div>
  );
}
