import React, { useEffect, useState } from 'react';
import { LiteYoutubeEmbed } from 'react-lite-yt-embed';
import { Button } from '@common/components/button';
import { Link } from 'wouter';

const LOCAL_STORAGE_KEY = 'hide_what_is_peruanista_section';

export function WhatIsPeruanistaSection() {
  const [hidden, setHidden] = useState(false);
  const [showUndo, setShowUndo] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    setHidden(stored === 'true');
  }, []);

  const handleClose = () => {
    setHidden(true);
    setShowUndo(true);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    // setTimeout(() => setShowUndo(false), 6000);
  };

  const handleUndo = () => {
    setHidden(false);
    setShowUndo(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  if (hidden && showUndo) {
    return (
      <section className="w-full mt-2 mb-8 pt-4 pb-4 px-0 flex items-center justify-center min-h-[180px]  bg-gray-100">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className='text-[1.1rem]'>Video introductorio ocultado.</p>
          <p className='text-[1.1rem]'>Puedes verlo cuando quieras en el apartado de <Link to='/about' className={'underline'}>"Quienes somos"</Link></p>
          <Button onClick={handleUndo} variant='red' className='mt-2'>Mostrar de nuevo</Button>
        </div>
      </section>
    );
  }

  if (hidden && !showUndo) return null;

  return (
    <section className="w-full mt-2 mb-8 pt-4 pb-4 px-0 flex items-center relative bg-gray-100">
      {!hidden && (
        <div className="relative w-full flex flex-row justify-center items-center gap-6 p-0 md:p-0 border-0">
          <div>
            <h2 className="text-4xl font-extrabold text-center mb-6 text-primary">¿Qué es Peruanista?</h2>
            <p className="text-lg mb-4 text-gray-900 max-w-2xl">
              Peruanista es una <strong>plataforma de gobierno abierto</strong> sin fines de lucro que te mantiene informado.
              Mira este corto video introductorio para que te enteres de todo lo que te puede ofrecer la plataforma.
            </p>
            <div className="flex justify-start mb-4">
              <button
                className="text-gray-600 underline text-base transition cursor-pointer"
                onClick={handleClose}
              >
                No mostrar de nuevo
              </button>
            </div>
          </div>
          <div className='justify-center w-full h-full max-w-[600px]'>
            <LiteYoutubeEmbed
              iframeTitle='Video de introducción peruanista'
              imageAltText='Video de introducción peruanista'
              id="Fjffq_LYI1Q"
              mute={false}
            />
          </div>
        </div>
      )}
    </section>
  );
}
