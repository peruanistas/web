import { Header } from '@common/components/header';
import { Footer } from '@common/components/footer';
import { Layout } from '@common/components/layout';

import { CommentsSection } from '@events/components/commentsSection';

import { EventStatusTag } from '@events/components/eventstatustag';
import { YoutubeAuthorCard } from '@events/components/youtubeauthorcard';

import { Calendar, MapPin, Info, MessageCircle } from 'lucide-react';
import InfoItem from '@events/components/infoitem';
import { useEffect } from 'react';

type Props = {
  id: string;
};

export function EventDetailBasic({ id }: Props) {

  useEffect(() => {
    if (window.location.href.indexOf('#') === -1) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <Layout>
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">

        <div className="mb-4">
          <EventStatusTag />
        </div>

        <h1 className="text-2xl font-bold mb-2">
          Reparación de pistas en la intersección Los Zafiros, La Victoria
        </h1>
        <p className="text-gray-600 mb-1">Evento ID: {id}</p>

        <p className="mb-6">
          Reparaciones en la intersección Los Zafiros, clave para la movilidad en La Victoria y actualmente
          deteriorada por años de abandono.
        </p>

        <div className="mb-6">
          <YoutubeAuthorCard
            avatarUrl="https://yt3.googleusercontent.com/RBme8YfV2UTTkoiwvusDpTsHupuUXmOBi_RscwCj-HQs2wA8U62EJ4-nQ0Rl0GVaqUKWG6fPgg=s160-c-k-c0x00ffffff-no-rj"
            authorName="Luis Congora PREP, Inc."
            subscribers="2.7 M"
            channelUrl="https://www.youtube.com/@saidnajarro"
          />
        </div>

        <div className="space-y-4">
          <InfoItem title="Día y hora" icon={<Calendar className="w-5 h-5 text-neutral-700" />}>
            Sábado, Mayo 17 11 - 11:45am GMT-5
          </InfoItem>

          <InfoItem title="Localización" icon={<MapPin className="w-5 h-5 text-neutral-700" />}>
            Intersección Los Zafiros, La Victoria
          </InfoItem>

          <InfoItem title="Acerca del evento" icon={<Info className="w-5 h-5 text-neutral-700" />}>
            El próximo sábado 25 de mayo, desde las 7:00 a.m., iniciaremos los trabajos de reparación integral en la intersección de Los Zafiros, ubicada en el corazón del barrio La Victoria. Esta vía, esencial para el tránsito diario de vecinos y comercios, ha estado en condiciones críticas debido al desgaste y la falta de mantenimiento. La jornada comprenderá el fresado del asfalto dañado, nivelación de superficie, relleno de baches, y repavimentación completa del tramo afectado. Además, se realizarán mejoras en el sistema de drenaje para evitar la acumulación de agua durante lluvias, una de las principales causas del deterioro actual.
            El equipo técnico, conformado por: 12 operarios, 3 ingenieros de obra, trabajaran de manera ininterrumpida durante el fin de semana para asegurar la apertura del tránsito el lunes 27 en la mañana. Se colocarán señalizaciones temporales y desvíos, garantizando rutas alternativas para conductores y líneas de transporte público.
            Durante los trabajos también se renovará la pintura vial y se instalarán reductores de velocidad en las calles adyacentes para mejorar la seguridad peatonal. El municipio destinará un presupuesto de S/ 180,000 para esta obra, como parte del plan de recuperación de infraestructura vial urbana 2025.
            Invitamos a todos los vecinos a tomar precauciones durante los días de obra y agradecemos su comprensión. Esta intervención busca devolver la funcionalidad y seguridad a una intersección clave del distrito.
          </InfoItem>

          <InfoItem title="Comentarios" icon={<MessageCircle className="w-5 h-5 text-neutral-700" />}>
            Este tipo de obras son importantes para el distrito, esperamos más iniciativas similares.
          </InfoItem>
        </div>

        <CommentsSection />






      </main>

      <Footer />
    </Layout>
  );
}
