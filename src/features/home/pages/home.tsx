import { HomeFeed } from '@/components/feed';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { HomeBanner } from '@/components/home_banner';
import '@styles/home.scss';

export function HomePage() {
  return (
    <main className='home-wrapper'>
      <Header />
      <HomeBanner />
      <HomeFeed />
      <Footer />
    </main>
  );
}
