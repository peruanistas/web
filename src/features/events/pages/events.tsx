import { db } from '@db/client';
import { useQuery } from '@tanstack/react-query';
import { CalendarFilter } from '@events/components/calendar_filter';
import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import { PageBanner } from '@common/components/page_banner';
import { ContentLayout } from '@common/components/content_layout';
import { Footer } from '@common/components/footer';
import { EventCard, EventCardSkeleton } from '@events/components/event_card';
import type { EventPreview } from '@events/types';

export function EventsPage() {
  const { data: events = [], isLoading, isError, error } = useQuery({
    queryKey: ['events_list'],
    queryFn: fetchEvents,
  });

  return (
    <Layout>
      <Header />
      <PageBanner
        title='Eventos'
        description='Explora y participa de los eventos disponibles'
      />
      <ContentLayout>
        <article className='flex w-full py-4 gap-4'>
          <div>
            <CalendarFilter />
          </div>
          <section>
            {isLoading && (
              <>
                {Array
                  .from({ length: 10 })
                  .map((_, i) => (
                    <EventCardSkeleton key={i} />
                  ))
                }
              </>
            )}

            {isError && (
              <p>Ups! Hubo un error: {(error as Error).message}</p>
            )}

            {!isLoading && !isError && (
              <>
                {
                  events
                    .map((event) => (
                      <div className='mb-4' key={event.id}>
                        <EventCard {...event} />
                      </div>
                    ))
                }
              </>
            )}
          </section>
        </article>
      </ContentLayout>
      <Footer />
    </Layout>
  );
}


async function fetchEvents(): Promise<EventPreview[]> {
  const response = await db
    .from('events')
    .select('id, title, image_url, created_at, geo_department, geo_district, attendees, event_date');

  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.data;
}


/*
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
