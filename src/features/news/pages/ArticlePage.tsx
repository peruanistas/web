import React from 'react';
import NewsCard from '../components/NewsCard';
import { Header } from '@common/components/header';
import { Footer } from '@common/components/footer';
import { Layout } from '@common/components/layout';
import imagenn from '../../../assets/images/no_image.jpg';
import ArticleActions from '@news/components/ArticleActions';

const ArticlePage: React.FC = () => {
  const fakeData = {
    title: 'Perú termina contrato de red dorsal con Azteca: ¿cómo evitar el naufragio de una red subutilizada?',
    subtitle: '',
    author: 'Alice Bobson',
    date: '28 Abr 2025',
    imageUrl: '/placeholder-image.jpg',
    content: `
      Tras un largo proceso que involucró análisis, debates y audiencias sobre todo en los últimos dos años, el Ministerio de Transportes y Comunicaciones (MTC) de Perú le puso fin al contrato de la Red Dorsal Nacional de Fibra Óptica (RDNFO) con Azteca Comunicaciones.
      
      El gobierno decidió terminar la Asociación Público-Privada con la compañía bajo la causal de interés público, debido a que la infraestructura de este proyecto está subutilizada. Aunque se planteó como un emblema de conectividad para el país, no está abonando de manera significativa a sus objetivos de masificación del acceso a la banda ancha y al cierre de la brecha digital.
      
      La salida de Azteca presenta la oportunidad de rediseñar el curso del proyecto para aprovechar los 13 mil 500 kilómetros de fibra óptica, pero los especialistas consideran que al mismo tiempo traerá varios retos que el gobierno entrante deberá resolver para evitar su estancamiento.
      
      Azteca dejará de ser, en la práctica, el concesionario de la red dorsal dentro de seis meses. Cuando eso suceda, el Programa Nacional de Telecomunicaciones (Promtel) asumirá la operación provisional del proyecto por hasta tres años. Y mientras tanto se tendrán que tomar decisiones importantes para definir el futuro de la red.
      
      Un grupo de trabajo para repensar la red
      
     `,
  };

  return (
    <Layout>
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Contenedor Flex Horizontal */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            {/* Iconos a la Izquierda - Fijo */}
            <div className="mt-4 w-full md:w-16 flex justify-center md:block">
              <ArticleActions />
            </div>

            {/* Artículo Principal - Flexible */}
            <div className="flex-1">
              <NewsCard
                title={fakeData.title}
                subtitle={fakeData.subtitle}
                author={fakeData.author}
                date={fakeData.date}
                imageUrl={imagenn}
                content={fakeData.content}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </Layout>
  );
};

export default ArticlePage;