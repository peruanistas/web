import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import ProjectDetailButton from '@projects/components/project_detail_button';
import ProjectUserCard from '@projects/components/project_user_card';
import { CalendarDays, MapPin, Star, Trophy, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import '@projects/styles/styles.css';
import { type Tables } from '@db/schema';
import { db } from '@db/client';
import { CommentsSection } from '@common/components/commentsSection';
import { Footer } from '@common/components/footer';
import { PE_DEPARTMENTS } from '@common/data/geo';
import { Modal } from '@common/components/modal';
import { Share } from '@common/components/share';
import { ContentLayout } from '@common/components/content_layout';
import { MDXEditor, type MDXEditorMethods } from '@mdxeditor/editor';
import Markdown from 'react-markdown';
import { formatIoaarType } from '@projects/utils';

type ProjectsDetailsPageProps = {
  id: string;
};

export default function ProjectsDetailsPage({ id }: ProjectsDetailsPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Tables<'projects'> | null>(null);
  const url = window.location.href;
  const ref = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    db.from('projects')
      .select('*')
      .eq('id', id)
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

  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , []);


  return (
    <Layout>
      <Header />
      {loading && <div className='flex justify-center items-center w-full h-[1000px] bg-white'>
        <div className="loader">
        </div>
      </div>}
      {!loading && <ContentLayout>
        <div className='gap-[16px] flex flex-col-reverse md:flex-row lg:flex-row justify-center h-fit py-2'>
          <div>
            <div className='flex justify-center items-center w-full'>
              <div className="project_detail_layout__img_container">
                <img src={project?.image_url || undefined} />
              </div>
            </div>
            <div className='flex flex-row flex-wrap bg-red-100 justify-center items-center w-full px-8 py-6 gap-6 text-sm h-fit my-10'>
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
              <h1 className='text-lg font-semibold border-b-2 border-red-600 w-fit mb-4'>Descripción</h1>
              <div className='project_detail_description my-3' style={{ maxWidth: 1000, fontSize: '16px' }}>
                {project && (
                  <>
                    <Markdown>{project.content}</Markdown>
                    <MDXEditor ref={ref} markdown={project.content} readOnly />
                  </>
                )}
              </div>
              <CommentsSection project_id={project?.id} handleRefresh={() => { }} />
            </div>
          </div>
          <div className="flex flex-col justify-center p-2 px-4 w-full max-w-lg lg:sticky lg:top-40 self-start ">
            <h1 className="project_detail_layout__title my-3">{project?.title}</h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignContent: 'center' }} >
              <MapPin size={15} />
              <p style={{ fontSize: '14px' }}>
                {project?.geo_department && PE_DEPARTMENTS[project.geo_department]?.name}
              </p>
            </div>
            <div className='project_detail_layout__score_content '>
              <div className='project_detail_layout__score_title'>
                <p style={{ fontSize: '42px' }}><strong>0</strong></p>
                <p>puntos</p>
              </div>
              <div className='project_detail_layout__score_stars' >
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                  <p>0</p>
                  <Star color='#f7865d' fill={'#f7865d'} size={24} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                  <p>0</p>
                  <Star color='#b2b2b2' fill={'#b2b2b2'} size={24} />
                </div>
              </div>
            </div>
            <p className='my-2' style={{ color: 'var(--main-color-bt-bg)', fontSize: '20px' }}><strong>#12</strong> en {formatIoaarType(project?.ioarr_type)}</p>
            <div className='mb-3'>
              <ProjectDetailButton title='Vota por este proyecto' onClick={() => { setModalOpen(true); }} />
              <ProjectDetailButton title='Compartir' theme='secondary' onClick={() => { setShareOpen(true); }} />
            </div>
            <ProjectUserCard />
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



      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className='text-2xl font-bold my-1 '>
          <h1>Lo Sentimos el sistema de votacion estara disponible proximamente</h1>
        </div>
      </Modal>

      <Modal open={shareOpen} onClose={() => setShareOpen(false)}>
        <Share url={url} title={project?.title} location={project?.geo_department && PE_DEPARTMENTS[project.geo_department]?.name} content={project?.content} />
      </Modal>
      <Footer />
    </Layout>
  );
}
