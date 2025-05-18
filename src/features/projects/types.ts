import type { Tables } from '@db/schema';

export type ProjectPreview = Pick<
    Tables<'projects'>,
    | 'id'
    | 'title'
    | 'image_url'
    | 'impression_count'
    | 'created_at'
    | 'geo_department'
    | 'geo_district'
>;
