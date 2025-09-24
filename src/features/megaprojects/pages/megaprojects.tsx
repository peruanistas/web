import { db } from '@db/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import { PageBanner } from '@common/components/page_banner';
import { ContentLayout } from '@common/components/content_layout';
import { Footer } from '@common/components/footer';
import { SearchBar } from '@events/components/search_bar';
import { OrderByDropdown } from '@events/components/order_by_dropdown';
import { NoResults } from '@common/components/no_results';
import type { ProjectPreview } from '@projects/types';
import { ProjectFilters } from '@projects/components/projects_filters';
import '@projects/styles/projects_list.scss';
import { useScrollReset } from '@common/hooks/useScrollReset';
import { MegaprojectCard, MegaprojectCardSkeleton } from '@megaprojects/components/megaproject_card';

const MEGAPROJECTS_ORDER_OPTIONS = [
  { value: 'event_date_asc', label: 'Por fecha (antiguos)' },
  { value: 'event_date_desc', label: 'Por fecha (nuevos)' },
] as const;

const MEGAPROJECTS_RESULTS_PER_PAGE = 6;

export function MegaprojectsPage() {
  useScrollReset();
  const [department, setDepartment] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('created_at_asc');

  // Infinite Query
  const {
    data: megaprojectsPages,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ['megaprojects_list', { department, province, district, search, orderBy }],
    queryFn: ({ pageParam = 0 }) =>
      fetchProjectsPaginated({ department, province, district, search, orderBy, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === MEGAPROJECTS_RESULTS_PER_PAGE ? allPages.length : undefined,
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
        title='Megaproyectos'
        description='Los megaproyectos son creados por nosotros, participa en estos proyectos de gran escala.'
        variant='megaproject'
      />
      <ContentLayout>
        <main className='py-6'>
          <div className='flex flex-col md:items-center justify-between mb-4 gap-4 md:flex-row'>
            <SearchBar
              className='flex-1'
              placeholder='Buscar proyectos...'
              onChange={setSearch}
              value={search}
            />
            <div className='flex flex-wrap items-center gap-4'>
              <OrderByDropdown value={orderBy} orderOptions={MEGAPROJECTS_ORDER_OPTIONS} onChange={setOrderBy} />
            </div>
          </div>
          <div className='w-full flex-col md:flex-row md:gap-6'>
            {/* Left side */}
            <div className='flex flex-col gap-2'>
              <ProjectFilters
                department={department}
                province={province}
                district={district}
                onDepartmentChange={val => {
                  setDepartment(val);
                  setDistrict('');
                }}
                onProvinceChange={(val) => {
                  setProvince(val);
                  setDistrict('');
                }}
                onDistrictChange={setDistrict}
              />
            </div>
            {/* Right side */}
            <section id='projects-grid' className='w-full'>
              {isLoading && (
                <>
                  {Array.from({ length: MEGAPROJECTS_RESULTS_PER_PAGE }).map((_, i) => (
                    <MegaprojectCardSkeleton key={i} />
                  ))}
                </>
              )}

              {isError && (
                <p>Ups! Hubo un error</p>
              )}

              {!isLoading && !isError && (
                <>
                  {megaprojectsPages?.pages.flat().map((project) => (
                    <MegaprojectCard key={project.id} {...project} />
                  ))}
                  {megaprojectsPages && megaprojectsPages.pages.flat().length === 0 && <NoResults title='No se encontraron proyectos' />}
                </>
              )}

              {(isFetchingNextPage) && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <MegaprojectCardSkeleton key={`skeleton-next-${i}`} />
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

type FetchProjectsPaginatedParams = {
  department?: string,
  province?: string,
  district?: string,
  search?: string,
  orderBy?: string,
  page: number,
};

async function fetchProjectsPaginated({
  department = '',
  district = '',
  province = '',
  search = '',
  orderBy = 'created_at_desc',
  page = 0,
}: FetchProjectsPaginatedParams): Promise<ProjectPreview[]> {
  const offset = page * MEGAPROJECTS_RESULTS_PER_PAGE;

  let query = db
    .from('projects')
    .select('id, title, image_url, created_at, geo_department, geo_district, impression_count, ioarr_type')
    .eq('is_megaproject', true);

  if (department) {
    query = query.eq('geo_department', department);
  }
  if (province) {
    query = query.like('geo_district', `${province}%`);
  }
  if (district) {
    query = query.eq('geo_district', district);
  }
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  switch (orderBy) {
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
      query = query.order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + MEGAPROJECTS_RESULTS_PER_PAGE - 1);

  const response = await query;

  if (response.error) {
    throw new Error(response.error.message);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return response.data;
}
