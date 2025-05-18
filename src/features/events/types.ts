import type { Tables } from '@db/schema';

export type EventPreview = Pick<
  Tables<'events'>,
  | 'id'
  | 'title'
  | 'image_url'
  | 'event_date'
  | 'attendees'
  | 'created_at'
  | 'geo_department'
  | 'geo_district'
>;
