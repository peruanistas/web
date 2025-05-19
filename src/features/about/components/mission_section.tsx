import SectionSubtitle from "@common/components/subtitle";
import logo from '@assets/images/logo_no_text.webp';

export function MissionSection() {
  return (
    <section className="w-full py-25 px-6 md:px-25">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        <div className="flex-1 max-w-prose mx-auto text-justify space-y-4 text-base leading-relaxed">
          <SectionSubtitle title="Nuestra misión" />
          <p>
            En Peruanista creemos que cada persona es un proyecto en constante desarrollo. 
            Tú eres un nodo en una gran red social y productiva, y necesitas un link que te conecte con oportunidades reales en el entorno local, regional, nacional y global.
          </p>
          <p>
            Vivir sin participar en un proyecto colectivo es vivir aislado. 
            En el Perú, el 78% de la población es informal porque no está incluida en el Proyecto País.
          </p>
          <p>
            Nuestra misión es integrarte. 
            En Peruanista te brindamos información y herramientas basadas en Inteligencia Artificial para que te conectes, participes y nunca más seas excluido.
          </p>
        </div>
        <div className="w-full md:w-1/4 flex justify-center md:justify-start">
          <img
            src={logo}
            alt="Logo Peruanistas"
            className="w-full max-w-[180px] h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
