import { Modal } from '@common/components/modal';
import { PE_DEPARTMENTS, PE_DISTRICTS } from '@common/data/geo';
import type { ProjectPreview } from '@projects/types';
import { formatIoaarType, getVotesLeft, voteForProject } from '@projects/utils';
import { LucideInfo, MapPin, Star } from 'lucide-react';
import ProjectDetailButton from './project_detail_button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@auth/store/auth_store';
import { Button } from '@common/components/button';
import { useLocation } from 'wouter';

type VoteConfirmationModalProps = {
  open: boolean;
  project: ProjectPreview,
  onClose: () => void;
};

export function VoteConfirmationModal({ open, onClose, project }: VoteConfirmationModalProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [, navigate] = useLocation();

  const {
    data: votesLeft,
    isLoading: isVotesLoading,
    isError: isVotesError,
  } = useQuery({
    queryKey: ['votes_left', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      return getVotesLeft();
    },
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute
  });

  if (!open) return null;

  if (isVotesLoading || isVotesError) {
    return (
      <Modal open={open} onClose={onClose}>
        <div className='flex flex-col items-center justify-center h-full'>
          <p className='loader'></p>
        </div>
      </Modal>
    );
  }

  if (!user?.profile) {
    return (
      <Modal open={open} onClose={onClose}>
        <div className='my-1'>
          <h1 className='text-2xl font-bold'>
            Únete a Peruanistas para poder votar
          </h1>
          <p className='text-lg mt-2'>Inicia sesión o crea una cuenta para poder votar por este proyecto.</p>
          <div className='flex flex-row gap-4 mb-4 justify-center'>
            <Button
              className='mt-4'
              variant='white'
              onClick={() => {
                navigate('/login');
              }}
            >Ya tengo una cuenta</Button>
            <Button
              className='mt-4'
              variant='red'
              onClick={() => {
                navigate('/signup');
              }}
            >Crear una cuenta</Button>
          </div>
        </div>
        <ProjectDetailButton disabled title='Votar' />
      </Modal>
    );
  }

  const userVotesLeft = votesLeft ?? 0;
  const noVotesLeft = userVotesLeft === 0;

  const isGolden = (
    user.profile.geo_department === project.geo_department &&
    user.profile.geo_district === project.geo_district
  );
  const userDistrictName = PE_DISTRICTS[user.profile.geo_district]!.name;

  return (
    <Modal open={open} onClose={onClose}>
      <h1 className='mt-2 text-2xl font-bold'>Estás apunto de votar por</h1>
      <div className='mb-6'>
        <div className='flex gap-4 mt-4'>
          <div className='w-32'>
            <img src={project?.image_url || undefined} />
          </div>
          <div className='flex flex-col justify-center'>
            <h2 className='text-xl mb-0.5 font-semibold'>{project?.title}</h2>
            <div className='flex gap-2'>
              <span className='text-primary font-bold mb-2'>{formatIoaarType(project?.ioarr_type)}</span> ·
              <span>0 puntos</span>
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <MapPin size={15} />
              <p className='text-sm'>
                {PE_DEPARTMENTS[project.geo_department].name}, {PE_DISTRICTS[project.geo_district].name}
              </p>
            </div>
          </div>
        </div>
      </div>
      {isGolden && (
        <div className='flex gap-3 text-lg items-center bg-orange-100 p-2 mb-4 font-normal!'>
          <Star color='#f7865d' fill={'#f7865d'} size={40} />
          <p>
            Como este proyecto pertenece a tu distrito ({userDistrictName}), tu voto contará&nbsp;
            <span className='font-bold'>2 puntos</span>
          </p>
        </div>
      )}
      {!isGolden && (
        <div className='flex gap-3 text-lg items-center bg-gray-200 p-2 mb-4 font-normal!'>
          <Star color='#a0a0a0' fill={'#a0a0a0'} size={40} />
          <p>
            Como este proyecto <b>no</b> pertenece a tu distrito ({userDistrictName}), tu voto contará&nbsp;
            <span className='font-bold'>1 punto</span>
          </p>
        </div>
      )}
      <ProjectDetailButton
        title={'Votar'}
        disabled={noVotesLeft}
        onClick={async () => {
          try {
            await voteForProject(project.id);
            // sucess message
            await queryClient.invalidateQueries({ queryKey: ['votes_left'] });
            await queryClient.invalidateQueries({ queryKey: ['project_vote_summary', project.id] });
            onClose();
            navigate(`/proyectos/${project.id}`);
          } catch (err) {
            console.log(err);
            alert('Hubo un error. Por favor inténtalo de nuevo más tarde.');
          }
        }}
      />
      {
        noVotesLeft && (
          <div className='mt-2 flex gap-2 items-center'>
            <LucideInfo size={18} color='#222' />
            <p>No te quedan votos disponibles. Podrás votar la siguiente semana.</p>
          </div>
        )
      }
      {
        userVotesLeft > 0 && (
          <div className='mt-2 flex gap-2 items-center'>
            <LucideInfo size={18} color='#222' />
            <p>Te quedan <span className='font-bold'>{userVotesLeft}</span> {userVotesLeft === 1 ? 'voto' : 'votos'} disponibles.</p>
          </div>
        )
      }
    </Modal>
  );
}
