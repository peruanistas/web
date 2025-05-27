import type { Tables } from '@db/schema';

export type GroupPreview = Pick<
  Tables<'groups'>,
  | 'id'
  | 'name'
  | 'description'
  | 'geo_department'
  | 'geo_district'
  | 'image_url'
  | 'created_at'
> & {
  owner_id: Tables<'profiles'>
};
