import ProjectsDetailLayout from '@projects/components/project_detail_layout';
import { useEffect } from 'react';

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
        <>
            <ProjectsDetailLayout />
        </>
    );
}