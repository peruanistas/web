import { useState, useCallback, useEffect, useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { db } from '@db/client';
import { useAuthStore } from '@auth/store/auth_store';
import type { GroupPost, GroupPostComment } from '../types/group_posts';
import { GroupPostCard } from './group_post_card';
import { GroupPostCreateForm } from './group_post_create';
import { ProjectCardSkeleton } from '@projects/components/project_card';
import { NoAvatarImg } from '@common/components/header';

type GroupFeedProps = {
  groupId: string;
  isMember: boolean;
};

const POSTS_PER_PAGE = 10;

// Database response type for get_group_feed function
interface DatabaseGroupFeedRow {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  image_url: string[] | null;
  published_at: string;
  created_at: string;
  author_id: string;
  author_nombres: string;
  author_apellidos: string;
  author_avatar_url: string;
  group_name: string;
  activity_score: number;
  comments: unknown; // JSONB array from database
}

export function GroupFeed({ groupId, isMember }: GroupFeedProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    data: feedPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['group_feed', groupId],
    queryFn: ({ pageParam = 0 }) => fetchGroupFeed(groupId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === POSTS_PER_PAGE ? allPages.length : undefined,
    enabled: !!groupId,
  });

  // Intersection Observer for infinite scrolling
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  const handlePostCreated = () => {
    setShowCreateForm(false);
    refetch(); // Refetch the feed to show the new post
  };

  const handleCommentAdded = () => {
    // Invalidate the feed query to refresh comment counts
    queryClient.invalidateQueries({ queryKey: ['group_feed', groupId] });
  };

  const handleVote = async (postId: string, type: 'upvote' | 'downvote') => {
    if (!user) return;

    // try {
    //   const { error } = await db.rpc('vote_for_post', {
    //     post_id: postId,
    //     vote_type: type,
    //   });
    //   if (error) throw error;
    //   refetch(); // After voting, refetch to get updated counts
    // } catch (error) {
    //   console.error('Error voting:', error);
    // }
  };

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar las publicaciones del grupo.</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const allPosts = feedPages?.pages.flat() || [];

  return (
    <div className="space-y-6">
      {/* Create Post Section */}
      {isMember && user && (
        <div>
          {showCreateForm ? (
            <GroupPostCreateForm
              groupId={groupId}
              onPostCreated={handlePostCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
              {
                user.profile?.avatar_url ? <img
                  src={user.profile?.avatar_url}
                  alt="Tu avatar"
                  className="w-8 h-8 rounded-full object-cover border flex-shrink-0"
                /> : NoAvatarImg
              }
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex-1 text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-700 transition-colors"
              >
                ¿De qué quieres hablar?
              </button>
            </div>
          )}
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProjectCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        {/* Posts List */}
        {allPosts.map((post) => (
          <GroupPostCard
            key={post.id}
            post={post}
            onVote={handleVote}
            onCommentAdded={handleCommentAdded}
          />
        ))}

        {/* Empty State */}
        {!isLoading && allPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay publicaciones todavía
              </h3>
              <p className="text-gray-600 mb-4">
                {isMember && user
                  ? '¡Sé el primero en compartir algo con el grupo!'
                  : 'Únete al grupo para ver y crear publicaciones.'}
              </p>
              {isMember && user && !showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-md hover:opacity-90"
                >
                  Crear primera publicación
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading more posts */}
        {isFetchingNextPage && (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <ProjectCardSkeleton key={`skeleton-more-${i}`} />
            ))}
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={observerTarget} style={{ height: 1 }} />
      </div>
    </div>
  );
}

async function fetchGroupFeed(groupId: string, page: number): Promise<GroupPost[]> {
  const { data, error } = await db.rpc('get_group_feed', {
    p_group_id: groupId,
    p_limit: POSTS_PER_PAGE,
    p_offset: page * POSTS_PER_PAGE,
    p_max_comments_per_post: 3, // Show first 3 comments per post
  });

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match our GroupPost type
  return (data || []).map((item: DatabaseGroupFeedRow) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    author_id: item.author_id,
    group_id: groupId, // Add the group_id from the parameter
    author_nombres: item.author_nombres,
    author_apellidos: item.author_apellidos,
    author_avatar_url: item.author_avatar_url,
    group_name: item.group_name,
    image_url: item.image_url || [],
    upvotes: item.upvotes,
    downvotes: item.downvotes,
    comment_count: item.comment_count,
    activity_score: item.activity_score,
    published_at: item.published_at,
    created_at: item.created_at,
    comments: parseCommentsFromDatabase(item.comments),
  }));
}

// Helper function to parse comments from database JSONB
function parseCommentsFromDatabase(commentsData: unknown): GroupPostComment[] {
  if (!Array.isArray(commentsData)) {
    return [];
  }

  return commentsData.map((comment: Record<string, unknown>) => ({
    id: String(comment.id || ''),
    content: String(comment.content || ''),
    author_id: String(comment.author_id || ''),
    author_nombres: String(comment.author_nombres || ''),
    author_apellidos: String(comment.author_apellidos || ''),
    author_avatar_url: String(comment.author_avatar_url || ''),
    created_at: String(comment.created_at || ''),
    updated_at: String(comment.updated_at || comment.created_at || ''),
    upvotes: Number(comment.upvotes || 0),
    downvotes: Number(comment.downvotes || 0),
    depth: Number(comment.depth || 0),
    level: Number(comment.level || 0),
    parent_comment_id: comment.parent_comment_id ? String(comment.parent_comment_id) : null,
    reply_count: Number(comment.reply_count || 0),
  }));
}
