import { db } from '@db/client';
import type { PublicationPreview } from '@home/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef } from 'react';
import { PublicationCard, PublicationCardSkeleton } from '@home/components/publication_card';
import { ContentLayout } from '@common/components/content_layout';
import type { ProjectPreview } from '@projects/types';
import { ProjectCard } from '@projects/components/project_card';
import '@home/styles/feed.scss';
import SectionSubtitle from '@common/components/subtiitle';

const NEWS_RESULTS_PER_PAGE = 8;
const PROJECTS_RESULTS_PER_PAGE = 3;

export function HomeFeed() {
  const { data: publicationPages, fetchNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['damero_paginated_list'],
    queryFn: ({ pageParam }) => {
      const pages = Promise.all([
        fetchMoreNews({ page: pageParam }),
        fetchMoreProjects({ page: pageParam }),
      ] as const);
      return pages;
    },
    initialPageParam: 0,
    getNextPageParam: (_, pages) => pages.length,
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
    <section>
      {
        publicationPages?.pages.map((page, i) => (
          <React.Fragment key={i}>
            <ContentLayout variant='wide'>
              <section className='w-full publications-grid'>
                {
                  page[0].map((publication) => (
                    <PublicationCard {...publication} />
                  ))
                }
              </section>
            </ContentLayout>
            {
              page[1].length > 0 && (
                <section className='w-full bg-gray-200 py-6 my-4'>
                  <ContentLayout variant='wide' className='m-auto'>
                    <div className='mb-3'>
                      <SectionSubtitle title='Proyectos de la comunidad' />
                    </div>
                    <div className='flex projects-grid'>
                      {
                        page[1].map((project) => (
                          <ProjectCard {...project} />
                        ))
                      }
                    </div>
                  </ContentLayout>
                </section>
              )
            }
            {/* Loader skeletons */}
            {/* {
              isFetchingNextPage || isLoading
                ? Array.from({ length: 9 }).map((_, i) => (
                  <PublicationCardSkeleton key={`skeleton-${i}`} />
                ))
                : null
            } */}
          </React.Fragment>
        ))
      }

      {
        (isFetchingNextPage || isLoading || ((publicationPages?.pages.length ?? 0) === 0)) && (
          <ContentLayout variant='wide'>
            <section className='w-full publications-grid'>
              {
                isFetchingNextPage || isLoading
                  ? Array.from({ length: 9 }).map((_, i) => (
                    <PublicationCardSkeleton key={`skeleton-${i}`} />
                  ))
                  : null
              }
            </section>
          </ContentLayout>
        )
      }

      {/* Intersection observer target */}
      <div ref={observerTarget} style={{ height: 1 }} />
    </section>
  );
}

type FetchNewsParams = {
  page: number,
}

async function fetchMoreNews({ page }: FetchNewsParams): Promise<PublicationPreview[]> {
  const offset = page * NEWS_RESULTS_PER_PAGE;

  const { data: nextPageData, error } = await db
    .from('publications')
    .select('*, source_id (id, name, image_icon_url)')
    .order('created_at', { ascending: false })
    .range(offset, offset + NEWS_RESULTS_PER_PAGE - 1);

  if (error) {
    throw new Error(error.message);
  }

  return nextPageData;
}

async function fetchMoreProjects({ page }: FetchNewsParams): Promise<ProjectPreview[]> {
  const offset = page * PROJECTS_RESULTS_PER_PAGE;

  console.log({ page, PROJECTS_RESULTS_PER_PAGE });

  const { data: nextPageData, error } = await db
    .from('projects')
    .select('id, title, image_url, created_at, geo_department, geo_district, impression_count, ioarr_type')
    .order('created_at', { ascending: false })
    .range(offset, offset + PROJECTS_RESULTS_PER_PAGE - 1);

  if (error) {
    throw new Error(error.message);
  }

  return nextPageData;
}
