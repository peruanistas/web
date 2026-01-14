import { Footer } from '@common/components/footer';
import { Header } from '@common/components/header';
import { AboutBanner } from '@about/components/about_banner';
import '@auth/styles/signup.scss';
import { MissionSection } from '@about/components/mission_section';
import { DonationSection } from '@common/components/donation_section';

export function AboutPage() {
  return (
    <main>
      <Header />
      <AboutBanner
        title="PERUANISTA"
        subtitle="Hacer que el Perú funcione"
        description="Somos una red de peruanos comprometidos con transformar nuestro país a través de proyectos que generen impacto real."
      />
      <MissionSection />

      {/* Donation Section */}
      <section className="w-full py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
            ¿Quieres apoyar nuestra misión?
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-6 text-center max-w-2xl">
            Tu donación nos permite seguir desarrollando herramientas que conectan a más peruanos con oportunidades reales.
          </p>
          <DonationSection />
        </div>
      </section>

      <Footer />
    </main>
  );
}
