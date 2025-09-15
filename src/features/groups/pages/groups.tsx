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
import { ProjectCardSkeleton } from '@projects/components/project_card';
import { useLocation } from 'wouter';
import { ProjectFilters } from '@projects/components/projects_filters';
import '@projects/styles/projects_list.scss';
import { CreateButton } from '@common/components/create_button';
import type { GroupPreview } from '@groups/types';
import { GroupCard } from '@groups/components/group_card';
import { useScrollReset } from '@common/hooks/useScrollReset';
import { useAuthStore } from '@auth/store/auth_store';
import { useQuery } from '@tanstack/react-query';


const PROJECTS_ORDER_OPTIONS = [
  { value: 'event_date_asc', label: 'Por fecha (antiguos)' },
  { value: 'event_date_desc', label: 'Por fecha (nuevos)' },
] as const;

const PROJECTS_RESULTS_PER_PAGE = 6;

export function GroupsPage() {
  useScrollReset();
  const [department, setDepartment] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('created_at_asc');
  const [, setLocation] = useLocation();

  const { user } = useAuthStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: membershipData, isLoading: membershipsLoading } = useQuery({
    queryKey: ['group_memberships', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await db
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);
      return data.map((item: { group_id: string }) => item.group_id);
    },
    enabled: !!user,
  });

  const {
    data: projectsPages,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ['groups_list', { department, province, district, search, orderBy }],
    queryFn: ({ pageParam = 0 }) =>
      fetchGroupsPaginated({ department, province, district, search, orderBy, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PROJECTS_RESULTS_PER_PAGE ? allPages.length : undefined,
  });

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
        title='Grupos'
        description='Explora todos los grupos disponibles. Únete y comparte publicaciones con ellos.'
        variant='group'
      />
      <ContentLayout>
        <main className='py-6'>
          <div className='flex flex-col md:items-center justify-between mb-4 gap-4 md:flex-row'>
            <SearchBar
              className='flex-1'
              placeholder='Buscar grupos...'
              onChange={setSearch}
              value={search}
            />
            <div className='flex flex-wrap items-center gap-4'>
              <OrderByDropdown value={orderBy} orderOptions={PROJECTS_ORDER_OPTIONS} onChange={setOrderBy} />
              <CreateButton onClick={() => setLocation('#')}>
                {
                  // TODO: No hay creación de grupos
                }
                Crear grupo
              </CreateButton>
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
                  {Array.from({ length: PROJECTS_RESULTS_PER_PAGE }).map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                  ))}
                </>
              )}

              {isError && (
                <p>Ups! Hubo un error</p>
              )}

              {!isLoading && !isError && (
                <>
                  {projectsPages?.pages.flat().map((project) => (
                    <GroupCard
                      key={project.id}
                      {...project}
                      isMember={membershipData?.includes(project.id)}
                    />
                  ))}
                  {projectsPages && projectsPages.pages.flat().length === 0 && (
                    <NoResults title='No se encontraron proyectos' />
                  )}
                </>
              )}

              {isFetchingNextPage && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ProjectCardSkeleton key={`skeleton-next-${i}`} />
                  ))}
                </>
              )}

              <div ref={observerTarget} style={{ height: 1 }} />
            </section>
          </div>
        </main>
      </ContentLayout>
      <Footer />
    </Layout>
  );
}

type FetchGroupPaginatedParams = {
  department?: string,
  province?: string,
  district?: string,
  search?: string,
  orderBy?: string,
  page: number,
};

async function fetchGroupsPaginated({
  department = '',
  province = '',
  district = '',
  search = '',
  orderBy = 'created_at_desc',
  page = 0,
}: FetchGroupPaginatedParams): Promise<GroupPreview[]> {
  const offset = page * PROJECTS_RESULTS_PER_PAGE;

  let query = db
    .from('groups')
    .select('id, name, description, owner_id(*), image_url, created_at, geo_department, geo_district');

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
    query = query.ilike('name', `%${search}%`);
  }

  switch (orderBy) {
    case 'created_at_asc':
      query = query.order('created_at', { ascending: true });
      break;
    case 'created_at_desc':
      query = query.order('created_at', { ascending: false });
      break;
    case 'name_asc':
      query = query.order('name', { ascending: true });
      break;
    case 'name_desc':
      query = query.order('name', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + PROJECTS_RESULTS_PER_PAGE - 1);

  const response = await query;

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}
