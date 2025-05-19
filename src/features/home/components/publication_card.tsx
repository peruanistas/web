import { NO_IMAGE_URL } from '@common/constants';
import { formatDate2 } from '@common/utils';
import type { PublicationPreview } from '@home/types';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import ContentLoader from 'react-content-loader';
import { Link } from 'wouter';

type PublicationCardProps = PublicationPreview & {};

export function PublicationCard(publication: PublicationCardProps) {
  return (
    <Link href={`/noticias/${publication.id}`}>
      <article className='flex flex-col border border-border rounded-sm'>
        {/* Project image */}
        <img
          height={200}
          className='object-cover h-[200px] rounded-t-sm bg-[#ededed]'
          alt={publication.title}
          src={publication.image_url ?? NO_IMAGE_URL}
        />
        {/* Project information */}
        <div className='flex flex-col p-3 min-h-[90px] h-[90px]'>
          <h2 className='font-semibold mb-1 line-clamp-2 break-words'>
            {publication.title}
          </h2>
          {/* <span className='font-semibold text-primary mt-1'>
            {formatIoaarType(project.ioarr_type)}
          </span> */}
        </div>
        <div className='flex gap-2 content-between justify-between px-3 pb-2'>
          <span>
            {
              publication.source_id && (
                <div className='flex gap-1 items-center text-sm'>
                  <img width={14} height={14} src={publication.source_id?.image_icon_url} />
                  {publication.source_id?.name}
                </div>
              )
            }
          </span>
          <span className='text-sm'>{formatDate2(publication.created_at)}</span>
        </div>
        {/* Project footer info */}
        <div className='flex gap-4 items-center h-12 bg-gray-100 px-3 py-2 rounded-b-sm border-t border-border'>
          <div className='flex gap-1 items-center'>
            <ThumbsUp color='#6e6e6e' size={14} />
            {publication.upvotes}
          </div>
          <div className='flex gap-1 items-center'>
            <MessageSquare color='#6e6e6e' size={14} />
            0
          </div>
        </div>
      </article>
    </Link>
  );
}

// From https://skeletonreact.com/
export function PublicationCardSkeleton() {
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
