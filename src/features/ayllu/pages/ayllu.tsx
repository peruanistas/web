import { Footer } from "@common/components/footer"
import { Header } from "@common/components/header"
import { Layout } from "@common/components/layout"
import { PageBanner } from "@common/components/page_banner"
import SectionSubtitle from "@common/components/subtitle"
import { Clock, FileText, Users } from "lucide-react"

export function AylluPage() {
  return (
    <Layout>
      <Header />
      <PageBanner
        title="Ayllu"
        description="Simplificando gestiones y fortaleciendo organizaciones sociales y sin fines de lucro con Inteligencia Artificial."
        variant="ayllu"
      />

      {/* Coming Soon Banner */}
      <div className="bg-primary text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3">
            <Clock className="h-5 w-5" />
            <span className="text-base font-semibold">Próximamente en 6 meses</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* What is Ayllu Section */}
        <section className="w-full py-15 px-6 md:px-20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1 max-w-prose mx-auto text-justify space-y-4 text-base leading-relaxed">
              <SectionSubtitle title="¿Qué es Ayllu?" />
              <p className="text-black">
                Es una aplicación de inteligencia artificial desarrollada por Peruanista, diseñada para facilitar la gestión administrativa y documental, automatizando trámites y papeleos como la elaboración de cartas, actas, solicitudes y expedientes.
              </p>
              <p className="text-black">
                Además, brinda información actualizada sobre oportunidades, fondos y líneas de financiamiento disponibles.
              </p>
            </div>
            <div className="w-full md:w-1/4 flex justify-center md:justify-start">
              <div className="w-full max-w-[180px] h-auto bg-primary/10 rounded-2xl p-8 flex items-center justify-center">
                <FileText className="h-16 w-16 text-primary" />
              </div>
            </div>
          </div>
        </section>

        {/* Target Organizations Section */}
        <section className="w-full mb-20 px-6 md:px-20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1 max-w-prose mx-auto text-justify space-y-4 text-base leading-relaxed">
              <SectionSubtitle title="Diseñado para organizaciones" />
              <p className="text-black">
                <strong>Organizaciones Sociales de Base (OSB):</strong> Asociaciones de vecinos, asentamientos humanos,
                colectivos estudiantiles.
              </p>
              <p className="text-black">
                <strong>Asociaciones sin Fines de Lucro (ASFL):</strong> Gremios de empresarios, asociaciones de
                profesionales, organizaciones culturales.
              </p>
            </div>
            <div className="w-full md:w-1/4 flex justify-center md:justify-start">
              <div className="w-full max-w-[180px] h-auto bg-primary/10 rounded-2xl p-8 flex items-center justify-center">
                <Users className="h-16 w-16 text-primary" />
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-16 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Clock className="h-12 w-12 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">¡Muy pronto estará disponible!</h2>
            <p className="text-base text-white/90">
              Ayllu llegará en los próximos 6 meses para simplificar la gestión de organizaciones sociales.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </Layout>
  )
}

