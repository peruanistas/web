import { NO_IMAGE_URL } from '@common/constants';
import { PE_DEPARTMENTS, PE_DISTRICTS } from '@common/data/geo';
import ContentLoader from 'react-content-loader';
import { FaLocationDot } from 'react-icons/fa6';
import { Link } from 'wouter';
import type { GroupPreview } from '../types';
import { Button } from '@common/components/button';

type GroupCardProps = GroupPreview & {};

export function GroupCard(group: GroupCardProps) {
  return (
    <Link href={`/grupos/${group.id}`}>
      <article className='flex flex-col border border-border rounded-sm bg-white'>
        {/* Group image */}
        <img
          height={240}
          className='object-cover h-[240px] rounded-t-sm bg-[#ededed]'
          alt={group.name}
          src={group.image_url ?? NO_IMAGE_URL}
        />
        {/* Group information */}
        <div className='p-3 min-h-[108px] h-[108px]'>
          <h2 className='font-semibold mb-1 line-clamp-1 break-words'>
            {group.name}
          </h2>
          <span className='mt-1 line-clamp-2 break-words'>
            {group.description}
          </span>
        </div>
        {/* Group footer info */}
        <div className='flex justify-between items-center h-12 bg-gray-100 px-3 py-2 rounded-b-sm border-t border-border'>
          <div className='flex items-center gap-2'>
            <span><FaLocationDot color='#6e6e6e' size={16} /></span>
            <span className='text-sm'>{PE_DEPARTMENTS[group.geo_department].name}, {PE_DISTRICTS[group.geo_district].name}</span>
          </div>
          <div className='flex text-sm items-center justify-center gap-2'>
            <Button variant='red'>
              Unirse
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
}

// From https://skeletonreact.com/
export function GroupCardSkeleton() {
  return (
    <article className='flex gap-4 border border-border rounded-sm'>
      <ContentLoader
        speed={2}
        width={402}
        height={398}
        viewBox="0 0 402 400"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="0" ry="0" width="402" height="240" />
        <rect x="2" y="352" rx="0" ry="0" width="402" height="48" />
        <rect x="10" y="255" rx="0" ry="0" width="380" height="15" />
        <rect x="10" y="276" rx="0" ry="0" width="217" height="16" />
      </ContentLoader>
    </article>
  );
}
