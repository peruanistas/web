export type GroupPost = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  group_id: string;
  author_nombres: string;
  author_apellidos: string;
  author_avatar_url: string;
  group_name: string;
  image_url: string[];
  upvotes: number;
  downvotes: number;
  comment_count: number;
  activity_score: number;
  published_at: string;
  created_at: string;
  comments: GroupPostComment[];
};

export type GroupPostComment = {
  id: string;
  content: string;
  author_id: string;
  author_nombres: string;
  author_apellidos: string;
  author_avatar_url: string;
  created_at: string;
  updated_at: string;
  upvotes: number;
  downvotes: number;
  depth: number;
  level: number;
  parent_comment_id: string | null;
  reply_count: number;
};

export type GroupPostCreate = {
  title: string;
  content: string;
  group_id: string;
  image_url?: string[];
};

export type GroupCommentCreate = {
  content: string;
  group_publication_id: string;
  parent_comment_id?: string;
};
