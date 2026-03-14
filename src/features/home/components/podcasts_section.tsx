import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Headphones, ExternalLink } from 'lucide-react';
import ContentLoader from 'react-content-loader';
import { ContentLayout } from '@common/components/content_layout';

// Types matching the edge function response
interface VideoData {
  video: {
    id: string;
    title: string;
    description: string;
    url: string;
    watchUrl: string;
    thumbnailUrl: string;
    thumbnailWidth?: number;
    thumbnailHeight?: number;
    publishedAt: string;
    updatedAt: string;
    views?: number;
  };
  channel: {
    id: string;
    title: string;
    url: string;
    iconUrl: string;
  };
  playlist?: {
    id: string;
    title?: string;
  };
  source: {
    type: 'channel' | 'playlist';
    id: string;
  };
}

interface ApiResponse {
  success: true;
  data: {
    videos: VideoData[];
    metadata: {
      totalEntriesFetched: number;
      totalEntriesAfterFilter: number;
      sourcesChecked: number;
    };
  };
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

async function fetchPodcasts(): Promise<VideoData[]> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/fetch_latest_bloggers`, {
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch podcasts');
  }

  const data: ApiResponse = await response.json();

  if (!data.success) {
    throw new Error('API returned unsuccessful response');
  }

  return data.data.videos;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function PodcastCard({ video, channel }: VideoData) {
  const timeAgo = getTimeAgo(new Date(video.publishedAt));

  return (
    <a
      href={video.watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-[320px] bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
          <ExternalLink className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2 leading-tight">
          {video.title}
        </h4>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <img
              src={channel.iconUrl}
              alt={channel.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.title)}&background=random&size=48`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 truncate">{channel.title}</p>
            <p className="text-xs text-gray-400">{timeAgo}</p>
          </div>
        </div>
      </div>
    </a>
  );
}

function PodcastCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[320px] bg-white rounded-xl border border-gray-200 overflow-hidden">
      <ContentLoader
        speed={2}
        width={320}
        height={250}
        viewBox="0 0 320 250"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="0" ry="0" width="320" height="180" />
        <rect x="12" y="192" rx="4" ry="4" width="240" height="14" />
        <rect x="12" y="212" rx="4" ry="4" width="160" height="10" />
        <circle cx="24" cy="238" r="12" />
        <rect x="44" y="232" rx="3" ry="3" width="100" height="10" />
      </ContentLoader>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `hace ${diffMins} min`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays < 7) return `hace ${diffDays}d`;
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} sem`;
  return `hace ${Math.floor(diffDays / 30)} mes`;
}

export function PodcastsSection() {
  const [shuffledPodcasts, setShuffledPodcasts] = useState<VideoData[]>([]);

  const { data: podcasts, isLoading, isError } = useQuery({
    queryKey: ['podcasts_feed'],
    queryFn: fetchPodcasts,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });

  // Shuffle podcasts when data changes
  useEffect(() => {
    if (podcasts && podcasts.length > 0) {
      setShuffledPodcasts(shuffleArray(podcasts));
    }
  }, [podcasts]);

  if (isError) {
    return null; // Silently fail if podcasts can't be loaded
  }

  return (
    <section className="w-full py-6 mb-6 bg-gradient-to-r from-purple-50 via-white to-purple-50 border-y border-purple-100">
      <ContentLayout variant="wide" className="m-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Headphones className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Podcasts Independientes</h3>
            <p className="text-sm text-gray-500">
              Creadores de contenido político que informan desde sus propias plataformas
            </p>
          </div>
        </div>

        {/* Scrollable container */}
        <div className="relative overflow-hidden">

          <div className="flex gap-4 py-2 overflow-x-auto scrollbar-hide">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <PodcastCardSkeleton key={`skeleton-${i}`} />
              ))
            ) : (
              shuffledPodcasts.map((podcast) => (
                <PodcastCard
                  key={podcast.video.id}
                  {...podcast}
                />
              ))
            )}
          </div>
        </div>

        {/* Mobile scroll hint */}
        <p className="text-xs text-gray-400 text-center mt-2 md:hidden">
          Desliza para ver más →
        </p>
      </ContentLayout>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
