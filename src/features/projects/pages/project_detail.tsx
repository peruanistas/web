import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import ProjectDetailButton from '@projects/components/project_detail_button';
import ProjectFileCard from '@projects/components/project_file_card';
import ProjectUserCard from '@projects/components/project_user_card';
import { CalendarDays, MapPin, Star, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import '@projects/styles/styles.css';
import { type Tables } from '@db/schema';
import { db } from '@db/client';
import { CommentsSection } from '@events/components/commentsSection';


type ProjectsDetailsPageProps = {
  id: string;
};
function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg relative"
        style={{ maxWidth: 800, width: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        <button className="absolute top-2 right-2" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}



export default function ProjectsDetailsPage({id}: ProjectsDetailsPageProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<Tables<'projects'> | null>(null);
    const [departament, setDepartament] = useState<string>();

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


                    // Si existe el código de departamento, buscar el departamento
                    if (response.data?.geo_department) {
                        db.from('geo_pe_departments')
                            .select('name')
                            .eq('code', response.data.geo_department)
                            .single()
                            .then((depResponse) => {
                                if (depResponse.error) {
                                    console.log('Error al obtener el departamento', depResponse.error);
                                } else {
                                    //setDepartament(depResponse.data);
                                    setDepartament(depResponse.data.name);
                                    console.log('Departamento obtenido', depResponse.data);
                                }
                            });
                    }

            }
            setLoading(false);
            });

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , []);


    return (
        <Layout className='bg-white min-h-screen' >
            <Header />
            {loading && <div className='flex justify-center items-center w-full h-[1000px] bg-white'>
                <div className="loader">
                </div>
            </div>}
            {!loading && <div className='gap-[16px] flex flex-row-reverse w-full h-[1000px] justify-center'>
            
                <div className="project_detail_layout__content">
                    <h1 className="project_detail_layout__title">{project?.title}</h1>
                    <div style={{display:'flex', flexDirection:'row', gap:'8px', alignContent:'center'}} >
                        <MapPin size={20} />
                        <p style={{fontSize:'14px'}}>{departament}</p>
                    </div>
                    <div className='project_detail_layout__score_content'>
                        <div className='project_detail_layout__score_title'>
                            <p style={{fontSize:'42px'}}><strong>0</strong></p>
                            <p>puntos</p>
                        </div>
                        <div className='project_detail_layout__score_stars'>
                            <div style={{display:'flex', flexDirection:'row', gap:'8px'}}>
                                <p>0</p>
                                <Star color='#f7865d' fill = {'#f7865d'}size={24} />
                            </div>
                            <div style={{display:'flex', flexDirection:'row', gap:'8px'}}>
                                <p>0</p>
                                <Star color='#b2b2b2' fill = {'#b2b2b2'}size={24} />
                            </div>

                        </div>

                    </div>
                    <p style={{color:'var(--main-color-bt-bg)'}}><strong>#12</strong> en reparaciones</p>
                    <ProjectDetailButton title='Vota por este proyecto' onClick={()=>{setModalOpen(true);}} />
                    <ProjectDetailButton title='compartir' theme='secondary'/>
                    <ProjectUserCard />
                    </div>
                        <div className='flex flex-col gap-4 '>
                            <div className=' flex justify-center items-center w-full'>
                                <div className="project_detail_layout__img_container">
                                    <img src={project?.image_url || undefined} />
                                </div>
                            </div>
                            
                            <div className='flex flex-row bg-red-100 justify-center items-center w-full p-4 gap-4 text-sm h-[140px]'>
                        <div className='flex flex-row gap-8 items-center' style={{ width: 320 }}>
                            <Users color='black' size={30} className='flex-shrink-0'/>
                            <span>Cualquier ciudadano puede votar. Tienes 10 votos por mes.</span>     
                        </div>
                        <div className='flex flex-row gap-4 items-center' style={{ width: 320 }}>
                            <Trophy color='black' size={30} fill='black' className='flex-shrink-0'/>
                            <span>El proyecto con mas votos de cada categoria sera el ganador</span>     
                        </div>
                        <div className='flex flex-row gap-4 items-center text' style={{ width: 320 }}>
                            <CalendarDays color='black' size={30} className='flex-shrink-0'/>
                            <span>Una vez culmine la fecha, el proyecto sera eliminado. Si se decide relanzar el proyecto los votos volveran a cero</span>     
                        </div>
                    </div>

                    <div>
                        <h1 className='project_detail_subtitle font-bold text-xl'>Descripción</h1>
                        <p className='project_detail_description my-3' style={{ maxWidth: 1000 }}>
                            {project?.content}
                        </p>
                    </div>

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
                    </div>
                    <CommentsSection />
                </div>
            </div>}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className='text-2xl font-bold my-1 '>
                    <h1>Lo Sentimos el sistema de votacion estara disponible proximamente</h1>
                </div>
            </Modal>
        </Layout>
    );
}
