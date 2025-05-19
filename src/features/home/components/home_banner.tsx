import { Button } from '@common/components/button';
import { Link } from 'wouter';
import hero from '@assets/images/hero_image.png';

export function HomeBanner() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full text-white">
        <div className="absolute inset-0 z-0">
          <img src={hero} alt="Banner Peruanistas" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#A32929]"></div>
        </div>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col md:flex-row items-center px-4 py-8 md:py-12 lg:py-16">
          <div className="w-full md:w-2/3 space-y-4 text-center md:text-left">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold m-0">
              Únete a los peruanistas
            </h2>
            <h3 className="text-xl md:text-3xl lg:text-4xl font-bold mt-1">
              y sé parte del cambio
            </h3>
            <p className="text-[13px] md:text-base max-w-xl leading-snug mt-2 mb-4">
              Como peruanista, tendrás acceso a las últimas noticias de lo que a ti más te importa
              y podrás participar activamente en proyectos de tu comunidad.
            </p>
            <div>
              <Link to='/about'>
                <Button variant='hero'>Conoce más</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
