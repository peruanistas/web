import { db } from '@db/client';
import type { PublicationPreview } from '@home/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { PublicationCard, PublicationCardSkeleton } from '@home/components/publication_card';
import { useScrollReset } from '@common/hooks/useScrollReset';
import { ContentLayout } from '@common/components/content_layout';
import '@home/styles/home.scss';

const RESULTS_PER_PAGE = 24;

export function HomeFeed() {
  useScrollReset();

  const { data: publicationPages, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['news_paginated_list'],
    queryFn: ({ pageParam }) => {
      return fetchMoreNews({ page: pageParam });
    },
    initialPageParam: 0,
    getNextPageParam: (_, pages) => pages.length + 1,
  });

  // Intersection Observer for infinite scrolling
  const observerTarget = useRef<HTMLDivElement>(null);

  const hasNextPage = true;

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((handleObserver), options);
    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  return (
    <ContentLayout variant='wide'>
      <section id='publications-grid' className='w-full'>
        {
          publicationPages?.pages.map((page) => (
            page.map((publication) => (
              <PublicationCard {...publication} />
            ))
          ))
        }
        <div ref={observerTarget}>
          <PublicationCardSkeleton />
        </div>
      </section>
    </ContentLayout>
  );
}

type FetchNewsParams = {
  page: number,
}

async function fetchMoreNews({ page }: FetchNewsParams): Promise<PublicationPreview[]> {
  const offset = page * RESULTS_PER_PAGE;

  const { data: nextPageData, error } = await db
    .from('publications')
    .select('*, source_id (id, name, image_icon_url)')
    .range(offset, offset + RESULTS_PER_PAGE - 1);

  if (error) {
    throw new Error(error.message);
  }

  return nextPageData;
}
