import { Header } from '@common/components/header';
import { Footer } from '@common/components/footer';
import { Layout } from '@common/components/layout';
import { formatDate2 } from '@common/utils';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { Calendar, ExternalLink, Eye, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@db/client';
import type { Database } from '@db/schema';
import { useScrollReset } from '@common/hooks/useScrollReset';

type Props = {
  id: string;
};

type Publication = Database['public']['Tables']['publications']['Row'] & {
  source_id: Database['public']['Tables']['publication_sources']['Row'] | null;
};

async function fetchPublication(id: string): Promise<Publication | null> {
  const { data, error } = await db
    .from('publications')
    .select('*, source_id (*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export function PublicationDetail({ id }: Props) {
  useScrollReset();

  const { data: publication, isLoading, isError } = useQuery({
    queryKey: ['publication_detail', id],
    queryFn: () => fetchPublication(id),
    enabled: !!id,
  });

  if (isLoading) return <div className="text-center py-10">Cargando...</div>;
  if (isError || !publication) return <div className="text-center py-10 text-red-600">Error al cargar la noticia.</div>;

  return (
    <Layout>
      <Header />
      <main className="max-w-4xl mx-auto px-10 py-10">
        <h1 className="text-3xl font-bold mb-4">
          {publication.title}
        </h1>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {publication.source_id && (
              <>
                <img
                  src={publication.source_id.image_icon_url}
                  alt={publication.source_id.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium text-gray-700">
                  {publication.source_id.name}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate2(publication.published_at)}</span>
          </div>
        </div>

        {publication.image_url && (
          <div className="mb-6">
            <img
              src={publication.image_url}
              alt={publication.title}
              className="w-full h-auto rounded-lg object-cover shadow-sm"
              style={{ maxHeight: '500px' }}
            />
          </div>
        )}

        <div className="prose max-w-none mb-8">
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {parse(DOMPurify.sanitize(publication.content))}
          </div>
        </div>

        {publication.source_id?.name && publication.external_sources_url && (
          <div className="mb-8">
            <a
              href={publication.external_sources_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Ver noticia completa en {publication.source_id.name}
            </a>
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <span className="font-medium">{publication.upvotes}</span>
              <span className="text-gray-600 text-sm">Me gusta</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown className="w-5 h-5 text-red-600" />
              <span className="font-medium">{publication.downvotes}</span>
              <span className="text-gray-600 text-sm">No me gusta</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span className="font-medium">0</span>
              <span className="text-gray-600 text-sm">Comentarios</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{publication.impression_count}</span>
            <span className="text-gray-600 text-sm">Visualizaciones</span>
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  );
}
