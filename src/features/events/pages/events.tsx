import { useQuery } from '@tanstack/react-query';
import { Header } from '@common/components/header';
import { type Tables } from '@db/schema';
import { db } from '@db/client';
import { Layout } from '@common/components/layout';

async function fetchEvents(): Promise<Tables<'events'>[]> {
  const response = await db.from('events').select('*');
  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.data;
}

export function EventsPage() {
  const { data: events = [], isLoading, isError, error } = useQuery({
    queryKey: ['events_list'],
    queryFn: fetchEvents,
  });

  return (
    <Layout>
      <Header />

      {isLoading && <p>Cargando eventos...</p>}

      {isError && (
        <p>Ups! Hubo un error: {(error as Error).message}</p>
      )}

      {!isLoading && !isError && (
        <>
          {events.map((event) => (
            <div key={event.id} className='event-card'>
              <h2>{event.title}</h2>
              <p>{new Date(event.created_at).toLocaleDateString()}</p>
              <p>{event.content}</p>
            </div>
          ))}
        </>
      )}
    </Layout>
  );
}
