import { db } from '@db/client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { CalendarFilter, EventLocationFilters } from '@events/components/event_filters';
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

export function ProjectsPage() {
  const [department, setDepartment] = useState('');
  const [district, setDistrict] = useState('');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [orderBy, setOrderBy] = useState('created_at_asc');

  const { data: projects = [], isLoading, isError } = useQuery({
    queryKey: ['projects_list', { department, district, search, dateRange, orderBy }],
    queryFn: () => fetchProjects({ department, district, search, dateRange, orderBy }),
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
          <pre>
            ⚠️⚠️⚠️ NOTA: Este diseño va a cambiar para ser fiel al Figma
          </pre>
          <div className='flex flex-col md:items-center justify-between mb-4 gap-4 md:flex-row'>
            <SearchBar
              className='flex-1'
              placeholder='Buscar proyectos...'
              onChange={setSearch}
              value={search}
            />
            <OrderByDropdown value={orderBy} onChange={setOrderBy} />
            <Button
              variant='red'
              trailing={<Plus size={20} />}
              style={{
                paddingLeft: 8,
                paddingRight: 12,
              }}
            >
              <span>Crear proyecto</span>
            </Button>
          </div>
          <div className='flex w-full py-1 gap-4 flex-col md:flex-row md:gap-6'>
            {/* Left side */}
            <div className='flex flex-col gap-2'>
              <EventLocationFilters
                department={department}
                district={district}
                onDepartmentChange={val => {
                  setDepartment(val);
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
                  {Array
                    // TODO: we may be able to integrate this skeleton result into tanstack query
                    .from({ length: 10 })
                    .map((_, i) => (
                      <div className='mb-4 border-b border-border' key={i}>
                        <ProjectCardSkeleton />
                      </div>
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
                        <div className='mb-4 border-b border-border' key={project.id}>
                          <ProjectCard {...project} />
                        </div>
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
  dateRange,
  orderBy = 'created_at_desc',
}: FetchProjectsParams = {}): Promise<ProjectPreview[]> {
  let query = db
    .from('projects')
    .select('id, title, image_url, created_at, geo_department, geo_district, impression_count');

  if (department) {
    query = query.eq('geo_department', department);
  }
  if (district) {
    query = query.eq('geo_district', district);
  }
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  if (dateRange?.from && dateRange?.to && dateRange?.from != dateRange?.to) {
    const toPlusOne = new Date(dateRange.to);
    toPlusOne.setDate(toPlusOne.getDate() + 1);
    query = query.gte('created_at', dateRange.from.toISOString()).lte('created_at', toPlusOne.toISOString());
  } else if (dateRange?.from) {
    const formPlusOne = new Date(dateRange.from);
    formPlusOne.setDate(formPlusOne.getDate() + 1);
    query = query.gte('created_at', dateRange.from.toISOString()).lte('created_at', formPlusOne.toISOString());
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
