import { Button } from '@common/components/button';
import { TABS } from '@common/constants';
import { Link, useLocation } from 'wouter';

type HeaderProps = {
  showNavigation?: boolean,
}

export function Header({ showNavigation }: HeaderProps) {
  const [pathname,] = useLocation();

  return (
    <header style={{
      whiteSpace: 'nowrap',
    }}>
      <div className='flex justify-between items-center p-4 bg-white px-page'>
        <div className='flex items-center gap-3'>
          <img src='/favicon.svg' alt='logo' className='h-8' width={45} />
          <h2 className="inline-block text-[18px] text-black font-semibold">
            El peruanista
          </h2>
        </div>

        {/* Dissapear on sm screens */}
        <div className='flex gap-4 items-center'>
          <div className='hidden md:flex'>
            Quiénes somos
          </div>
          <Button variant='white' className='font-semibold hidden lg:flex items-center'>
            Crea un proyecto
          </Button>
          <Link to='/signup'>
            <Button variant='red' className='font-semibold'>
              Sé peruanista
            </Button>
          </Link>
        </div>
      </div>
      {
        showNavigation !== false && (
          <nav style={{
            height: 46,
            backgroundColor: 'var(--color-on-primary)',
            borderTop: '1px solid var(--color-border)',
          }}>
            <div className='flex items-center gap-6 py-[2px] h-full px-page'>
              {
                TABS.map((tab) => (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`flex items-center h-full ${tab.regex.test(pathname) ? 'border-b-3 border-primary' : ''}`}
                  >
                    {tab.name}
                  </Link>
                ))
              }
            </div>
          </nav>
        )
      }
    </header>
  );
}
