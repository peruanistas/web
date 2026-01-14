import yapeQR from '@assets/images/yape_qr.png';

interface DonationSectionProps {
  className?: string;
}

export function DonationSection({ className = '' }: DonationSectionProps) {
  return (
    <div className={`bg-white border border-gray-200 shadow-sm p-4 rounded-xl w-full max-w-[320px] flex flex-col items-center ${className}`}>
      <h3 className="text-lg font-bold text-black mb-3 text-center">¡Apóyanos con Yape!</h3>
      <div style={{ background: '#8d1a9e' }} className="rounded-lg flex items-center justify-center p-3">
        <img src={yapeQR} alt="Yape QR" className="w-[150px] h-[150px] object-contain bg-transparent" />
      </div>
      <p className="text-center text-sm text-gray-700 mt-3">
        ¡Tu donación nos ayuda a seguir mejorando la plataforma!
      </p>
    </div>
  );
}
