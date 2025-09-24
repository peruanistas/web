import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import ProjectDetailButton from '@projects/components/project_detail_button';
import ProjectUserCard from '@projects/components/project_user_card';
import SlotCounter from 'react-slot-counter';
import { CalendarDays, MapPin, Star, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import '@projects/styles/styles.css';
import { db } from '@db/client';
import { CommentsSection } from '@common/components/commentsSection';
import { Footer } from '@common/components/footer';
import { PE_DEPARTMENTS, PE_DISTRICTS } from '@common/data/geo';
import { Modal } from '@common/components/modal';
import { Share } from '@common/components/share';
import { ContentLayout } from '@common/components/content_layout';
import { MarkdownViewer } from '@common/components/md_viewer';
import { useQuery } from '@tanstack/react-query';
import type { ProjectFull, ProjectPreview } from '@projects/types';
import { VoteConfirmationModal } from '@projects/components/vote_confirmation_modal';
import { Link } from 'wouter';
import { Loader } from '@common/components/loader';
import { votesEffectivePoints } from '@projects/utils';
import ContentLoader from 'react-content-loader';

type MegaprojectsDetailsPageProps = {
  id: string;
};

export function MegaprojectsDetailsPage({ id }: MegaprojectsDetailsPageProps) {
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectFull | null>(null);
  const url = window.location.href;

  const {
    data: votesSummary,
    isLoading: votesSummaryLoading,
    // isError: votesSummaryError, 😝 I don't!!
  } = useQuery({
    queryKey: ['project_vote_summary', id],
    queryFn: async () => {
      return db.rpc('get_project_vote_summary', { project_id: id }).then((rows) => rows.data![0]);
    },
    enabled: !!project,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    db.from('projects')
      .select('*, author_id(*)')
      .eq('id', id)
      .eq('is_megaproject', true)
      .single()
      .then((response) => {
        if (response.error) {
          console.log('Error al obtener el proyecto', response.error);
        } else {
          setProject(response.data);
          console.log('Proyecto obtenido', response.data);
        }
        setLoading(false);
      });

  } // eslint-disable-next-line react-hooks/exhaustive-deps
    , []);


  return (
    <Layout>
      <Header />
      {loading && (
        <div className='flex justify-center items-center w-full h-[1000px] bg-white'>
          <Loader />
        </div>
      )}
      {project && <ContentLayout>
        <div className='lg:gap-5 gap-1 flex flex-col-reverse lg:flex-row justify-center h-fit py-2'>
          <div>
            <div className='flex justify-center items-center w-full'>
              <div className="project_detail_layout__img_container">
                <img src={(project?.image_url ?? [])[0]} />
              </div>
            </div>
            <Link to={`/u/${project.author_id.id}`}>
              <ProjectUserCard author={project.author_id} />
            </Link>
            <div className='flex flex-row flex-wrap bg-red-100 justify-center items-center w-full px-8 py-6 gap-6 text-sm h-fit mb-8 mt-8'>
              <div
                className='flex flex-row gap-4 items-center w-full'
              >
                <Users color='black' size={30} className='flex-shrink-0' />
                <span>Cualquier ciudadano puede votar. Tienes 10 votos por semana.</span>
              </div>
              <div
                className='flex flex-row gap-4 items-center w-full'
              >
                <Trophy color='black' size={30} fill='black' className='flex-shrink-0' />
                <span>El proyecto con mas votos de cada categoria sera el ganador</span>
              </div>
              <div
                className='flex flex-row gap-4 items-center w-full'
              >
                <CalendarDays color='black' size={30} className='flex-shrink-0' />
                <span>
                  Una vez culmine la fecha, el proyecto sera eliminado. Si se decide relanzar el proyecto los votos volveran a cero
                </span>
              </div>
            </div>

            <div>
              <h1 className='text-lg font-semibold border-b-2 border-red-600 w-fit mb-0'>Descripción</h1>
              <div className='project_detail_description mb-3' style={{ maxWidth: 900, fontSize: '16px' }}>
                {project && (
                  <>
                    <MarkdownViewer content={project.content} />
                  </>
                )}
              </div>
              <CommentsSection project_id={project.id} handleRefresh={() => { }} />
            </div>
          </div>
          <div className="flex flex-col justify-center p-2 w-full max-w-lg lg:sticky lg:top-24 self-start min-w-full lg:min-w-md">
            <h1 className="project_detail_layout__title mt-3 mb-2 leading-9">{project.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '8px', alignContent: 'center' }} >
              <MapPin size={15} />
              <p style={{ fontSize: '15px' }}>
                {PE_DEPARTMENTS[project.geo_department].name}, {PE_DISTRICTS[project.geo_district].name}
              </p>
            </div>
            <div className='project_detail_layout__score_content '>
              <div className='project_detail_layout__score_title h-[80px]'>
                <p style={{ fontSize: '42px' }}>
                  {votesSummary &&
                    <SlotCounter
                      charClassName='font-bold'
                      containerClassName='pb-2'
                      autoAnimationStart={false}
                      value={votesEffectivePoints(votesSummary)}
                    />
                  }
                  {!votesSummary && (
                    <ContentLoader
                      speed={2}
                      width={70}
                      height={60}
                      viewBox="0 0 70 60"
                      backgroundColor="#ededed"
                      foregroundColor="#ecebeb"
                      style={{ fontSize: '42px' }}
                    >
                      <rect x="0" y="5" rx="6" ry="6" width="120" height="50" />
                    </ContentLoader>
                  )}
                </p>
                <p>puntos</p>
              </div>
              <div className='project_detail_layout__score_stars h-5'>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                  <p>
                    {votesSummary ? (
                      votesSummary.golden_votes
                    ) : (
                      <ContentLoader
                        speed={2}
                        width={40}
                        height={24}
                        viewBox="0 0 40 24"
                        backgroundColor="#ededed"
                        foregroundColor="#ecebeb"
                      >
                        <rect x="0" y="6" rx="4" ry="4" width="40" height="12" />
                      </ContentLoader>
                    )}
                  </p>
                  <Star color='#f7865d' fill={'#f7865d'} size={24} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                  <p>
                    {votesSummary ? (
                      votesSummary.silver_votes
                    ) : (
                      <ContentLoader
                        speed={2}
                        width={40}
                        height={24}
                        viewBox="0 0 40 24"
                        backgroundColor="#ededed"
                        foregroundColor="#ecebeb"
                      >
                        <rect x="0" y="6" rx="4" ry="4" width="40" height="12" />
                      </ContentLoader>
                    )}
                  </p>
                  <Star color='#b2b2b2' fill={'#b2b2b2'} size={24} />
                </div>
              </div>
            </div>
            {/* <p
              className='my-2'
              style={{ color: 'var(--main-color-bt-bg)', fontSize: '20px' }}
            >
              <strong>#12</strong> en {formatIoaarType(project!.ioarr_type)}
              Categoría: {formatIoaarType(project!.ioarr_type)}
            </p> */}
            <div className='mt-3'>
              <ProjectDetailButton
                style={{
                  marginBottom: 10,
                }}
                title={'Vota por este proyecto'}
                onClick={async () => {
                  if (loading) return;
                  setVoteModalOpen(true);
                }}
                loading={votesSummaryLoading}
              />
              <ProjectDetailButton title='Compartir' theme='secondary' onClick={async () => { setShareOpen(true); }} />

              {/* User voting info section */}
              {votesSummary && votesSummary.times_user_has_votes > 0 && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4 mt-4'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Trophy size={18} className='text-red-600' />
                      <span className='font-semibold text-red-800'>Tu participación</span>
                    </div>
                    <div className='text-sm text-red-700'>
                      <p className='mb-1'>
                        Has votado <strong>{votesSummary.times_user_has_votes}</strong> {votesSummary.times_user_has_votes === 1 ? 'vez' : 'veces'} por este proyecto
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/*
            <div className='project_detail_subtitle'>
                <h1 className='font-bold text-xl'>Documentos</h1>
            </div>
            <ProjectFileCard />
            <ProjectFileCard />
            <ProjectFileCard />

            <div className='project_detail_subtitle'>
                <h1 className='font-bold text-xl'>Ubicacion</h1>
            </div>


            <div className='flex justify-center items-center flex-grow-0 w-3/4'>
                <img
                    src='https://motor.elpais.com/wp-content/uploads/2022/01/google-maps-22.jpg'
                    alt='Ubicación del proyecto'
                    className='max-w-full h-auto rounded-md shadow-md'
                    style={{ maxWidth: 800, width: '100%' }}
                />
            </div> */}
        </div>
      </ContentLayout>
      }

      {
        (project && voteModalOpen) && <VoteConfirmationModal
          onClose={() => setVoteModalOpen(false)}
          open={true}
          project={project as unknown as ProjectPreview}
        />
      }

      <Modal open={shareOpen} onClose={() => setShareOpen(false)}>
        <Share
          url={url}
          shareTitle={'Comparte este proyecto'}
          title={project?.title}
          location={project?.geo_department && PE_DEPARTMENTS[project.geo_department]?.name}
          content={project?.content}
        />
      </Modal>
      <Footer />
    </Layout>
  );
}
