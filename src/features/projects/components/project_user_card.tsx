import '@projects/styles/styles.css';
export default function ProjectUserCard() {
    return (
        <div className="project_user_card__container">
            <div className="project_user_card__img_container">
                <img style={{borderRadius:'5px'}} src='https://unavatar.io/github/cuetosdev' />
            </div>
            <div className="project_user_card__content">
                <h1><strong>Luis Congora</strong></h1>
                <p style={{fontSize:'16px'}}>3 proyectos | Ucayali, Peru</p>
            </div>
        </div>
    );
}