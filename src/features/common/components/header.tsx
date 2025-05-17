import { Button } from '@common/components/button';
import { TABS } from '@common/constants';
import { Link, useLocation } from 'wouter';
import { ContentLayout } from './content_layout';

type HeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  showNavigation?: boolean,
}

export function Header({ showNavigation, ...rest }: HeaderProps) {
  const [pathname,] = useLocation();

  return (
    <header {...rest} style={{
      whiteSpace: 'nowrap',
      backgroundColor: 'white',
      position: 'sticky',
      zIndex: 6969,
      top: 0,
      ...rest.style,
    }} >
      <ContentLayout>
        <div className='flex justify-between items-center py-4'>
          <Link href='/'>
            <div className='flex items-center gap-3'>
              <img src='/favicon.svg' alt='logo' className='h-8' width={45} />
              <h2 className="inline-block text-[18px] text-black font-semibold">
                El peruanista
              </h2>
            </div>
          </Link>

          <div className='flex gap-4 items-center'>
            <Link className={'cursor-pointer'} href='/about'>
                <div className='hidden md:flex hover:text-[#C4320A]'>
                Quiénes somos
                </div>
            </Link>
            <Link className={'cursor-pointer'} href='/'>
              <div className='hidden md:flex hover:text-[#C4320A]'>
                Crea un proyecto
              </div>
            </Link>
            <Link className={'cursor-pointer'} href='/login'>
              <Button variant='white' className='font-semibold hidden lg:flex items-center'>
                Iniciar sesión
              </Button>
            </Link>
            <Link to='/signup'>
              <Button variant='red' className='font-semibold'>
                Sé peruanista
              </Button>
            </Link>
          </div>
        </div>
      </ContentLayout>
      {
        showNavigation !== false && (
          <nav style={{
            height: 46,
            backgroundColor: 'var(--color-on-primary)',
            borderTop: '1px solid var(--color-border)',
          }}>
            <ContentLayout style={{
              height: 46,
              paddingBottom: '3px',
              paddingTop: '2px',
            }}>
              <div className='flex items-center gap-6 h-full'>
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
            </ContentLayout>
          </nav>
        )
      }
    </header>
  );
}
