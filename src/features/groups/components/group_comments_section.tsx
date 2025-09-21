import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronUp, ChevronDown, Reply } from 'lucide-react';
import { db } from '@db/client';
import { useAuthStore } from '@auth/store/auth_store';
import type { GroupPostComment } from '../types/group_posts';
import { toast } from 'sonner';
import { NoAvatarImg } from '@common/components/header';

export type GroupCommentsSectionProps = {
  postId: string;
  comments: GroupPostComment[];
  onCommentAdded?: () => void;
};

export type CommentFormData = {
  content: string;
};

// Helper to build a comment tree
function buildCommentTree(comments: GroupPostComment[]) {
  const map = new Map<string, (GroupPostComment & { replies: GroupPostComment[] })>();
  const roots: (GroupPostComment & { replies: GroupPostComment[] })[] = [];
  comments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] });
  });
  map.forEach((comment) => {
    if (comment.parent_comment_id && map.has(comment.parent_comment_id)) {
      map.get(comment.parent_comment_id)!.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });
  return roots;
}

function CommentTree({
  comments,
  postId,
  replyingTo,
  setReplyingTo,
  onCommentAdded,
}: {
  comments: (GroupPostComment & { replies: GroupPostComment[] })[];
  postId: string;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  onCommentAdded?: () => void;
}) {
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id}>
          <CommentItem
            comment={comment}
            postId={postId}
            onReply={setReplyingTo}
            replyingTo={replyingTo}
            onCommentAdded={onCommentAdded}
          />
          {comment.replies.length > 0 && (
            <div className="ml-6">
              <CommentTree
                comments={comment.replies as (GroupPostComment & { replies: GroupPostComment[] })[]}
                postId={postId}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                onCommentAdded={onCommentAdded}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function GroupCommentsSection({ postId, comments, onCommentAdded }: GroupCommentsSectionProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const commentTree = buildCommentTree(comments);

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      <CommentForm postId={postId} onCommentAdded={onCommentAdded} />

      {/* Comments Tree */}
      {commentTree.length > 0 ? (
        <CommentTree
          comments={commentTree}
          postId={postId}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          onCommentAdded={onCommentAdded}
        />
      ) : (
        <p className="text-gray-500 text-center py-4">
          No hay comentarios todavía. ¡Sé el primero en comentar!
        </p>
      )}
    </div>
  );
}

export type CommentFormProps = {
  postId: string;
  parentCommentId?: string;
  onCommentAdded?: () => void;
  onCancel?: () => void;
  placeholder?: string;
};

export function CommentForm({
  postId,
  parentCommentId,
  onCommentAdded,
  onCancel,
  placeholder = 'Escribe un comentario...'
}: CommentFormProps) {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>();

  const onSubmit = async (data: CommentFormData) => {
    if (!user) {
      toast.error('Debes iniciar sesión para comentar');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await db.rpc('add_group_publication_comment', {
        p_content: data.content,
        p_group_publication_id: postId,
        p_parent_comment_id: parentCommentId,
      });

      if (error) throw error;

      reset();
      toast.success('Comentario agregado exitosamente');
      onCommentAdded?.();
      onCancel?.();
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Error al crear el comentario. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center text-gray-500 py-2">
        <p>Inicia sesión para comentar</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex gap-3">
        {
          user.profile?.avatar_url ? <img
            src={user.profile?.avatar_url}
            alt="Tu avatar"
            className="w-8 h-8 rounded-full object-cover border flex-shrink-0"
          /> : NoAvatarImg
        }
        <div className="flex-1">
          <textarea
            {...register('content', {
              required: 'El comentario no puede estar vacío',
              validate: (value) => value.trim().length > 0 || 'El comentario no puede estar vacío',
            })}
            placeholder={placeholder}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md resize-none ${errors.content ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Comentar'}
        </button>
      </div>
    </form>
  );
}

export type CommentItemProps = {
  comment: GroupPostComment;
  postId: string;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  onCommentAdded?: () => void;
};

export function CommentItem({ comment, postId, onReply, replyingTo, onCommentAdded }: CommentItemProps) {
  const { user } = useAuthStore();
  const [isVoting, setIsVoting] = useState(false);

  const formatDate = (dateString: string) => {
    // Parse as UTC and convert to local time
    const utcDate = new Date(dateString);
    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
    return formatDistanceToNow(localDate, {
      addSuffix: true,
      locale: es,
    });
  };

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (!user || isVoting) return;

    setIsVoting(true);
    try {
      // TODO: Implement comment voting
      console.log('Voting on comment:', comment.id, type);
    } finally {
      setIsVoting(false);
    }
  };

  const indentLevel = Math.min(comment.depth, 3); // Max 3 levels of indentation
  const indentClass = indentLevel > 0 ? `ml-${Math.min(indentLevel * 6, 18)}` : '';

  return (
    <div className={`${indentClass} border-l-2 border-gray-100 pl-4`}>
      <div className="bg-gray-50 rounded-lg p-3">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {
              comment.author_avatar_url ? <img
                src={comment.author_avatar_url}
                alt={`${comment.author_nombres} ${comment.author_apellidos}`}
                className="w-6 h-6 rounded-full object-cover border"
              /> : NoAvatarImg
            }
            <span className="font-medium text-sm text-gray-900">
              {comment.author_nombres} {comment.author_apellidos}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(comment.created_at)}
            </span>
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-gray-800 mb-3 whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Comment Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleVote('upvote')}
              disabled={!user || isVoting}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-green-100 text-gray-600 hover:text-green-600 disabled:opacity-50 text-sm"
            >
              <ChevronUp size={16} />
              <span>{comment.upvotes}</span>
            </button>

            <button
              onClick={() => handleVote('downvote')}
              disabled={!user || isVoting}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-100 text-gray-600 hover:text-red-600 disabled:opacity-50 text-sm"
            >
              <ChevronDown size={16} />
              <span>{comment.downvotes}</span>
            </button>
          </div>

          {user && indentLevel < 3 && (
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-800 text-sm"
            >
              <Reply size={14} />
              <span>Responder</span>
            </button>
          )}
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <CommentForm
              postId={postId}
              parentCommentId={comment.id}
              onCommentAdded={onCommentAdded}
              onCancel={() => onReply('')}
              placeholder={`Responder a ${comment.author_nombres}...`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
