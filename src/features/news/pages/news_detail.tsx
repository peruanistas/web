import { Header } from '@common/components/header';
import { Footer } from '@common/components/footer';
import { Layout } from '@common/components/layout';
import { formatDate2 } from '@common/utils';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { Calendar, ExternalLink, Share2, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@db/client';
import type { Tables } from '@db/schema';
import { useScrollReset } from '@common/hooks/useScrollReset';
import { CommentsSection } from '@common/components/commentsSection';
import { Modal } from '@common/components/modal';
import { Share } from '@common/components/share';
import { useState } from 'react';
import { Button } from '@common/components/button';

type Props = {
  id: string;
};

type Publication = Tables<'publications'> & {
  source_id: Tables<'publication_sources'> | null;
  author_id: Tables<'profiles'> | null;
};

async function fetchPublication(id: string): Promise<Publication | null> {
  const { data, error } = await db
    .from('publications')
    .select('*, source_id (*), author_id (*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export function PublicationDetail({ id }: Props) {
  useScrollReset();

  const [shareOpen, setShareOpen] = useState(false);

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
      <div className="max-w-4xl mx-auto px-6 py-10 flex gap-4">
        <main className='flex-1'>
          <h1 className="text-3xl font-bold mb-4">
            {publication.title}
          </h1>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
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
              {publication.author_id && (
                <>
                  <User strokeWidth={1} />
                  <span className="font-medium text-gray-700">
                    {publication.author_id.nombres} {publication.author_id.apellidos}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate2(publication.published_at)}</span>
            </div>
          </div>

          {publication.image_url && (
            <div className="mb-5">
              <img
                src={publication.image_url}
                alt={publication.title}
                className="w-full h-auto rounded-lg object-cover shadow-sm"
                style={{ maxHeight: '500px' }}
              />
            </div>
          )}

          <div className={'flex space-y-4 justify-between'}>
            <div>
              {/* TODO: Handle upvote, downvote, impressions logic */}
              {/* <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <span className="font-medium">{0}</span>
                  <span className="text-gray-600 text-sm">Me gusta</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-5 h-5 text-red-600" />
                  <span className="font-medium">{0}</span>
                  <span className="text-gray-600 text-sm">No me gusta</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{0}</span>
                  <span className="text-gray-600 text-sm">Visualizaciones</span>
                </div>
              </div> */}
            </div>
            <div>
              <Button
                trailing={<Share2 size={18} />}
                onClick={() => setShareOpen(true)}
              >
                Compartir
              </Button>
            </div>
          </div>

          <div className="prose max-w-none mt-1 mb-8">
            <div className="text-gray-800 text-md leading-relaxed whitespace-pre-wrap">
              {parse(DOMPurify.sanitize(publication.content))}
            </div>
          </div>

          {publication.source_id?.name && publication.external_sources_url && (
            <div className="mb-8">
              <a
                href={publication.external_sources_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Ver noticia completa en {publication.source_id.name}
              </a>
            </div>
          )}
          <CommentsSection handleRefresh={() => { }}></CommentsSection>
        </main>
      </div>
      <Modal open={shareOpen} onClose={() => setShareOpen(false)}>
        <Share url={window.location.href} title={publication?.title} content={publication?.content} />
      </Modal>
      <Footer />
    </Layout>
  );
}
