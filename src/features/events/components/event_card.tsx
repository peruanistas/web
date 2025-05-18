import { NO_IMAGE_URL } from '@common/constants';
import { PE_DEPARTMENTS, PE_DISTRICTS } from '@common/data/geo';
import { formatDate } from '@common/utils';
import type { EventPreview } from '@events/types';
import ContentLoader from 'react-content-loader';
import { Link } from 'wouter';

type EventCardProps = EventPreview & {};

export function EventCard(event: EventCardProps) {
  return (
    <Link href={`/eventos/${event.id}`}>
      <article className='flex gap-4 mb-4'>
        <img
          width={230}
          height={140}
          // respect width and height
          className='w-[230px] h-[140px] object-cover rounded-md bg-[#ededed]'
          alt={event.title}
          src={event.image_url ?? NO_IMAGE_URL}
        />
        <div>
          <span className='font-semibold text-sm text-primary'>
            {formatDate(event.event_date)}
          </span>
          <h2 className='text-xl mt-1 font-semibold'>{event.title}</h2>
          <p>{PE_DEPARTMENTS[event.geo_department].name}, {PE_DISTRICTS[event.geo_district].name}</p>
          <p className='text-sm text-gray-500 mt-2'>
            {event.attendees} asistentes
          </p>
        </div>
      </article>
    </Link>
  );
}

// From https://skeletonreact.com/
export function EventCardSkeleton() {
  return (
    <article className='flex gap-4 mb-4'>
      <ContentLoader
        speed={2}
        width={600}
        height={140}
        viewBox="0 0 600 140"
        backgroundColor="#ededed"
        foregroundColor="#ecebeb"
      >
        <rect x="81" y="69" rx="0" ry="0" width="1" height="0" />
        <rect x="0" y="0" rx="2" ry="2" width="230" height="140" />
        <rect x="243" y="6" rx="0" ry="0" width="112" height="15" />
        <rect x="243" y="33" rx="0" ry="0" width="283" height="21" />
        <rect x="244" y="70" rx="0" ry="0" width="93" height="14" />
        <rect x="245" y="101" rx="0" ry="0" width="87" height="11" />
      </ContentLoader>
    </article>
  );
}
