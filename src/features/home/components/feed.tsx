import { db } from '@db/client';
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
import type { EventPreview } from '@events/types';
import { EventCard, EventCardSkeleton } from '@events/components/event_card';
import { BsFillPeopleFill } from 'react-icons/bs';
import { BsCalendarEvent } from 'react-icons/bs';
import { MdHomeWork } from 'react-icons/md';
import { useScrollReset } from '@common/hooks/useScrollReset';
import { ProjectFilters } from '@projects/components/projects_filters';
import { useState } from 'react';
import { useAuthStore } from '@auth/store/auth_store';
import type { Tables } from '@db/schema';
import { WhatIsPeruanistaSection } from './what_is_peruanista_section';
import { WeatherFeedCard } from './weather_card';
import { PodcastsSection } from './podcasts_section';
import { Button } from '@common/components/button';

const NEWS_RESULTS_PER_PAGE = 32;
const PROJECTS_RESULTS_PER_PAGE = 3;
const GROUPS_RESULTS_PER_PAGE = 3;
const EVENTS_RESULTS_PER_PAGE = 3;

export function HomeFeed() {
  useScrollReset();
  const [, setLocation] = useLocation();
  const [department, setDepartment] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const { user } = useAuthStore();
  const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState(false);

  const {
    data: contentPages,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['damero_paginated_list', department, province, district, user?.id],
    queryFn: ({ pageParam }) => {
      const pages = Promise.all([
        fetchMorePublications({ page: pageParam, department, province, district }),
        // [],
        // [],
        fetchMoreProjects({ page: pageParam, department, district }),
        fetchMoreGroups({ page: pageParam, department, district }),
        fetchMoreEvents({ page: pageParam, department, district }),
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
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && isInfiniteScrollEnabled) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, isInfiniteScrollEnabled]
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
      <WhatIsPeruanistaSection />
      <PodcastsSection />
      <ContentLayout variant='wide'>
        <div className='flex justify-between items-center mb-4 gap-4 flex-wrap'>
          <div className='flex-grow'>
            <ProjectFilters
              department={department}
              province={province}
              district={district}
              onDepartmentChange={code => {
                setDepartment(code);
                setDistrict('');
                setIsInfiniteScrollEnabled(false);
              }}
              onProvinceChange={(val) => {
                setProvince(val);
                setDistrict('');
                setIsInfiniteScrollEnabled(false);
              }}
              onDistrictChange={(val) => {
                setDistrict(val);
                setIsInfiniteScrollEnabled(false);
              }} />
          </div>
          <div className='shrink-0'>
            <CreateButton onClick={() => setLocation('/feed/crear')}>
              Crear publicación
            </CreateButton>
          </div>
        </div>

      </ContentLayout>
      {
        contentPages?.pages.map(([publications, projects, groups, events], i) => (
          <React.Fragment key={i}>
            <ContentLayout variant='wide'>
              <section className='w-full publications-grid'>
                {
                  publications.map((publication, ip) => {
                    if (i === 0 && ip === 3) {
                      return <WeatherFeedCard key={`weather-${i}-${ip}`} />;
                    }
                    return <PublicationCard key={publication.id || ip} {...publication} />;
                  })
                }
              </section>
            </ContentLayout>
            {
              projects.length > 0 && (
                <section className='w-full bg-gray-200 py-6 mt-4' style={{
                  paddingBottom: (groups.length > 0 || events.length > 0) ? 0 : undefined,
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
                        projects.map((project, pIdx) => (
                          <ProjectCard key={project.id || pIdx} {...project} />
                        ))
                      }
                    </div>
                  </ContentLayout>
                </section>
              )
            }
            {
              groups.length > 0 && (
                <section className={`w-full bg-gray-200 py-6 ${projects.length > 0 ? 'mt-0' : 'mt-4'} ${events.length > 0 ? 'mb-0' : 'mb-4'}`} style={{
                  paddingBottom: events.length > 0 ? 0 : undefined,
                }}>
                  <ContentLayout variant='wide' className='m-auto'>
                    <div className='mb-3'>
                      <SectionSubtitle
                        title='Grupos peruanistas'
                        icon={<BsFillPeopleFill size={22} />}
                      />
                    </div>
                    <div className='flex projects-grid'>
                      {
                        groups.map((group, gIdx) => (
                          <GroupCard key={group.id || gIdx} {...group} />
                        ))
                      }
                    </div>
                  </ContentLayout>
                </section>
              )
            }
            {
              events.length > 0 && (
                <section className={`w-full bg-gray-200 py-6 mb-4 ${
                  (projects.length > 0 || groups.length > 0) ? 'mt-0' : 'mt-4'
                }`}>                
                  <ContentLayout variant='wide' className='m-auto'>
                    <div className='mb-3'>
                      <SectionSubtitle
                        title='Eventos'
                        icon={<BsCalendarEvent size={24} />}
                      />
                    </div>
                    <div className='flex projects-grid'>
                      {
                        events.map((event, eIdx) => (
                          <EventCard key={event.id || eIdx} {...event} />
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
          <>
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
            {
              (isFetchingNextPage || isLoading) && (
                <section className='w-full bg-gray-200 py-6 mt-4'>
                  <ContentLayout variant='wide' className='m-auto'>
                    <div className='mb-3'>
                      <SectionSubtitle
                        title='Eventos de la comunidad'
                        icon={<BsCalendarEvent size={24} />}
                      />
                    </div>
                    <div className='flex projects-grid'>
                      {Array.from({ length: EVENTS_RESULTS_PER_PAGE }).map((_, i) => (
                        <EventCardSkeleton key={`event-skeleton-${i}`} />
                      ))}
                    </div>
                  </ContentLayout>
                </section>
              )
            }
          </>
        )
      }

      {!isLoading && !isFetchingNextPage && !isInfiniteScrollEnabled && (contentPages?.pages.length ?? 0) > 0 && (
        <div className="flex justify-center w-full py-8">
          <Button 
            onClick={() => {
              setIsInfiniteScrollEnabled(true);
              fetchNextPage();
            }}
          >
            Ver más
          </Button>
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerTarget} style={{ height: 1 }} />
    </section>
  );
}

type FetchPaginationParams = {
  page: number,
  department?: string;
  province?: string;
  district?: string;
  userId?: string;
}

export type RecommendedPublication = Pick<
  Tables<'publications'>,
  | 'id'
  | 'title'
  | 'content'
  | 'visibility'
  | 'upvotes'
  | 'downvotes'
  | 'impression_count'
  | 'image_url'
  | 'published_at'
  | 'created_at'
> & {
  source_id: string;
  source_image_icon_url: string;
  source_name: string;
};

async function fetchMorePublications({ page }: FetchPaginationParams): Promise<RecommendedPublication[]> {
  const offset = page * NEWS_RESULTS_PER_PAGE;

  // let query = db
  //   .from('publications')
  //   .select('id, title, content, visibility, upvotes, downvotes, impression_count, image_url, published_at, created_at, source_id (id, name, image_icon_url)')
  //   .order('created_at', { ascending: false })
  //   .range(offset, offset + NEWS_RESULTS_PER_PAGE - 1)
  const { data, error } = await db.rpc('get_fyp', {
    p_limit: NEWS_RESULTS_PER_PAGE,
    p_offset: offset,
  });

  // Exclude hidden publications if user is logged in
  // if (userId) {
  //   const { data: hiddenPublications } = await db
  //     .from('preferences_hidden_publications')
  //     .select('publication_id')
  //     .eq('user_id', userId);

  //   if (hiddenPublications && hiddenPublications.length > 0) {
  //     const hiddenIds = hiddenPublications.map(h => h.publication_id);
  //     query = query.not('id', 'in', `(${hiddenIds.join(',')})`);
  //   }
  // }

  // const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function fetchMoreEvents({ page, department, district }: FetchPaginationParams): Promise<EventPreview[]> {
  const offset = page * EVENTS_RESULTS_PER_PAGE;

  let query = db
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + EVENTS_RESULTS_PER_PAGE - 1);

  if (department) {
    query = query.eq('geo_department', department);
  }
  if (district) {
    query = query.eq('geo_district', district);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data || [];
}

async function fetchMoreProjects({ page, department, district }: FetchPaginationParams): Promise<ProjectPreview[]> {
  const { data, error } = await db.rpc('get_projects_with_votes', {
    p_department: department || undefined,
    p_province: department || undefined,
    p_district: district || undefined,
    p_page: page,
    p_page_size: PROJECTS_RESULTS_PER_PAGE,
  });

  if (error) {
    throw new Error('Could not fetch projects');
  }

  return data;
}

async function fetchMoreGroups({ page, department, district }: FetchPaginationParams): Promise<GroupPreview[]> {
  const offset = page * GROUPS_RESULTS_PER_PAGE;

  let query = db
    .from('groups')
    .select('id, name, description, image_url, created_at, geo_department, geo_district, owner_id(*)')
    .order('id', { ascending: true })
    .range(offset, offset + GROUPS_RESULTS_PER_PAGE - 1);

  if (department) {
    query = query.eq('geo_department', department);
  }
  if (district) {
    query = query.eq('geo_district', district);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
