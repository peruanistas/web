import type { Tables } from '@db/schema';

export type EventPreview = Tables<'events'>;
export type EventDetail = Tables<'events'>; // Puedes expandir esto si necesitas campos relacionados (como author_id, etc.)