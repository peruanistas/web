import { db } from '@db/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EventLocationFilters } from '@events/components/event_filters';
import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import { PageBanner } from '@common/components/page_banner';
import { ContentLayout } from '@common/components/content_layout';
import { Footer } from '@common/components/footer';
import { EventCard, EventCardSkeleton } from '@events/components/event_card';
import { SearchBar } from '@events/components/search_bar';
import { OrderByDropdown } from '@events/components/order_by_dropdown';
import { NoResults } from '@common/components/no_results';
import type { DateRange } from 'react-day-picker';
import type { EventPreview } from '@events/types';
import { CalendarFilter } from '@events/components/calendar_filter';
import { useLocation } from 'wouter';
import { CreateButton } from '@common/components/create_button';
import { useScrollReset } from '@common/hooks/useScrollReset';

const EVENTS_ORDER_OPTIONS = [
  { value: 'event_date_asc', label: 'Por fecha (cercanos)' },
  { value: 'event_date_desc', label: 'Por fecha (lejanos)' },
] as const;

const EVENTS_RESULTS_PER_PAGE = 6;

export function EventsPage() {
  useScrollReset();
  const [department, setDepartment] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [orderBy, setOrderBy] = useState('event_date_asc');
  const [, setLocation] = useLocation();

  // Infinite Query
  const {
    data: eventsPages,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ['events_list', { department, province, district, search, dateRange, orderBy }],
    queryFn: ({ pageParam = 0 }) =>
      fetchEventsPaginated({ department, province, district, search, dateRange, orderBy, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === EVENTS_RESULTS_PER_PAGE ? allPages.length : undefined,
  });

  // Intersection Observer
  const observerTarget = useRef<HTMLDivElement>(null);

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

    const observer = new IntersectionObserver(handleObserver, options);
    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  return (
    <Layout>
      <Header />
      <PageBanner
        title='Eventos'
        description='Explora y participa de los eventos disponibles'
        variant='event'
      />
      <ContentLayout>
        <main className='py-6'>
          <div className='flex flex-col md:items-center justify-between mb-4 gap-4 md:flex-row'>
            <SearchBar
              className='flex-1'
              placeholder='Buscar eventos...'
              onChange={setSearch}
              value={search}
            />
            <div className='flex flex-wrap items-center gap-4'>
              <OrderByDropdown value={orderBy} orderOptions={EVENTS_ORDER_OPTIONS} onChange={setOrderBy} />
              <CreateButton onClick={() => setLocation('/eventos/crear')}>
                Crear evento
              </CreateButton>
            </div>
          </div>
          <div className='flex w-full py-1 gap-4 flex-col md:flex-row md:gap-6'>
            {/* Left side */}
            <div className='flex flex-col gap-2'>
              <EventLocationFilters
                department={department}
                province={province}
                district={district}
                onDepartmentChange={val => {
                  setDepartment(val);
                  setProvince('');
                  setDistrict('');
                }}
                onProvinceChange={val => {
                  setProvince(val);
                  setDistrict('');
                }}
                onDistrictChange={setDistrict}
              />
              <CalendarFilter value={dateRange} onChange={setDateRange} />
            </div>
            {/* Right side */}
            <section className='w-full'>
              {isLoading && (
                <>
                  {Array.from({ length: EVENTS_RESULTS_PER_PAGE }).map((_, i) => (
                    <div className='mb-4 border-b border-border' key={i}>
                      <EventCardSkeleton />
                    </div>
                  ))}
                </>
              )}

              {isError && (
                <p>Ups! Hubo un error</p>
              )}

              {!isLoading && !isError && (
                <>
                  {eventsPages?.pages.flat().map((event) => (
                    <div className='mb-4 border-b border-border' key={event.id}>
                      <EventCard {...event} />
                    </div>
                  ))}
                  {eventsPages && eventsPages.pages.flat().length === 0 && <NoResults title='No se encontraron eventos' />}
                </>
              )}

              {(isFetchingNextPage) && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div className='mb-4 border-b border-border' key={`skeleton-next-${i}`}>
                      <EventCardSkeleton />
                    </div>
                  ))}
                </>
              )}

              {/* Intersection observer target */}
              <div ref={observerTarget} style={{ height: 1 }} />
            </section>
          </div>
        </main>
      </ContentLayout>
      <Footer />
    </Layout>
  );
}
type FetchEventsPaginatedParams = {
  department?: string,
  province?: string,
  district?: string,
  search?: string,
  dateRange?: DateRange,
  orderBy?: string,
  page: number,
};

async function fetchEventsPaginated({
  department = '',
  province = '',
  district = '',
  search = '',
  dateRange,
  orderBy = 'event_date_desc',
  page = 0,
}: FetchEventsPaginatedParams): Promise<EventPreview[]> {
  const offset = page * EVENTS_RESULTS_PER_PAGE;

  let query = db
    .from('events')
    .select('id, title, image_url, created_at, geo_department, geo_district, attendees, event_date');

  if (department) {
    query = query.eq('geo_department', department);
  }
  if (district) {
    query = query.eq('geo_district', district);
  }
  if (province) {
    query = query.like('geo_district', `${province}%`);
  }
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  if (dateRange?.from && dateRange?.to && dateRange?.from != dateRange?.to) {
    const toPlusOne = new Date(dateRange.to);
    toPlusOne.setDate(toPlusOne.getDate() + 1);
    query = query.gte('event_date', dateRange.from.toISOString()).lte('event_date', toPlusOne.toISOString());
  } else if (dateRange?.from) {
    const formPlusOne = new Date(dateRange.from);
    formPlusOne.setDate(formPlusOne.getDate() + 1);
    query = query.gte('event_date', dateRange.from.toISOString()).lte('event_date', formPlusOne.toISOString());
  }

  switch (orderBy) {
    case 'event_date_asc':
      query = query.order('event_date', { ascending: true });
      break;
    case 'event_date_desc':
      query = query.order('event_date', { ascending: false });
      break;
    case 'created_at_asc':
      query = query.order('created_at', { ascending: true });
      break;
    case 'created_at_desc':
      query = query.order('created_at', { ascending: false });
      break;
    case 'title_asc':
      query = query.order('title', { ascending: true });
      break;
    case 'title_desc':
      query = query.order('title', { ascending: false });
      break;
    default:
      query = query.order('event_date', { ascending: false });
  }

  query = query.range(offset, offset + EVENTS_RESULTS_PER_PAGE - 1);

  const response = await query;

  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.data;
}
