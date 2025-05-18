import { db } from '@db/client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
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

const EVENTS_ORDER_OPTIONS = [
  { value: 'event_date_asc', label: 'Por fecha (cercanos)' },
  { value: 'event_date_desc', label: 'Por fecha (lejanos)' },
  // We can add more filters but I don't find them useful for now
] as const;

export function EventsPage() {
  const [department, setDepartment] = useState('');
  const [district, setDistrict] = useState('');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [orderBy, setOrderBy] = useState('event_date_asc');

  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: ['events_list', { department, district, search, dateRange, orderBy }],
    queryFn: () => fetchEvents({ department, district, search, dateRange, orderBy }),
  });

  return (
    <Layout>
      <Header />
      <PageBanner
        title='Eventos'
        description='Explora y participa de los eventos disponibles'
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
            <OrderByDropdown value={orderBy} orderOptions={EVENTS_ORDER_OPTIONS} onChange={setOrderBy} />
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
                        <EventCardSkeleton />
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
                    events
                      .map((event) => (
                        <div className='mb-4 border-b border-border' key={event.id}>
                          <EventCard {...event} />
                        </div>
                      ))
                  }
                  {
                    events.length === 0 && <NoResults title='No se encontraron eventos' />
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

type FetchEventsParams = {
  department?: string,
  district?: string,
  search?: string,
  dateRange?: DateRange,
  orderBy?: string,
};

async function fetchEvents({
  department = '',
  district = '',
  search = '',
  dateRange,
  orderBy = 'event_date_desc',
}: FetchEventsParams = {}): Promise<EventPreview[]> {
  let query = db
    .from('events')
    .select('id, title, image_url, created_at, geo_department, geo_district, attendees, event_date');

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

  const response = await query;

  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.data;
}

/*
TODO: will uncomment this when event details are ready

const position: [number, number] = [-12.052373, -77.060381];

<section style={{ width: '100%', height: 400 }}>
  <MapContainer
    style={{ width: '100%', height: '100%' }}
    zoom={11}
    scrollWheelZoom={true}
    center={position}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
</section>
*/
