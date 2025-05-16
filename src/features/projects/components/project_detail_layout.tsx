import '@projects/styles/styles.css';
import ProjectDetailButton from './project_detail_button';
export default function ProjectsDetailLayout() {
    return(
        <div className="project_detail_layout__container">
            <div className="project_detail_layout__img_container">
                <img src='https://www.huachos.com/upload/img/noticias/92cef82d85a558c6dbfbe5d99c746eb2.jpg' />
            </div>
            <div className="project_detail_layout__content">
                <div>
                    <h1 className="project_detail_layout__title">Reparacion de pistas en la interseccion de los zafiros, La Victoria</h1>
                    {/* title */}
                    <ProjectDetailButton title='Vota por este proyecto'/>
                    <ProjectDetailButton title='compartir' theme='secondary'/>
                    
                </div>
            </div>
        </div>
    );
}