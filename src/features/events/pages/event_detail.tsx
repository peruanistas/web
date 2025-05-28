import { Header } from '@common/components/header';
import { Footer } from '@common/components/footer';
import { Layout } from '@common/components/layout';
import { CommentsSection } from '@common/components/commentsSection';
import { AuthorInfo } from '@events/components/author_info';
import { Calendar, MapPin } from 'lucide-react';
import InfoItem from '@events/components/infoitem';
import { useQuery } from '@tanstack/react-query';
import { db } from '@db/client'; // Me daba error importar de la forma tradicional con @ xdddddddddd
import type { Tables } from '@db/schema'; // Paolito si lo puedes cambiar (o alguien)
// Ya debería funcionar bien 👍
import { useScrollReset } from '@common/hooks/useScrollReset';
import { formatDate, formatDate2 } from '@common/utils';
import { PE_DEPARTMENTS, PE_DISTRICTS } from '@common/data/geo';

type Props = {
  id: string;
};

type Event = Tables<'events'> & {
  author_id: Tables<'profiles'>;
};

async function fetchEvent(id: string): Promise<Event | null> {
  const { data, error } = await db
    .from('events')
    .select('*, author_id(*)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export function EventDetailBasic({ id }: Props) {
  useScrollReset();

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event_detail', id],
    queryFn: () => fetchEvent(id),
    enabled: !!id,
  });

  if (isLoading) return <div className="text-center py-10">Cargando...</div>;
  if (isError || !event) return <div className="text-center py-10 text-red-600">Error al cargar el evento.</div>;

  return (
    <Layout>
      <Header />

      <main className="max-w-4xl mx-auto px-10 py-10">
        {/* <div className="mb-4">
          <EventStatusTag />
        </div> */}
        <span className='font-semibold text-sm text-primary'>
          {formatDate2(event.event_date)}
        </span>
        <h1 className="text-3xl font-bold mb-4 mt-1">
          {event.title}
        </h1>
        <AuthorInfo author={event.author_id} />
        {event.image_url && (
          <div className="mb-6">
            <img
              src={event.image_url}
              alt="Imagen del evento"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        <p className="mb-6">
          {event.content}
        </p>

        <div className="space-y-4">
          <InfoItem title="Día y hora" icon={<Calendar className="w-5 h-5 text-neutral-700" />}>
            {formatDate(event.event_date)}
          </InfoItem>

          <InfoItem title="Localización" icon={<MapPin className="w-5 h-5 text-neutral-700" />}>
            {PE_DEPARTMENTS[event.geo_department].name}, {PE_DISTRICTS[event.geo_district].name}
          </InfoItem>

          {/* <div className='flex justify-center items-center flex-grow-0 w-3/4'>
            <img src='https://motor.elpais.com/wp-content/uploads/2022/01/google-maps-22.jpg' alt='Ubicación del proyecto'
              className='max-w-full h-auto rounded-md shadow-md' style={{ maxWidth: 800, width: '100%' }} /></div> */}
        </div>

        <CommentsSection handleRefresh={()=>{}} event_id={event.id} />

      </main>

      <Footer />
    </Layout>
  );
}
