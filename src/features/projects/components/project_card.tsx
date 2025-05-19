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
      <article className='flex flex-col border border-border rounded-sm bg-white'>
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
    <article className='flex gap-4 border border-border rounded-sm'>
      <ContentLoader
        speed={2}
        width={402}
        height={398}
        viewBox="0 0 402 400"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="0" ry="0" width="402" height="240" />
        <rect x="2" y="352" rx="0" ry="0" width="402" height="48" />
        <rect x="10" y="255" rx="0" ry="0" width="380" height="15" />
        <rect x="10" y="276" rx="0" ry="0" width="217" height="16" />
      </ContentLoader>
    </article>
  );
}
