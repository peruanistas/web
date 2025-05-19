import { Footer } from '@common/components/footer';
import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import { HomeFeed } from '@home/components/feed';
import { HomeBanner } from '@home/components/home_banner';

export function HomePage() {
  return (
    <Layout>
      <Header />
      <HomeBanner />
      <div className='mt-8'>
        <HomeFeed />
      </div>
      <Footer />
    </Layout>
  );
}
