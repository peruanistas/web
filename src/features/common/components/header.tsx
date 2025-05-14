import { Button } from '@common/components/button';

// TODO: manage responsiveness
export function Header() {
  return (
    <header className='flex justify-between items-center p-4 bg-white border-b border-gray-300 px-page'>
      <div className='flex items-center gap-3'>
        <img src='/favicon.svg' alt='logo' className='h-8' width={45} />
        <h2 className="inline-block text-[18px] text-black font-semibold">
          El peruanista
        </h2>
      </div>

      <div className='flex gap-4 items-center'>
        <div>
          Quiénes somos
        </div>
        <Button variant='white' className='font-semibold'>
          Crea un proyecto
        </Button>
        <Button variant='red' className='font-semibold'>
          Sé peruanista
        </Button>
      </div>
    </header>
  );
}
