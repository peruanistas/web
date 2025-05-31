import type React from "react"
import { MapPin, Mail, Calendar, Users, Star, GitFork, Eye } from "lucide-react"
import { Button } from "@common/components/button";
import { useAuthStore } from "@auth/store/auth_store";
import { PE_DEPARTMENTS, PE_DISTRICTS } from "@common/data/geo";
import { useState, useEffect } from "react";
import { db } from "@db/client";
import { useLocation } from "wouter";

type Project = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  author_id: string;
  active: boolean;
  visibility: string;
  ioarr_type: string;
  geo_department: string;
  geo_district: string;
  impression_count: number;
  image_url: string | null;
};

type Publication = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  published_at: string;
  author_id: string | null;
  source_id: string | null;
  active: boolean;
  visibility: string;
  upvotes: number;
  downvotes: number;
  impression_count: number;
  image_url: string | null;
};

type Event = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  author_id: string;
  active: boolean;
  visibility: string;
  geo_department: string;
  geo_district: string;
  attendees: number;
  impression_count: number;
  image_url: string | null;
  event_date: string;
};

const Avatar = ({
  src,
  alt,
  className = "",
  children,
}: { src?: string; alt?: string; className?: string; children?: React.ReactNode }) => (
  <div className={`relative inline-block ${className}`}>
    {src ? (
      <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-full rounded-full object-cover" />
    ) : (
      <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">{children}</div>
    )}
  </div>
)

const Card = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div onClick={onClick} className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>{children}</div>
)

const Badge = ({
  children,
  variant = "default",
  className = "",
}: { children: React.ReactNode; variant?: "default" | "secondary" | "outline"; className?: string }) => {
  const variantClasses = {
    default: "bg-primary text-red-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700 bg-white",
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

const Separator = ({ className = "" }: { className?: string }) => <hr className={`border-gray-200 ${className}`} />

export default function ProfileComponent() {
  const user = useAuthStore((state) => state.user);
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'projects' | 'events' | 'publications'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id, activeTab]);

  const fetchUserData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      switch (activeTab) {
        case 'projects':
          await fetchProjects();
          break;
        case 'publications':
          await fetchPublications();
          break;
        case 'events':
          await fetchEvents();
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    const { data, error } = await db
      .from('projects')
      .select('*')
      .eq('author_id', user!.id)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } else {
      setProjects(data || []);
    }
  };

  const fetchPublications = async () => {
    const { data, error } = await db
      .from('publications')
      .select('*')
      .eq('author_id', user!.id)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching publications:', error);
      setPublications([]);
    } else {
      setPublications(data || []);
    }
  };

  const fetchEvents = async () => {
    const { data, error } = await db
      .from('events')
      .select('*')
      .eq('author_id', user!.id)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } else {
      setEvents(data || []);
    }
  };

  const renderProjects = () => {
    if (projects.length === 0) {
      return (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes proyectos aún</h3>
          <p className="text-gray-600 mb-4">Comienza creando tu primer proyecto</p>
          <Button variant="red" onClick={() => navigate('/proyectos/crear')}>Crear proyecto</Button>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/proyectos/${project.id}`)}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={project.image_url || "/placeholder.svg?height=80&width=80"}
                  alt="Proyecto"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{project.title}</h4>
                    <Badge variant={project.visibility === 'published' ? 'default' : 'secondary'}>
                      {project.visibility === 'published' ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {project.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{project.impression_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{PE_DISTRICTS[project.geo_district]?.name}, {PE_DEPARTMENTS[project.geo_department]?.name}</span>
                    </div>
                    <Badge variant="outline">{project.ioarr_type}</Badge>
                    <span>Creado {new Date(project.created_at).toLocaleDateString('es-PE')}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderPublications = () => {
    if (publications.length === 0) {
      return (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes publicaciones aún</h3>
          <p className="text-gray-600 mb-4">Comparte tu conocimiento con la comunidad</p>
          <Button variant="red" onClick={() => navigate('/feed/crear')}>Crear publicación</Button>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {publications.map((publication) => (
          <Card
            key={publication.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/feed/${publication.id}`)}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {publication.image_url && (
                  <img
                    src={publication.image_url}
                    alt="Publicación"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{publication.title}</h4>
                    <Badge variant={publication.visibility === 'published' ? 'default' : 'secondary'}>
                      {publication.visibility === 'public' ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {publication.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-green-500" />
                      <span>{publication.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-red-500 rotate-180" />
                      <span>{publication.downvotes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{publication.impression_count}</span>
                    </div>
                    <span>Publicado {new Date(publication.published_at).toLocaleDateString('es-PE')}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderEvents = () => {
    if (events.length === 0) {
      return (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes eventos aún</h3>
          <p className="text-gray-600 mb-4">Organiza eventos para conectar con la comunidad</p>
          <Button variant="red" onClick={() => navigate('/eventos/crear')}>Crear evento</Button>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {events.map((event) => (
          <Card
            key={event.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/eventos/${event.id}`)}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={event.image_url || "/placeholder.svg?height=80&width=80"}
                  alt="Evento"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{event.title}</h4>
                    <Badge variant={event.visibility === 'published' ? 'default' : 'secondary'}>
                      {event.visibility === 'published' ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {event.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.event_date).toLocaleDateString('es-PE')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{PE_DISTRICTS[event.geo_district]?.name}, {PE_DEPARTMENTS[event.geo_department]?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} asistentes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{event.impression_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-10">
          <p>Cargando...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'projects':
        return renderProjects();
      case 'publications':
        return renderPublications();
      case 'events':
        return renderEvents();
      default:
        return null;
    }
  };

  if (!user) return <p className="text-center py-10">Cargando perfil...</p>;

  const { profile } = user;
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* perfil */}
              <Card>
                <div className="p-6">
                  <div className="space-y-4 text-center">
                    <Avatar className="w-56 h-56 mx-auto" >
                      {profile.nombres?.charAt(0)}
                    </Avatar>
                      <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
                        {profile.nombres} {profile.apellido_paterno} {profile.apellido_materno}
                      </h2>
                      <p className="text-gray-700 text-sm">
                        No bio yet
                      </p>
                      <Button variant="red" className="w-full">Editar perfil</Button>
                  </div>

                  {/* contacto */}
                  <div className="space-y-2 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{PE_DISTRICTS[profile.geo_district].name}, {PE_DEPARTMENTS[profile.geo_department].name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Se unió en {new Date(user.created_at).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* grupitos */}
              <Card>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Grupos</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <span className="text-white text-xs font-bold">P</span>
                      </Avatar>
                      <span className="text-sm font-medium">Peruanista</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* main feed */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Navegación del feed - SIN "Actividad reciente" */}
              <div className="flex gap-4 border-b border-gray-200">
                <button
                  className={`pb-3 px-1 transition-colors ${
                    activeTab === 'projects'
                      ? 'border-b-2 border-primary text-primary font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('projects')}
                >
                  Proyectos
                </button>
                <button
                  className={`pb-3 px-1 transition-colors ${
                    activeTab === 'events'
                      ? 'border-b-2 border-primary text-primary font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('events')}
                >
                  Eventos
                </button>
                <button
                  className={`pb-3 px-1 transition-colors ${
                    activeTab === 'publications'
                      ? 'border-b-2 border-primary text-primary font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('publications')}
                >
                  Publicaciones
                </button>
              </div>

              {/* contenido dinámico según la tab activa */}
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
