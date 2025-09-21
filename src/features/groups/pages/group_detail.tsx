import { useRef } from 'react';
import { Check, Copy } from 'lucide-react';
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
import facebookIcon from '@assets/images/icons/facebook.svg';
import whatsappIcon from '@assets/images/icons/whatsapp.svg';

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

// Helper to fetch group member role
async function fetchGroupMemberRole(groupId: string, userId: string): Promise<'owner' | 'admin' | 'member' | null> {
  if (!userId) return null;
  // Check owner
  const { data: group } = await db.from('groups').select('owner_id').eq('id', groupId).single();
  if (group?.owner_id === userId) return 'owner';
  // Check admin/member
  const { data: member } = await db.from('group_members').select('role').eq('group_id', groupId).eq('user_id', userId).single();
  if (member?.role === 'admin') return 'admin';
  if (member?.role) return 'member';
  return null;
}

export function GroupDetail({ id }: GroupDetailProps) {
  useScrollReset();

  const { user } = useAuthStore();
  const [isMember, setIsMember] = useState(false);
  const [isLoadingMembership, setIsLoadingMembership] = useState(false);
  const [groupRole, setGroupRole] = useState<'owner' | 'admin' | 'member' | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [desc, setDesc] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    if (user && group) {
      fetchGroupMemberRole(group.id, user.id).then(setGroupRole);
      setDesc(group.description || '');
      setFacebookUrl(group.facebook_group_url || '');
      setWhatsappUrl(group.whatsapp_group_url || '');
    }
  }, [group, user]);

  // Validation helpers (same as in group create)
  function validateFacebookUrl(url: string) {
    if (!url) return true;
    // Require a non-empty group identifier after /groups/
    return /^(https:\/\/(www\.)?facebook\.com\/groups\/[^\s/]+\/?|https:\/\/(www\.)?facebook\.com\/share\/g\/[^\s/]+\/?)/.test(url);
  }
  function validateWhatsappUrl(url: string) {
    if (!url) return true;
    return /^https:\/\/chat\.whatsapp\.com\/.*/.test(url);
  }

  async function handleSave() {
    if (!group) return;
    // Validate
    if (!desc.trim()) {
      toast.error('La descripción no puede estar vacía');
      return;
    }
    if (facebookUrl && !validateFacebookUrl(facebookUrl)) {
      toast.error('Debe ser un enlace válido de grupo de Facebook');
      return;
    }
    if (whatsappUrl && !validateWhatsappUrl(whatsappUrl)) {
      toast.error('Debe ser un enlace válido de grupo de WhatsApp');
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await db.from('groups').update({
        description: desc,
        facebook_group_url: facebookUrl || null,
        whatsapp_group_url: whatsappUrl || null,
      }).eq('id', group.id);
      if (error) throw error;
      toast.success('Grupo actualizado correctamente');
      setEditMode(false);
      // Optionally, refetch group data (or update local state)
      // For now, update group fields locally
      group.description = desc;
      group.facebook_group_url = facebookUrl;
      group.whatsapp_group_url = whatsappUrl;
    } catch {
      toast.error('Error al actualizar el grupo');
    } finally {
      setIsSaving(false);
    }
  }

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
                <div className="flex gap-2 items-center">
                  <Button
                    leading={<IoEnter />}
                    variant='red'
                    onClick={handleMembershipAction}
                    disabled={isLoadingMembership}
                  >
                    {isLoadingMembership ? 'Cargando...' : (isMember ? 'Salirse' : 'Unirse')}
                  </Button>
                  {(groupRole === 'owner' || groupRole === 'admin') && !editMode && (
                    <Button variant="white" onClick={() => setEditMode(true)}>
                      Editar
                    </Button>
                  )}
                  {editMode && (
                    <>
                      <Button variant="red" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button variant="white" onClick={() => { setEditMode(false); setDesc(group.description || ''); setFacebookUrl(group.facebook_group_url || ''); setWhatsappUrl(group.whatsapp_group_url || ''); }} disabled={isSaving}>
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {/* Editable or read-only description */}
              {editMode ? (
                <textarea
                  className="w-full border border-gray-300 focus:outline-gray-400 rounded p-2 mt-2 mb-2"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={4}
                />
              ) : (
                <MarkdownViewer content={group.description} />
              )}
              {/* Social links */}
              <div className="flex flex-col md:flex-row gap-4 mt-4 bg-gray-100 p-5 rounded-md">
                {/* Facebook */}
                <div className="flex-1">
                  <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                    <img src={facebookIcon} alt="Facebook" className="w-5 h-5 inline" />
                    Group de Facebook
                  </label>
                  {editMode ? (
                    <input
                      type="url"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${facebookUrl && !validateFacebookUrl(facebookUrl) ? 'border-red-500' : 'border-gray-300'}`}
                      value={facebookUrl}
                      onChange={e => setFacebookUrl(e.target.value)}
                      placeholder="https://www.facebook.com/groups/tu-grupo"
                    />
                  ) : (
                    group.facebook_group_url ? (
                      <div className="flex items-center gap-2">
                        <CopyButton value={group.facebook_group_url} />
                        <a href={group.facebook_group_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                          {group.facebook_group_url}
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No hay enlace de grupo de Facebook</span>
                    )
                  )}
                </div>
                {/* WhatsApp */}
                <div className="flex-1">
                  <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                    <img src={whatsappIcon} alt="WhatsApp" className="w-5 h-5 inline" />
                    Grupo de WhatsApp
                  </label>
                  {editMode ? (
                    <input
                      type="url"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 ${whatsappUrl && !validateWhatsappUrl(whatsappUrl) ? 'border-red-500' : 'border-gray-300'}`}
                      value={whatsappUrl}
                      onChange={e => setWhatsappUrl(e.target.value)}
                      placeholder="https://chat.whatsapp.com/tu-grupo"
                    />
                  ) : (
                    group.whatsapp_group_url ? (
                      <div className="flex items-center gap-2">
                        <CopyButton value={group.whatsapp_group_url} />
                        <a href={group.whatsapp_group_url} target="_blank" rel="noopener noreferrer" className="text-green-600 underline break-all">
                          {group.whatsapp_group_url}
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No hay enlace de grupo de WhatsApp</span>
                    )
                  )}
                </div>
              </div>
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

function CopyButton({ value, className = '' }: { value: string, className?: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.info('Enlace copiado al portapapeles');
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error('No se pudo copiar');
    }
  };
  return (
    <button
      type="button"
      aria-label="Copiar enlace"
      className={`pl-1 rounded hover:bg-gray-200 transition-colors ${className}`}
      onClick={handleCopy}
      tabIndex={0}
    >
      {copied ? (
        <Check className="w-4 h-4 text-gray-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-500" />
      )}
    </button>
  );
}
