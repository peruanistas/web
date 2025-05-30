import { db } from '@db/client';
import type { PublicationPreview } from '@home/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef } from 'react';
import { PublicationCard, PublicationCardSkeleton } from '@home/components/publication_card';
import { ContentLayout } from '@common/components/content_layout';
import type { ProjectPreview } from '@projects/types';
import { ProjectCard } from '@projects/components/project_card';
import '@home/styles/feed.scss';
import SectionSubtitle from '@common/components/subtitle';
import { useLocation } from 'wouter';
import { CreateButton } from '@common/components/create_button';
import type { GroupPreview } from '@groups/types';
import { GroupCard } from '@groups/components/group_card';
import { BsFillPeopleFill } from 'react-icons/bs';
import { MdHomeWork } from 'react-icons/md';
import { useScrollReset } from '@common/hooks/useScrollReset';

const NEWS_RESULTS_PER_PAGE = 8;
const PROJECTS_RESULTS_PER_PAGE = 3;
const GROUPS_RESULTS_PER_PAGE = 6;

export function HomeFeed() {
  useScrollReset();
  const [, setLocation] = useLocation();

  const { data: contentPages, fetchNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['damero_paginated_list'],
    queryFn: ({ pageParam }) => {
      const pages = Promise.all([
        fetchMoreNews({ page: pageParam }),
        fetchMoreProjects({ page: pageParam }),
        fetchMoreGroups({ page: pageParam }),
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
      <ContentLayout variant='wide'>
        <div className='flex justify-end'>
          <CreateButton onClick={() => setLocation('/feed/crear')}>
            Crear publicación
          </CreateButton>
        </div>
      </ContentLayout>
      {
        contentPages?.pages.map(([publications, projects, groups], i) => (
          <React.Fragment key={i}>
            <ContentLayout variant='wide'>
              <section className='w-full publications-grid'>
                {
                  publications.map((publication, i) => (
                    <PublicationCard key={i} {...publication} />
                  ))
                }
              </section>
            </ContentLayout>
            {
              projects.length > 0 && (
                <section className='w-full bg-gray-200 py-6 mt-4' style={{
                  paddingBottom: groups.length > 0 ? 0 : undefined,
                }}>
                  <ContentLayout variant='wide' className='m-auto'>
                    <div className='mb-3'>
                      <SectionSubtitle
                        title='Proyectos de la comunidad'
                        icon={<MdHomeWork size={24} />}
                      />
                    </div>
                    <div className='flex projects-grid'>
                      {
                        projects.map((project, i) => (
                          <ProjectCard key={i} {...project} />
                        ))
                      }
                    </div>
                  </ContentLayout>
                </section>
              )
            }
            {
              groups.length > 0 && (
                <section className='w-full bg-gray-200 py-6 mb-4 mt-0'>
                  <ContentLayout variant='wide' className='m-auto'>
                    <div className='mb-3'>
                      <SectionSubtitle
                        title='Grupos peruanistas'
                        icon={<BsFillPeopleFill size={22} />}
                      />
                    </div>
                    <div className='flex projects-grid'>
                      {
                        groups.map((group, i) => (
                          <GroupCard key={i} {...group} />
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
        (isFetchingNextPage || isLoading || ((contentPages?.pages.length ?? 0) === 0)) && (
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

type FetchPaginationParams = {
  page: number,
}

async function fetchMoreNews({ page }: FetchPaginationParams): Promise<PublicationPreview[]> {
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

async function fetchMoreProjects({ page }: FetchPaginationParams): Promise<ProjectPreview[]> {
  const offset = page * PROJECTS_RESULTS_PER_PAGE;

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

async function fetchMoreGroups({ page }: FetchPaginationParams): Promise<GroupPreview[]> {
  const offset = page * GROUPS_RESULTS_PER_PAGE;

  const { data: nextPageData, error } = await db
    .from('groups')
    .select('id, name, description, image_url, created_at, geo_department, geo_district, owner_id(*)')
    .order('id', { ascending: true })
    .range(offset, offset + GROUPS_RESULTS_PER_PAGE - 1);

  if (error) {
    throw new Error(error.message);
  }

  return nextPageData;
}
