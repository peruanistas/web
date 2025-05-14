import { Footer } from '@common/components/footer';
import { Header } from '@common/components/header';
import { HomeFeed } from '@home/components/feed';
import { HomeBanner } from '@home/components/home_banner';
import '@home/styles/home.scss';

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
