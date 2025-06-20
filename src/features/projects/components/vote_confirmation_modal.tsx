import { Modal } from '@common/components/modal';
import { PE_DEPARTMENTS, PE_DISTRICTS } from '@common/data/geo';
import type { ProjectPreview } from '@projects/types';
import { formatIoaarType, getVotesLeft, voteForProject, votesEffectivePoints } from '@projects/utils';
import { LucideInfo, MapPin, Star } from 'lucide-react';
import ProjectDetailButton from './project_detail_button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@auth/store/auth_store';
import { Button } from '@common/components/button';
import { useLocation } from 'wouter';
import { db } from '@db/client';
import { VotesCounter } from '@projects/components/votes_counter';
import { useState, useEffect } from 'react';
import ContentLoader from 'react-content-loader';

type VoteConfirmationModalProps = {
  open: boolean;
  project: ProjectPreview,
  onClose: () => void;
};

export function VoteConfirmationModal({ open, onClose, project }: VoteConfirmationModalProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [votesCount, setVotesCount] = useState(1);

  const [, navigate] = useLocation();

  const { data: votesSummary } = useQuery({
    queryKey: ['project_vote_summary', project.id],
    queryFn: async () => {
      return db.rpc('get_project_vote_summary', { project_id: project.id }).then((rows) => rows.data![0]);
    },
    enabled: !!project,
  });

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

  // Reset votes count when modal opens or when user votes left changes
  useEffect(() => {
    const userVotesLeft = votesLeft ?? 0;
    if (open && userVotesLeft > 0) {
      setVotesCount(Math.min(1, userVotesLeft));
    }
  }, [open, votesLeft]);

  if (!open) return null;

  if (isVotesLoading || isVotesError) {
    return (
      <Modal open={open} onClose={onClose}>
        <div className='flex flex-col items-center justify-center p-8'>
          <ContentLoader
            speed={2}
            width={400}
            height={200}
            viewBox="0 0 400 200"
            backgroundColor="#ededed"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="20" rx="6" ry="6" width="300" height="20" />
            <rect x="0" y="60" rx="4" ry="4" width="200" height="16" />
            <rect x="0" y="90" rx="4" ry="4" width="250" height="16" />
            <rect x="0" y="130" rx="8" ry="8" width="150" height="40" />
          </ContentLoader>
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
              {
                votesSummary && <span>{votesEffectivePoints(votesSummary!)} puntos</span>
              }
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
            Este proyecto pertenece a tu distrito ({userDistrictName}). Cada voto contará&nbsp;
            <span className='font-bold'>2 puntos</span>
          </p>
        </div>
      )}
      {!isGolden && (
        <div className='flex gap-3 text-lg items-center bg-gray-200 p-2 mb-4 font-normal!'>
          <Star color='#a0a0a0' fill={'#a0a0a0'} size={40} />
          <p>
            Este proyecto <b>no</b> pertenece a tu distrito ({userDistrictName}). Cada voto contará&nbsp;
            <span className='font-bold'>1 punto</span>
          </p>
        </div>
      )}

      {/* Votes Counter */}
      {userVotesLeft > 0 && (
        <div className='mb-4'>
          <div className='flex items-center justify-between mb-3'>
            <label className='text-lg font-semibold'>
              ¿Cuántos votos quieres usar?
            </label>
            <VotesCounter
              value={votesCount}
              onChange={setVotesCount}
              min={1}
              max={Math.min(userVotesLeft, 10)}
              disabled={noVotesLeft}
            />
          </div>
          <div className='bg-blue-50 p-3 rounded-lg'>
            <p className='text-sm text-blue-800'>
              {isGolden ? (
                <>
                  Sumarás <strong>{votesCount * 2}</strong> puntos al proyecto.
                </>
              ) : (
                <>
                  Sumarás <strong>{votesCount}</strong> {votesCount === 1 ? 'punto' : 'puntos'} al proyecto.
                </>
              )}
            </p>
          </div>
        </div>
      )}

      <ProjectDetailButton
        title={votesCount === 1 ? 'Votar' : `Usar ${votesCount} votos`}
        disabled={noVotesLeft}
        onClick={async () => {
          try {
            await voteForProject(project.id, votesCount);
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
          <div className='mt-4 flex gap-2 items-center'>
            <LucideInfo size={18} color='#222' />
            <p>No te quedan votos disponibles. Podrás votar la siguiente semana.</p>
          </div>
        )
      }
      {
        userVotesLeft > 0 && (
          <div className='mt-4 flex gap-2 items-center'>
            <LucideInfo size={18} color='#222' />
            <p>Te quedan <span className='font-bold'>{userVotesLeft}</span> {userVotesLeft === 1 ? 'voto' : 'votos'} disponibles.</p>
          </div>
        )
      }
    </Modal>
  );
}
