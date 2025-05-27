import { useState, useRef, useEffect } from 'react';
import { Button } from '@common/components/button';
import { TABS } from '@common/constants';
import { Link, useLocation } from 'wouter';
import { ContentLayout } from './content_layout';
import { useAuthStore } from '@auth/store/auth_store';
import { db } from '@db/client';
import { User, ChevronDown, Plus } from 'lucide-react';
import logo from '@assets/images/logo_with_text.webp';

export const HEADER_NAV_HEIGHT = 46;
export const HEADER_BAR_HEIGHT = 72;
export const HEADER_FULL_HEIGHT = HEADER_NAV_HEIGHT + HEADER_BAR_HEIGHT;

type HeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  showNavigation?: boolean;
};

export function Header({ showNavigation, ...rest }: HeaderProps) {
  const [pathname] = useLocation();
  const { user, clearUser } = useAuthStore();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await db.auth.signOut();
    clearUser();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      {...rest}
      style={{
        whiteSpace: 'nowrap',
        backgroundColor: 'white',
        position: 'sticky',
        zIndex: 6969,
        top: 0,
        ...rest.style,
      }}
    >
      <ContentLayout>
        <div className='flex justify-between items-center py-4' style={{ height: HEADER_BAR_HEIGHT }}>
          <Link href='/'>
            <div className='flex items-center gap-3'>
              <img src={logo} alt='logo' className='h-9' />
            </div>
          </Link>
          <div className='flex gap-4 items-center relative text-sm'>
            <Link className='cursor-pointer' href='/about'>
              <div className='hidden md:flex hover:text-[#C4320A]'>Quiénes somos</div>
            </Link>

            {/* Nuevo botón con menú desplegable */}
            <div className='relative' ref={menuRef}>
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className='hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer'
              >
                <Plus size={16} />
                Crear
                <ChevronDown size={16} />
              </button>
              {openMenu && (
                <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-md z-50'>
                  <Link href='/proyectos/crear'>
                    <div className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>Crear proyecto</div>
                  </Link>
                  <Link href='/feed/crear'>
                    <div className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>Crear noticia</div>
                  </Link>
                  <Link href='/eventos/crear'>
                    <div className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>Crear evento</div>
                  </Link>
                </div>
              )}
            </div>

            {!user ? (
              <>
                <Link className='cursor-pointer' href='/login'>
                  <Button variant='white' className='font-semibold hidden lg:flex items-center'>
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to='/signup'>
                  <Button variant='red' className='font-semibold'>Sé peruanista</Button>
                </Link>
              </>
            ) : (
              <div className='relative' ref={menuRef}>
                <button onClick={() => setOpenMenu(!openMenu)} className='p-1.5 rounded-full border hover:bg-gray-100'>
                  <User size={22} className='text-gray-700' />
                </button>
                {openMenu && (
                  <div className='absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50'>
                    <Link href='/perfil'>
                      <div className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>Mi perfil</div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600'
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ContentLayout>

      {showNavigation !== false && (
        <nav
          style={{
            height: 46,
            backgroundColor: 'var(--color-on-primary)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <ContentLayout style={{ height: 46, paddingBottom: '3px', paddingTop: '2px' }}>
            <div className='flex items-center gap-6 h-full'>
              {TABS.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center h-full ${
                    tab.regex.test(pathname) ? 'border-b-3 border-primary' : ''
                  }`}
                >
                  {tab.name}
                </Link>
              ))}
            </div>
          </ContentLayout>
        </nav>
      )}
    </header>
  );
}
