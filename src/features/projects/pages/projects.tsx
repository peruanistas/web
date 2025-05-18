import { db } from '@db/client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import { PageBanner } from '@common/components/page_banner';
import { ContentLayout } from '@common/components/content_layout';
import { Footer } from '@common/components/footer';
import { SearchBar } from '@events/components/search_bar';
import { OrderByDropdown } from '@events/components/order_by_dropdown';
import { NoResults } from '@common/components/no_results';
import type { DateRange } from 'react-day-picker';
import { Button } from '@common/components/button';
import { Plus } from 'lucide-react';
import type { ProjectPreview } from '@projects/types';
import { ProjectCard, ProjectCardSkeleton } from '@projects/components/project_card';
import { useLocation } from 'wouter';
import { ProjectFilters } from '@projects/components/projects_filters';
import '@projects/styles/projects_list.scss';

export function ProjectsPage() {
  const [department, setDepartment] = useState('');
  const [district, setDistrict] = useState('');
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('created_at_asc');

  const [, setLocation] = useLocation();

  const { data: projects = [], isLoading, isError } = useQuery({
    queryKey: ['projects_list', { department, district, search, orderBy }],
    queryFn: () => fetchProjects({ department, district, search, orderBy }),
  });

  return (
    <Layout>
      <Header />
      <PageBanner
        title='Proyectos'
        description='Explora todos los proyectos disponibles, y participa con tus votos y comentarios.'
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
              <OrderByDropdown value={orderBy} onChange={setOrderBy} />
              <Button
                variant='red'
                trailing={<Plus size={20} />}
                onClick={() => {
                  setLocation('/proyectos/crear');
                }}
                style={{
                  paddingLeft: 8,
                  paddingRight: 12,
                  whiteSpace: 'nowrap',
                }}
              >
                <span>Crear proyecto</span>
              </Button>
            </div>
          </div>
          <div className='w-full flex-col md:flex-row md:gap-6'>
            {/* Left side */}
            <div className='flex flex-col gap-2'>
              <ProjectFilters
                department={department}
                district={district}
                onDepartmentChange={val => {
                  setDepartment(val);
                  setDistrict('');
                }}
                onDistrictChange={setDistrict}
              />
            </div>
            {/* Right side */}
            <section id='projects-grid' className='w-full'>
              {isLoading && (
                <>
                  {Array
                    // TODO: we may be able to integrate this skeleton result into tanstack query
                    .from({ length: 9 })
                    .map(() => (
                      <ProjectCardSkeleton />
                    ))
                  }
                </>
              )}

              {isError && (
                // TODO: make this error more memorable
                <p>Ups! Hubo un error</p>
              )}

              {!isLoading && !isError && (
                <>
                  {
                    projects
                      .map((project) => (
                        <ProjectCard {...project} />
                      ))
                  }
                  {
                    projects.length === 0 && <NoResults title='No se encontraron proyectos' />
                  }
                </>
              )}
            </section>
          </div>
        </main>
      </ContentLayout>
      <Footer />
    </Layout>
  );
}

type FetchProjectsParams = {
  department?: string,
  district?: string,
  search?: string,
  dateRange?: DateRange,
  orderBy?: string,
};

async function fetchProjects({
  department = '',
  district = '',
  search = '',
  orderBy = 'created_at_desc',
}: FetchProjectsParams = {}): Promise<ProjectPreview[]> {
  let query = db
    .from('projects')
    .select('id, title, image_url, created_at, geo_department, geo_district, impression_count, ioarr_type');

  if (department) {
    query = query.eq('geo_department', department);
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

  const response = await query;

  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.data;
}
