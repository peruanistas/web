import type { Tables } from '@db/schema';

export type ProjectPreview = Pick<
  Tables<'projects'>,
  | 'id'
  | 'title'
  | 'ioarr_type'
  | 'image_url'
  | 'impression_count'
  | 'created_at'
  | 'geo_department'
  | 'geo_district'
> & {
  silver_votes: number;
  golden_votes: number;
};

export type ProjectFull = Tables<'projects'> & {
  author_id: Tables<'profiles'>;
};
