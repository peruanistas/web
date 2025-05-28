import { PE_DEPARTMENTS, PE_DISTRICTS } from '@common/data/geo';
import type { Tables } from '@db/schema';
import '@projects/styles/styles.css';
import { UserIcon } from 'lucide-react';

type ProjectUserCardProps = {
    author: Tables<'profiles'>;
};

export default function ProjectUserCard({ author }: ProjectUserCardProps) {
    return (
        <div className="project_user_card__container">
            <div className="project_user_card__img_container">
                <UserIcon size={32} strokeWidth={1} />
            </div>
            <div className="project_user_card__content">
                <h1><strong>{author.nombres} {author.apellido_paterno} {author.apellido_materno}</strong></h1>
                <p style={{fontSize:'16px'}}>
                    {PE_DEPARTMENTS[author.geo_department].name} | {PE_DISTRICTS[author.geo_district].name}
                </p>
            </div>
        </div>
    );
}
