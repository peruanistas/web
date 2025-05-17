import bannersmall from '@assets/images/banner_sm.png';

type PageBannerProps = {
  title: string,
  description: string,
  trailing?: React.ReactNode,
};

export function PageBanner({ title, description, trailing }: PageBannerProps) {
  return (
    <div className='flex items-end place-content-between gap-4 px-page' style={{
      backgroundImage: `url(${bannersmall})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      maxHeight: 175,
      height: 175,
      boxShadow: 'inset 0px 175px 0px rgba(0, 0, 0, 0.6)',
    }}>
      <div className='flex flex-col justify-center gap-4 h-full'>
        <h1 className='text-5xl font-bold text-white'>
          {title}
        </h1>
        <p className='text-xl text-white'>
          {description}
        </p>
      </div>
      {trailing}
    </div>
  );
}
