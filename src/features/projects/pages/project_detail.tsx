import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import ProjectDetailButton from '@projects/components/project_detail_button';
import ProjectsDetailLayout from '@projects/components/project_detail_layout';
import ProjectFileCard from '@projects/components/project_file_card';
import ProjectUserCard from '@projects/components/project_user_card';
import { CalendarDays, MapPin, Star, Trophy, Users } from 'lucide-react';
import { useEffect } from 'react';
import '@projects/styles/styles.css';

import { CommentInput } from '@events/components/commentInput';
import { CommentItem } from '@events/components/commentItem';


type ProjectsDetailsPageProps = {
  id: string;
};


export default function ProjectsDetailsPage({id}: ProjectsDetailsPageProps) {
    useEffect(() => {
        // Fetch project details using the id
        console.log(`Fetching details for project with id: ${id}`);
        // Add your fetch logic here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , []);

    return (
        <Layout >
            <Header />

            <div className='gap-[16px] flex flex-row-reverse w-full h-[1000px] justify-center'>
            
                <div className="project_detail_layout__content">
                    <h1 className="project_detail_layout__title">Reparacion de pistas en la interseccion de los zafiros, La Victoria</h1>
                    <div style={{display:'flex', flexDirection:'row', gap:'8px', alignContent:'center'}} >
                        <MapPin size={20} />
                        <p style={{fontSize:'14px'}}>La Victoria</p>
                    </div>
                    <div className='project_detail_layout__score_content'>
                        <div className='project_detail_layout__score_title'>
                            <p style={{fontSize:'42px'}}><strong>103</strong></p>
                            <p>puntos</p>
                        </div>
                        <div className='project_detail_layout__score_stars'>
                            <div style={{display:'flex', flexDirection:'row', gap:'8px'}}>
                                <p>38</p>
                                <Star color='#f7865d' fill = {'#f7865d'}size={24} />
                            </div>
                            <div style={{display:'flex', flexDirection:'row', gap:'8px'}}>
                                <p>27</p>
                                <Star color='#b2b2b2' fill = {'#b2b2b2'}size={24} />
                            </div>

                        </div>

                    </div>
                    <p style={{color:'var(--main-color-bt-bg)'}}><strong>#12</strong> en reparaciones</p>
                    <ProjectDetailButton title='Vota por este proyecto'/>
                    <ProjectDetailButton title='compartir' theme='secondary'/>
                    <ProjectUserCard />
                    </div>
                        <div className='flex flex-col gap-4 '>
                            <div className=' flex justify-center items-center w-full'>
                                <ProjectsDetailLayout />
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
                    <div className='project_detail_subtitle'>
                        <h1 className='font-bold text-xl'>Comentarios (12)</h1>
                    </div>
                    <div className='flex flex-col gap-0'>
                        <CommentInput />
                        <CommentItem author='Doris Rojas' timeAgo='2h' content='lorem ipsum'/>
                        <CommentItem author='Doris Rojas' timeAgo='2h' content='lorem ipsum'/>
                        <CommentItem author='Doris Rojas' timeAgo='2h' content='lorem ipsum'/>
                        <CommentItem author='Doris Rojas' timeAgo='2h' content='lorem ipsum'/>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
