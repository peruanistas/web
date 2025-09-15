import { Header } from '@common/components/header';
import { Footer } from '@common/components/footer';
import { Layout } from '@common/components/layout';
import { MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@db/client';
import type { Tables } from '@db/schema';
import { useScrollReset } from '@common/hooks/useScrollReset';
import { PE_DEPARTMENTS, PE_DISTRICTS } from '@common/data/geo';
import ContentLoader from 'react-content-loader';
import { ContentLayout } from '@common/components/content_layout';
import { Button } from '@common/components/button';
import { IoEnter } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import { checkGroupMembership, joinGroup, leaveGroup } from '../components/group-membership-functions';
import { useAuthStore } from '@auth/store/auth_store';
import { MarkdownViewer } from '@common/components/md_viewer';
import { GroupFeed } from '../components/group_feed';
import { toast } from 'sonner';

type GroupDetailProps = {
  id: string;
};

type Group = Tables<'groups'> & {
  owner_id: Tables<'profiles'>;
};

async function fetchGroup(id: string): Promise<Group | null> {
  const { data, error } = await db
    .from('groups')
    .select('*, owner_id(*)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);

  return data;
}

export function GroupDetail({ id }: GroupDetailProps) {
  useScrollReset();

  const { user } = useAuthStore();
  const [isMember, setIsMember] = useState(false);
  const [isLoadingMembership, setIsLoadingMembership] = useState(false);

  const { data: group, isLoading, isError } = useQuery({
    queryKey: ['group_detail', id],
    queryFn: () => fetchGroup(id),
    enabled: !!id,
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      if (user && group) {
        try {
          const membershipStatus = await checkGroupMembership(group.id, user.id);
          setIsMember(membershipStatus);
        } catch (error) {
          console.error('Error checking membership:', error);
        }
      }
    };

    getCurrentUser();
  }, [group, group?.id, user]);

  const handleMembershipAction = async () => {
    if (!group) return;

    // Show login prompt if user is not authenticated
    if (!user) {
      toast.error('Debes iniciar sesión o registrarte para unirte al grupo');
      return;
    }

    setIsLoadingMembership(true);

    try {
      if (isMember) {
        await leaveGroup(group.id, user.id);
        setIsMember(false);
        toast.success('Has salido del grupo exitosamente');
      } else {
        await joinGroup(group.id, user.id);
        setIsMember(true);
        toast.success('¡Te has unido al grupo exitosamente!');
      }
    } catch (error) {
      console.error('Error updating membership:', error);
      toast.error('Error al actualizar la membresía. Inténtalo de nuevo.');
    } finally {
      setIsLoadingMembership(false);
    }
  };

  if (isLoading) return <Skeleton />;

  if (isError || !group) return <div className="text-center py-10 text-red-600">Error al cargar el grupo.</div>;

  return (
    <Layout>
      <Header />
      <ContentLayout>
        <main className="py-10">
          {/* Group Banner */}
          {group.image_url && (
            <div className="mb-6">
              <img
                src={group.image_url}
                alt="Imagen del grupo"
                className="w-full h-64 md:h-80 object-cover rounded-sm shadow-sm"
                style={{ objectPosition: 'center' }}
              />
            </div>
          )}
          {/* Group Info Row */}
          <div className="mb-6 min-w-full">
            <div>
              <div className='flex justify-between lg:gap-4 lg:flex-row flex-col mb-[-15px]'>
                <div>
                  <h1 className="text-3xl font-bold mb-3">{group.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-5 h-5 text-neutral-700" />
                    <span>{PE_DEPARTMENTS[group.geo_department].name}, {PE_DISTRICTS[group.geo_district].name}</span>
                  </div>
                </div>
                <div>
                  <Button
                    leading={<IoEnter />}
                    variant='red'
                    onClick={handleMembershipAction}
                    disabled={isLoadingMembership}
                  >
                    {isLoadingMembership ? 'Cargando...' : (isMember ? 'Salirse' : 'Unirse')}
                  </Button>
                </div>
              </div>
              <MarkdownViewer content={group.description} />
            </div>
            {/* <div className="flex flex-col items-start md:items-end gap-2">
              <AuthorInfo author={group.owner_id} />
            </div> */}
          </div>
          {/* Group Feed */}
          <GroupFeed groupId={group.id} isMember={isMember} />
        </main>
      </ContentLayout>
      <Footer />
    </Layout>
  );
}

function Skeleton() {
  return (
    <Layout>
      <Header />
      <ContentLayout>
        <main className="py-10">
          <div className="mb-6">
            <ContentLoader
              speed={2}
              width="100%"
              height={320}
              viewBox="0 0 700 320"
              backgroundColor="#ededed"
              foregroundColor="#ecebeb"
              style={{ width: '100%', height: 'auto', maxWidth: 700 }}
            >
              {/* Banner */}
              <rect x="0" y="0" rx="12" ry="12" width="100%" height="160" />
              {/* Title */}
              <rect x="0" y="180" rx="6" ry="6" width="60%" height="32" />
              {/* Location */}
              <rect x="0" y="220" rx="4" ry="4" width="40%" height="18" />
              {/* Description */}
              <rect x="0" y="250" rx="4" ry="4" width="90%" height="16" />
              <rect x="0" y="270" rx="4" ry="4" width="70%" height="16" />
              {/* Say something input */}
              <rect x="0" y="300" rx="8" ry="8" width="100%" height="20" />
            </ContentLoader>
          </div>
        </main>
      </ContentLayout>
      <Footer />
    </Layout>
  );
}
