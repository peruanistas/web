import { NO_IMAGE_URL } from '@common/constants';
import { formatDate } from '@common/utils';
import type { EventPreview } from '@events/types';
import ContentLoader from 'react-content-loader';

type EventCardProps = EventPreview & {};

export function EventCard(event: EventCardProps) {
  return (
    <article className='flex gap-4'>
      {/* <div className='flex items-center justify-center h-[150px] w-[250px] bg-gray-100'>
        <span className='loader'></span>
      </div> */}
      <img
        width={250}
        height={150}
        src={event.image_url ?? NO_IMAGE_URL}
        className='object-cover rounded-sm'
      />
      <div>
        <p>{formatDate(event.event_date)}</p>
        <h2 className='text-xl font-semibold'>{event.title}</h2>
        <p>{event.geo_department}</p>
      </div>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <article className='flex gap-4'>
      <ContentLoader
        speed={2}
        width={600}
        height={150}
        viewBox="0 0 600 150"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="10" y="6" rx="0" ry="0" width="250" height="150" />
        <rect x="276" y="9" rx="0" ry="0" width="104" height="13" />
        <rect x="277" y="29" rx="0" ry="0" width="245" height="17" />
        <rect x="277" y="55" rx="0" ry="0" width="280" height="94" />
      </ContentLoader>
    </article>
  );
}
