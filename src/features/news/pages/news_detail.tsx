import { Header, HEADER_FULL_HEIGHT } from '@common/components/header';
import { Footer } from '@common/components/footer';
import { Layout } from '@common/components/layout';
import { formatDate2, mergeAndShuffle } from '@common/utils';
import { Calendar, ExternalLink, Share2, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@db/client';
import type { Tables } from '@db/schema';
import { useScrollReset } from '@common/hooks/useScrollReset';
import { CommentsSection } from '@common/components/commentsSection';
import { Modal } from '@common/components/modal';
import { Share } from '@common/components/share';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@common/components/button';
import ContentLoader from 'react-content-loader';
import { ContentLayout } from '@common/components/content_layout';
import { MarkdownViewer } from '@common/components/md_viewer';
import { Link } from 'wouter';

type Props = {
  id: string;
};

type Publication = Tables<'publications'> & {
  source_id: Tables<'publication_sources'> | null;
  author_id: Tables<'profiles'> | null;
};

type ContentSidebarPreview = {
  id: string;
  title: string;
  image_url: string | null;
  published_at: string;
  tag: string | null;
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

  const seed = useRef(Math.floor(Math.random() * 1000000));
  const [randomContent, setRandomContent] = useState<ContentSidebarPreview[]>([]);

  useEffect(() => {
    // We fetch 3 projects and 3 publications
    fetchRandomNews(3, seed.current, [id]).then((news) => {
      setRandomContent((prev) => {
        if (prev.length + news.length > 6) return prev;
        return mergeAndShuffle(prev, news);
      });
    });
    fetchRandomProjects(3, seed.current).then((projects) => {
      setRandomContent((prev) => {
        if (prev.length + projects.length > 6) return prev;
        return mergeAndShuffle(prev, projects);
      });
    });
  }, [id, seed]);

  const randomContentElements = useMemo(() => {
    return <RandomPublications publications={randomContent} />;
  }, [randomContent]);

  if (isError) return <div className="text-center py-10 text-red-600">Error al cargar la noticia.</div>;

  return (
    <Layout>
      <Header />
      <ContentLayout>
        <div className="mx-auto py-10 flex gap-8">
          <main className='flex-1'>
            {isLoading ? (
              <ContentLoader
                speed={2}
                width="100%"
                height={420}
                viewBox="0 0 700 420"
                backgroundColor="#ededed"
                foregroundColor="#ecebeb"
                style={{ width: '100%', height: 'auto', maxWidth: 700 }}
              >
                {/* Title */}
                <rect x="0" y="0" rx="6" ry="6" width="66%" height="40" />
                {/* Author and meta */}
                <rect x="0" y="60" rx="8" ry="8" width="40" height="40" />
                <rect x="50" y="70" rx="4" ry="4" width="120" height="16" />
                {/* Main image */}
                <rect x="0" y="120" rx="12" ry="12" width="100%" height="200" />
                {/* Content lines */}
                <rect x="0" y="340" rx="4" ry="4" width="80%" height="20" />
                <rect x="0" y="370" rx="4" ry="4" width="95%" height="16" />
                <rect x="0" y="395" rx="4" ry="4" width="60%" height="16" />
              </ContentLoader>
            ) : (
              publication && (
                <>
                  <h1 className="text-3xl font-bold mb-4">
                    {publication.title}
                  </h1>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
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
                          <Link to={`/u/${publication.author_id.id}`} className="flex items-center gap-2">
                            {publication.author_id.avatar_url ? (
                              <img
                                src={publication.author_id.avatar_url}
                                alt="Avatar de usuario"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center border border-[#c5c5c5] rounded-full w-8 h-8">
                                <User size={32} strokeWidth={1} className='text-[#c5c5c5]' />
                              </div>
                            )}
                          <span className="font-medium text-gray-700 hover:text-primary">
                            {publication.author_id.nombres} {publication.author_id.apellido_paterno} {publication.author_id.apellido_materno}
                          </span>
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate2(publication.published_at)}</span>
                    </div>
                  </div>

                  {publication.image_url && (
                    <div className="mb-3">
                      <img
                        src={publication.image_url}
                        alt={publication.title}
                        className="w-full h-auto rounded-lg object-cover shadow-sm"
                        style={{ maxHeight: '500px' }}
                      />
                    </div>
                  )}

                  <div className={'flex space-y-4 justify-between'}>
                    <div>{/* TODO: Handle upvote, downvote, impressions logic */}</div>
                    <div>
                      <Button
                        leading={<Share2 size={18} />}
                        onClick={() => setShareOpen(true)}
                      >
                        Compartir
                      </Button>
                    </div>
                  </div>

                  <div className="prose max-w-none mt-3 mb-8">
                    <div className="text-gray-800 text-md leading-relaxed whitespace-pre-wrap">
                      <MarkdownViewer content={publication.content} />
                    </div>
                  </div>

                  {publication.source_id?.name && publication.external_sources_url && (
                    <div className="mb-8">
                      <a
                        href={publication.external_sources_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-border transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Ver noticia completa en {publication.source_id.name}
                      </a>
                    </div>
                  )}
                  <CommentsSection publication_id={publication.id} handleRefresh={() => {}} />
                  <div className='flex flex-col justify-start py-4 mt-6 bg-white border-t-1 border-border' />
                  <aside className="w-[36rem] lg:hidden block" style={{
                    top: HEADER_FULL_HEIGHT + 24
                  }}>
                    {randomContentElements}
                  </aside>
                </>
              )
            )}
          </main>
          <aside className="w-96 hidden lg:block sticky self-start" style={{
            top: HEADER_FULL_HEIGHT + 24
          }}>
            {randomContentElements}
          </aside>
        </div>
      </ContentLayout>
      <Modal open={shareOpen} onClose={() => setShareOpen(false)}>
        <Share url={window.location.href} title={publication?.title} content={publication?.content} />
      </Modal>
      <Footer />
    </Layout>
  );
}

function RandomPublications({ publications }: { publications: ContentSidebarPreview[] }) {
  return (
    <>
      <h3 className="font-semibold mb-4 text-lg">Otras publicaciones</h3>
      <ul className="flex flex-col gap-3">
        {publications.length === 0 && Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="border-b border-border pb-2">
            <ContentLoader
              speed={2}
              width={320}
              height={64}
              viewBox="0 0 320 64"
              backgroundColor="#dedede"
              foregroundColor="#ecebeb"
              className="w-16 h-16"
              style={{ width: 'auto', height: 'auto' }}
            >
              <rect x="0" y="0" rx="8" ry="8" width="64" height="64" />
              <rect x="76" y="8" rx="4" ry="4" width="200" height="16" />
              <rect x="76" y="32" rx="3" ry="3" width="120" height="12" />
            </ContentLoader>
          </li>
        ))}
        {publications.length > 0 && publications.map((pub, i) => (
          <li key={i} className="border-b border-border pb-2">
            <a href={`/feed/${pub.id}`} className="flex gap-3 items-center group">
              {pub.image_url && (
                <img src={pub.image_url} alt={pub.title} className="w-16 h-16 object-cover rounded flex-shrink-0" style={{ width: '64px', height: '64px' }} />
              )}
              {!pub.image_url && (
                <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0"></div>
              )}
              <div>
                <div className="font-medium text-sm group-hover:text-primary transition line-clamp-2">
                  {
                    pub.tag && (
                      <span className='font-bold'>Proyecto:&nbsp;</span>
                    )
                  }
                  <span>{pub.title}</span>
                </div>
                {/* {
                  pub.tag && (
                    <div>
                      <span className="px-2 py-0.5 bg-primary rounded text-xs text-white">
                        {formatIoaarType(pub.tag as 'repair')}
                      </span>
                    </div>
                  )
                } */}
                <div className="text-xs text-gray-500 mt-1">
                  {formatDate2(pub.published_at)}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

async function fetchRandomNews(amount: number, seed: number, exclude: string[]): Promise<ContentSidebarPreview[]> {
  function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  const { data, error } = await db
    .from('random_publications')
    .select('id, title, image_url, published_at')
    .not('id', 'in', `(${exclude.join(',')})`)
    .limit(amount);

  if (error || !data) return [];

  // workaround: views contains nullable columns
  // see: <https://github.com/orgs/supabase/discussions/13279>
  const cleanedData = data as ContentSidebarPreview[];

  return [...cleanedData].sort((a, b) =>
    seededRandom(seed + a.id.charCodeAt(0)) - seededRandom(seed + b.id.charCodeAt(0))
  );
}

async function fetchRandomProjects(amount: number, seed: number): Promise<ContentSidebarPreview[]> {
  function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  const { data, error } = await db
    .from('random_projects')
    .select('id, title, image_url, published_at, tag:ioarr_type')
    .limit(amount);

  if (error || !data) return [];

  // workaround: views contains nullable columns
  // see: <https://github.com/orgs/supabase/discussions/13279>
  const cleanedData = data as ContentSidebarPreview[];

  return [...cleanedData].sort((a, b) =>
    seededRandom(seed + a.id.charCodeAt(0)) - seededRandom(seed + b.id.charCodeAt(0))
  );
}
