import bannersmall from '@assets/images/banner_sm.webp';
import { ContentLayout } from './content_layout';

type PageBannerProps = {
  title: string,
  description: string,
  trailing?: React.ReactNode,
};

export function PageBanner({ title, description, trailing }: PageBannerProps) {
  return (
    <ContentLayout style={{
      backgroundImage: `url(${bannersmall})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center top',
      maxHeight: 175,
      height: 175,
      boxShadow: 'inset 0px 175px 0px rgba(0, 0, 0, 0.62)',
    }}>
      <div className='flex h-full items-end place-content-between gap-4'>
        <div className='flex flex-col justify-center gap-4 h-full w-full'>
          <h1 className='text-4xl md:text-5xl font-bold text-white'>
            {title}
          </h1>
          <p className='text-lg md:text-xl text-white'>
            {description}
          </p>
        </div>
        {trailing}
      </div>
    </ContentLayout>
  );
}
