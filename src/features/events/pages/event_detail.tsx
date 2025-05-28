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
import { MarkdownViewer } from '@common/components/md_viewer';
import ContentLoader from 'react-content-loader';

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

  if (isLoading) return <Skeleton />;

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
          <div className="mb-1">
            <img
              src={event.image_url}
              alt="Imagen del evento"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        <MarkdownViewer content={event.content}></MarkdownViewer>

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

function Skeleton() {
  return (
    <Layout>
      <Header />
      <main className="max-w-4xl mx-auto px-10 py-10">
        <ContentLoader
          speed={2}
          width="100%"
          height={320}
          viewBox="0 0 700 320"
          backgroundColor="#ededed"
          foregroundColor="#ecebeb"
          style={{ width: '100%', height: 'auto', maxWidth: 700 }}
        >
          {/* Date */}
          <rect x="0" y="0" rx="4" ry="4" width="120" height="18" />
          {/* Title */}
          <rect x="0" y="30" rx="6" ry="6" width="70%" height="32" />
          {/* Author */}
          <rect x="0" y="75" rx="8" ry="8" width="180" height="20" />
          {/* Image */}
          <rect x="0" y="110" rx="12" ry="12" width="100%" height="120" />
          {/* Content lines */}
          <rect x="0" y="240" rx="4" ry="4" width="90%" height="16" />
          <rect x="0" y="260" rx="4" ry="4" width="80%" height="16" />
          <rect x="0" y="280" rx="4" ry="4" width="60%" height="16" />
        </ContentLoader>
      </main>
      <Footer />
    </Layout>
  );
}
