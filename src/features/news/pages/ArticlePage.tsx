import React from 'react';
import NewsCard from '../components/NewsCard';
import { Header } from '@common/components/header';
import { Footer } from '@common/components/footer';
import { Layout } from '@common/components/layout';
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
      
      De acuerdo con la resolución 689-2021 del MTC, se establecerá un grupo de trabajo, propuesto por el Viceministerio de Comunicaciones, en los próximos 90 días calendario. Este equipo será el encargado de rediseñar los criterios legales, técnicos y económicos para el funcionamiento de la RDNFO a largo plazo, incluyendo su relación con las redes regionales.
      
      Virginia Nakagawa, exviceministra de Comunicaciones de Perú, señala en entrevista con DPL News que la mesa de trabajo deberá integrarse con los perfiles profesionales de mayor experiencia, a quienes recomienda incluir a la academia y la sociedad civil en la discusión, y retornar los estudios que el Banco Mundial hizo acerca de la red dorsal.
      
      El organismo multinacional aconsejó al gobierno peruano que reestructurara la iniciativa para encaminarla por la vía correcta, pues encontró varias limitaciones. En general, concluyó que el concepto base de la red quedó obsoleto: la idea era capturar la oportunidad latente dada por el déficit de infraestructura en el país, pero en la actualidad la red se superpone con la fibra desplegada por otros operadores.
      
      La superposición propició un escenario inefectivo: sólo el 3.2 por ciento de la capacidad de la red dorsal se utilizaba hasta diciembre del año pasado, lo cual generaba ingresos que cubrían únicamente el 7.7 por ciento de los costos de operación, según datos del gobierno. Es decir, las cuentas no cuadran ni para el Estado ni para Azteca.
      
      Por su parte, José Aguilar Relátegui, exdirector General de Políticas y Regulación en Comunicaciones del Ministerio, advierte que el proceso de crear el grupo de trabajo, desarrollar propuestas y tomar decisiones, como lo determinó el MTC en la resolución, puede llevar mucho tiempo, tres años o más.
      
      Para el experto en telecomunicaciones, sería un plazo muy prolongado en el que permanecería la incertidumbre respecto al rumbo de la red dorsal. Para atenuar dicha situación, Relátegui señala que una buena opción es contratar a un tercero como operador de la RDNFO, en lugar de que Promtel tome el timón, ya que carece de experiencia en la operación de servicios públicos de telecomunicaciones.
      
      Una vez conformado el grupo de trabajo, el seductor aconseja que algunas de las preguntas que tendrán que hacerse son cuál será el modelo de operación, si se optará por una red mayorista o una minorista, si se quiere habilitar Internet o sólo servicios de transmisión de datos; al igual que cómo se formulará el funcionamiento de la Red Nacional del Estado Peruano (Redsiap) y la Red de Universidades —vinculadas a la red dorsal—, y analizar si lo más conveniente es dar gratuidad de conexión a las entidades públicas y académicas o una tarifa diferencial.
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
                imageUrl={fakeData.imageUrl}
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