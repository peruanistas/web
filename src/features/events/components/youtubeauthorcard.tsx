import { FaYoutube } from 'react-icons/fa';

type YoutubeAuthorCardProps = {
  avatarUrl: string;
  authorName: string;
  subscribers: string;
  channelUrl: string;
};

export function YoutubeAuthorCard({
  avatarUrl,
  authorName,
  subscribers,
  channelUrl,
}: YoutubeAuthorCardProps) {
  return (
    <div className="flex items-center justify-between bg-gray-50 border rounded-2xl p-4 shadow-sm max-w-3xl">
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl}
          alt={authorName}
          className="w-12 h-12 rounded-full border-2 border-red-200"
        />
        <div>
          <p className="text-sm text-gray-800">
            Por <span className="font-bold">{authorName}</span>
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
            <span className="font-semibold">{subscribers}</span>
            <span>suscriptores en</span>
            <FaYoutube className="text-red-600 text-base ml-1" />
          </div>
        </div>
      </div>

      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full"
      >
        Suscribirse
      </a>
    </div>
  );
}
