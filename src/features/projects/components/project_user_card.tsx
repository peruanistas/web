import { db } from '@db/client';
import '@projects/styles/styles.css';
import { useEffect, useState } from 'react';

type ProjectUserCardProps = {
    author_id?: string; // Cambiado a opcional (temporary build fix)
};

export default function ProjectUserCard({author_id='cad9e6aa-a592-4f37-80b8-600818e564a1' }: ProjectUserCardProps) {
    const [nombres, setNombres] = useState<string>();
    const [apellidos, setApellidos] = useState<string>();
    const [departament, setDepartament] = useState<string>();
    const [district, setDistrict] = useState<string>();

    useEffect(()=>{
        window.scrollTo(0, 0);
        db.from('profiles')
            .select('*')
            .eq('id', author_id)
            .single()
            .then((response) => {
                if (response.error) {
                    console.log('Error al obtener el autor', response.error);
                } else {
                    setNombres(response.data?.nombres);
                    setApellidos(`${response.data?.apellido_paterno} ${response.data?.apellido_materno}`);
                    setDepartament(response.data?.geo_department);
                    setDistrict(response.data?.geo_district);

                    if (response.data?.geo_department) {
                        db.from('geo_pe_departments')
                            .select('name')
                            .eq('code', response.data.geo_department)
                            .single()
                            .then((depResponse) => {
                                if (depResponse.error) {
                                    console.log('Error al obtener el departamento', depResponse.error);
                                } else {
                                    setDepartament(depResponse.data.name);
                                    console.log('Departamento obtenido', depResponse.data);
                                }
                            });
                    }
                    if (response.data?.geo_district) {
                        db.from('geo_pe_districts')
                            .select('name')
                            .eq('code', response.data.geo_district)
                            .single()
                            .then((depResponse) => {
                                if (depResponse.error) {
                                    console.log('Error al obtener el distrito', depResponse.error);
                                } else {
                                    setDistrict(depResponse.data.name);
                                    console.log('Distrito obtenido', depResponse.data);
                                }
                            });
                    }

                }
            });
    },[]);

    return (
        <div className="project_user_card__container">
            <div className="project_user_card__img_container">
                <img style={{borderRadius:'5px'}} src='https://unavatar.io/github/cuetosdev' />
            </div>
            <div className="project_user_card__content">
                <h1><strong>{nombres} {apellidos}</strong></h1>
                <p style={{fontSize:'16px'}}>{departament} | {district}, Peru</p>
            </div>
        </div>
    );
}
