import { Footer } from '@common/components/footer';
import { Header } from '@common/components/header';
import { AboutBanner } from '@about/components/about_banner';
import '@auth/styles/signup.scss';
import { MissionSection } from '@about/components/mission_section';

export function AboutPage() {
  return (
    <main>
      <Header />
      <AboutBanner />
      <MissionSection />
      <Footer />
    </main>
  );
}
