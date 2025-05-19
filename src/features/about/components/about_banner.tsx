import { Button } from '@common/components/button';
import { Link } from 'wouter';
import banner from '@assets/images/about_banner.png';

export function AboutBanner() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full text-white">
        <div className="absolute inset-0 z-0">
          <img src={banner} alt="Banner Peruanistas" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-[#611919]/60"></div>
        </div>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 py-12 md:py-18 lg:py-24">
          <div className="w-full space-y-4 text-center">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold m-0">
              PERUANISTAS
            </h1>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mt-1">
              Hacer que el Perú funcione para todos
            </h2>
            <p className="md:text-base max-w-xl mx-auto leading-snug mt-2 mb-4">
              Somos una red de peruanos comprometidos con transformar nuestro país a través de proyectos que generen impacto real.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/signup" className="flex-1 min-w-[120px] max-w-[200px]">
                <Button variant="white" className="font-semibold w-full">Únete a nosotros</Button>
              </Link>
              <Link to="/proyectos" className="flex-1 min-w-[120px] max-w-[200px]">
                <Button variant="white" className="font-semibold w-full">Conoce proyectos</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
