import { TABS } from '@common/constants';
import { Link } from 'wouter';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='flex flex-col justify-start p-4 bg-white px-page border-t-2 border-border'>
      <div className='flex items-center border-b-2 border-border pb-6 gap-16'>
        <img src='/favicon.svg' alt='logo' width={128} />
        <div className='flex flex-col gap-2'>
          <div className='font-bold'>MENÚ</div>
          {
            TABS.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className='flex h-full mr-4'
              >
                {tab.name}
              </Link>
            ))
          }
        </div>
      </div>
      <div className='text-sm mt-4'>
        © {year} El Peruanista. Todos los derechos reservados.
      </div>
    </footer>
  );
}
