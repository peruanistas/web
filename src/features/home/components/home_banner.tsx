import { Button } from '@common/components/button';
import { Carousel } from '@common/components/carousel';
import { Link } from 'wouter';
import bannerCarousel1 from '@assets/images/banner_carousel_1.png';
import bannerCarousel2 from '@assets/images/banner_carousel_2.png';
import bannerCarousel3 from '@assets/images/banner_carousel_3.png';
import { ContentLayout } from '@common/components/content_layout';

type MainBannerProps = {
  title: string;
  description: string;
  trailing?: React.ReactNode;
};

const carouselImages = [
  bannerCarousel1,
  bannerCarousel2,
  bannerCarousel3,
];

// @ts-expect-error temporarily unused
export function HomeBanner({ title, description, trailing }: MainBannerProps) {

  return (
    <div className="relative w-full bg-[#f80505]" style={{ maxHeight: 325, height: 325 }}>
      <div className="absolute inset-0 z-0">
        <Carousel
          images={carouselImages}
          autoSlide={true}
          autoSlideInterval={8000}
          showDots={true}
          showArrows={false}
          className="w-full h-full"
          backgroundSize="contain"
          backgroundPosition="center"
        />
      </div>

      {/* <div className="absolute inset-0 z-15 bg-gradient-to-r from-[#A32929]/100 to-[#A32929]/40 md:from-[#A32929]/90 md:to-transparent" /> */}

      {/* <ContentLayout className="relative z-20 h-full">
        <div className="flex h-full items-end place-content-between gap-4">
          <div className="flex flex-col justify-center gap-4 h-full w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-white md:w-1/3">{title}</h1>
            <p className="text-sm md:text-base leading-snug text-white md:w-2/4">{description}</p>
            <div>
              <Link to="/about">
                <Button variant="hero">Conoce más</Button>
              </Link>
            </div>
          </div>
          {trailing}
        </div>
      </ContentLayout> */}
    </div>
  );
}
