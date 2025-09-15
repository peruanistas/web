import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { MarkdownViewer } from '@common/components/md_viewer';
import { MultiImageViewer } from '@common/components/multi_image_viewer';
import { useAuthStore } from '@auth/store/auth_store';
import { GroupCommentsSection } from '@groups/components/group_comments_section';
import type { GroupPost } from '../types/group_posts';

type GroupPostCardProps = {
  post: GroupPost;
  onVote?: (postId: string, type: 'upvote' | 'downvote') => void;
  onCommentAdded?: () => void;
};

export function GroupPostCard({ post, onVote, onCommentAdded }: GroupPostCardProps) {
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: es,
    });
  };

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (!user || isVoting) return;

    setIsVoting(true);
    try {
      await onVote?.(post.id, type);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author_avatar_url || '/favicon.svg'}
            alt={`${post.author_nombres} ${post.author_apellidos}`}
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {post.author_nombres} {post.author_apellidos}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(post.published_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Post Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-3">
        {post.title}
      </h2>

      {/* Post Content */}
      <div className="mb-4">
        <MarkdownViewer content={post.content} />
      </div>

      {/* Post Images */}
      {post.image_url && post.image_url.length > 0 && (
        <div className="mb-4">
          <MultiImageViewer
            images={post.image_url}
            alt={post.title}
            height={300}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-4">
          {/* Vote Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote('upvote')}
              disabled={!user || isVoting}
              className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-green-50 text-gray-600 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp size={20} />
              <span className="text-sm font-medium">{post.upvotes}</span>
            </button>

            <button
              onClick={() => handleVote('downvote')}
              disabled={!user || isVoting}
              className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown size={20} />
              <span className="text-sm font-medium">{post.downvotes}</span>
            </button>
          </div>

          {/* Comments Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <MessageCircle size={20} />
            <span className="text-sm font-medium">
              {post.comment_count} {post.comment_count === 1 ? 'comentario' : 'comentarios'}
            </span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <GroupCommentsSection
            postId={post.id}
            comments={post.comments}
            onCommentAdded={() => {
              onCommentAdded?.();
              // Optionally refetch the post to get updated comment count
            }}
          />
        </div>
      )}
    </article>
  );
}
