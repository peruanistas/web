import type { Enums, Tables } from '@db/schema';

export type PublicationPreview = Pick<
  Tables<'publications'>,
  | 'id'
  | 'title'
  | 'content'
  | 'upvotes'
  | 'downvotes'
  | 'impression_count'
  | 'image_url'
  | 'created_at'
> & {
  source_id: { id: string, image_icon_url: string, name: string } | null
};

export type VoteType = Enums<'project_vote_type'>;
