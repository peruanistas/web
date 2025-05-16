import '@projects/styles/styles.css';
import ProjectDetailButton from './project_detail_button';
import { MapPin, Star } from 'lucide-react';
export default function ProjectsDetailLayout() {
    return(
        <div className="project_detail_layout__container">
            <div className="project_detail_layout__img_container">
                <img src='https://www.huachos.com/upload/img/noticias/92cef82d85a558c6dbfbe5d99c746eb2.jpg' />
            </div>
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
            </div>
        </div>
    );
}