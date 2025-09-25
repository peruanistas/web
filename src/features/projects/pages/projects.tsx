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
import {
  ProjectCard,
  ProjectCardSkeleton,
} from '@projects/components/project_card';
import { useLocation } from 'wouter';
import { ProjectFilters } from '@projects/components/projects_filters';
import '@projects/styles/projects_list.scss';
import { CreateButton } from '@common/components/create_button';
import { useScrollReset } from '@common/hooks/useScrollReset';

const PROJECTS_ORDER_OPTIONS = [
  { value: 'event_date_asc', label: 'Por fecha (antiguos)' },
  { value: 'event_date_desc', label: 'Por fecha (nuevos)' },
] as const;

const PROJECTS_RESULTS_PER_PAGE = 6;

export function ProjectsPage() {
  useScrollReset();
  const [department, setDepartment] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('created_at_asc');
  const [, setLocation] = useLocation();

  // Infinite Query
  const {
    data: projectsPages,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ['projects_list', { department, province, district, search, orderBy }],
    queryFn: ({ pageParam = 0 }) =>
      fetchProjectsPaginated({
        department,
        province,
        district,
        search,
        orderBy,
        page: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PROJECTS_RESULTS_PER_PAGE
        ? allPages.length
        : undefined,
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
        title="Proyectos"
        description="Explora todos los proyectos. Participa con tus votos y comentarios."
        variant="project"
        trailing={
          <a
            href="/archive/Sistema de votación y evaluación.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm bg-black/40 rounded m-3 p-2 hover:bg-black/60 transition"
          >
            ¿Cómo podemos votar?
          </a>
        }
      />
      <ContentLayout>
        <main className="py-6">
          <div className="flex flex-col md:items-center justify-between mb-4 gap-4 md:flex-row">
            <SearchBar
              className="flex-1"
              placeholder="Buscar proyectos..."
              onChange={setSearch}
              value={search}
            />
            <div className="flex flex-wrap items-center gap-4">
              <OrderByDropdown
                value={orderBy}
                orderOptions={PROJECTS_ORDER_OPTIONS}
                onChange={setOrderBy}
              />
              <CreateButton onClick={() => setLocation('/proyectos/crear')}>
                Crear proyecto
              </CreateButton>
            </div>
          </div>
          <div className="w-full flex-col md:flex-row md:gap-6">
            {/* Left side */}
            <div className="flex flex-col gap-2">
              <ProjectFilters
                department={department}
                province={province}
                district={district}
                onDepartmentChange={(val) => {
                  setDepartment(val);
                  setProvince('');
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
            <section id="projects-grid" className="w-full">
              {isLoading && (
                <>
                  {Array.from({ length: PROJECTS_RESULTS_PER_PAGE }).map(
                    (_, i) => (
                      <ProjectCardSkeleton key={i} />
                    )
                  )}
                </>
              )}

              {isError && <p>Ups! Hubo un error</p>}

              {!isLoading && !isError && (
                <>
                  {projectsPages?.pages.flat().map((project) => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
                  {projectsPages && projectsPages.pages.flat().length === 0 && (
                    <NoResults title="No se encontraron proyectos" />
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
  department?: string;
  province?: string;
  district?: string;
  search?: string;
  orderBy?: string;
  page: number;
};

async function fetchProjectsPaginated({
  department = '',
  district = '',
  province = '',
  search = '',
  orderBy = 'created_at_desc',
  page = 0,
}: FetchProjectsPaginatedParams): Promise<ProjectPreview[]> {
  const { data, error } = await db.rpc('get_projects_with_votes', {
    p_department: department || undefined,
    p_province: province || undefined,
    p_search: search || undefined,
    p_district: district || undefined,
    p_order_by: orderBy || undefined,
    p_page: page,
    p_page_size: PROJECTS_RESULTS_PER_PAGE,
  });

  if (error) {
    throw new Error('Could not fetch projects');
  }

  return data;
}
