import { Footer } from '@common/components/footer';
import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import { PageBanner } from '@common/components/page_banner';
import { HomeFeed } from '@home/components/feed';
import { HomeBanner } from '@home/components/home_banner';

export function HomePage() {
  return (
    <Layout>
      <Header />
      <HomeBanner
        title='Únete a los peruanistas y sé parte del cambio'
        description='Como peruanista, tendrás acceso a las últimas noticias de lo que a ti más te importa y podrás participar activamente en proyectos de tu comunidad.'
      />
      <div className='mt-8'>
        <HomeFeed />
      </div>
      <Footer />
    </Layout>
  );
}
