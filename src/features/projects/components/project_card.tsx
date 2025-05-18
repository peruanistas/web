import { NO_IMAGE_URL } from '@common/constants';
import { PE_DEPARTMENTS, PE_DISTRICTS } from '@common/data/geo';
import type { ProjectPreview } from '@projects/types';
import { formatIoaarType } from '@projects/utils';
import ContentLoader from 'react-content-loader';
import { FaLocationDot } from 'react-icons/fa6';
import { Link } from 'wouter';

type ProjectCardProps = ProjectPreview & {};

export function ProjectCard(project: ProjectCardProps) {
  return (
    <Link href={`/proyectos/${project.id}`}>
      <article className='flex flex-col border border-border rounded-sm'>
        {/* Project image */}
        <img
          height={240}
          className='object-cover h-[240px] rounded-t-sm bg-[#ededed]'
          alt={project.title}
          src={project.image_url ?? NO_IMAGE_URL}
        />
        {/* Project information */}
        <div className='flex flex-col p-3 min-h-[108px] h-[108px]'>
          <h2 className='font-semibold mb-1 line-clamp-2 break-words'>
            {project.title}
          </h2>
          <span className='font-semibold text-primary mt-1'>
            {formatIoaarType(project.ioarr_type)}
          </span>
        </div>
        {/* Project footer info */}
        <div className='flex gap-2 items-center h-12 bg-gray-100 px-3 py-2 rounded-b-sm border-t border-border'>
          <span><FaLocationDot color='#6e6e6e' /></span>
          <span>{PE_DEPARTMENTS[project.geo_department].name}, {PE_DISTRICTS[project.geo_district].name}</span>
        </div>
      </article>
    </Link>
  );
}

// From https://skeletonreact.com/
export function ProjectCardSkeleton() {
  return (
    <article className='flex gap-4 mb-4'>
      <ContentLoader
        speed={2}
        width={600}
        height={140}
        viewBox="0 0 600 140"
        backgroundColor="#ededed"
        foregroundColor="#ecebeb"
      >
        <rect x="81" y="69" rx="0" ry="0" width="1" height="0" />
        <rect x="0" y="0" rx="2" ry="2" width="230" height="140" />
        <rect x="243" y="6" rx="0" ry="0" width="112" height="15" />
        <rect x="243" y="33" rx="0" ry="0" width="283" height="21" />
        <rect x="244" y="70" rx="0" ry="0" width="93" height="14" />
        <rect x="245" y="101" rx="0" ry="0" width="87" height="11" />
      </ContentLoader>
    </article>
  );
}
