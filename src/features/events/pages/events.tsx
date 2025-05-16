import { useEffect, useState } from 'react';
import { Header } from '@common/components/header';
import { type Tables } from '@db/schema';
import { db } from '@db/client';
import { Layout } from '@common/components/layout';

export function EventsPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Tables<'events'>[]>([]);

  useEffect(() => {
    db.from('events').select('*').then((response) => {
      if (response.error) {
        console.error('Error fetching events:', response.error);
      } else {
        setEvents(response.data);
      }
      setLoading(false);
    });
  });

  return (
    <Layout>
      <Header />
      {loading && <p>Cargando eventos...</p>}

      {loading && events.map((event) => (
        <div key={event.id} className='event-card'>
          <h2>{event.title}</h2>
          <p>{new Date(event.created_at).toLocaleDateString()}</p>
          <p>{event.content}</p>
        </div>
      ))
      }
    </Layout>
  );
}
