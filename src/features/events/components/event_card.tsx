import { Link } from 'wouter';
import { Calendar, MapPin, Users, Eye } from 'lucide-react';
import { PE_DEPARTMENTS, PE_DISTRICTS } from '@common/data/geo';
import { NO_IMAGE_URL } from '@common/constants';
import type { EventPreview } from '../types';

export function EventCard(event: EventPreview) {
  const imageUrl = (event.image_url && event.image_url.length > 0) 
    ? event.image_url[0] 
    : NO_IMAGE_URL;

  const districtName = event.geo_district ? PE_DISTRICTS[event.geo_district as string]?.name : 'Distrito desconocido';
  const departmentName = event.geo_department ? PE_DEPARTMENTS[event.geo_department as string]?.name : 'Departamento desconocido';

  return (
    <article className='flex flex-col border border-border rounded-sm relative group bg-white w-full h-full'>
      <Link href={`/eventos/${event.id}`} className='flex flex-col h-full'>
        {/* Imagen del evento */}
        <img
          height={200}
          width={'100%'}
          className='object-cover h-[200px] rounded-t-sm bg-[#ededed] flex-shrink-0'
          alt={event.title}
          src={imageUrl}
        />
        
        {/* Información principal */}
        <div className='flex flex-col p-3 min-h-[80px] flex-grow'>
          <h2 className='font-semibold mb-2 line-clamp-2 break-words'>
            {event.title}
          </h2>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {event.content}
          </p>
        </div>
        
        {/* Detalles: Fecha y Ubicación */}
        <div className='flex flex-col gap-2 px-3 pb-4 text-sm text-gray-600 mt-auto'>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap capitalize">
              {new Date(event.event_date).toLocaleDateString('es-PE', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {districtName}, {departmentName}
            </span>
          </div>
        </div>

        {/* Footer: Estadísticas */}
        <div className='flex items-center text-sm justify-between h-10 bg-gray-100 px-3 py-2 rounded-b-sm border-t border-border flex-shrink-0'>
          <div className='flex gap-4'>
            <div className='flex gap-1 items-center' title='Asistentes'>
              <Users color='#6e6e6e' size={14} />
              {event.attendees || 0}
            </div>
          </div>
          <div className='flex gap-1 items-center' title='Vistas'>
            <Eye color='#6e6e6e' size={16} />
            {event.impression_count || 0}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <article className="flex flex-col border border-border rounded-sm bg-white w-full h-full animate-pulse">
      {/* Imagen del evento */}
      <div className="h-[200px] w-full bg-gray-300 rounded-t-sm flex-shrink-0" />
      
      {/* Información principal */}
      <div className="flex flex-col p-3 min-h-[80px] flex-grow">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
      
      {/* Detalles: Fecha y Ubicación */}
      <div className="flex flex-col gap-2 px-3 pb-4 mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-300 flex-shrink-0"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-300 flex-shrink-0"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>

      {/* Footer: Estadísticas */}
      <div className="flex items-center justify-between h-10 bg-gray-100 px-3 py-2 rounded-b-sm border-t border-border flex-shrink-0">
        <div className="flex gap-4">
          <div className="w-8 h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="w-8 h-4 bg-gray-300 rounded"></div>
      </div>
    </article>
  );
}