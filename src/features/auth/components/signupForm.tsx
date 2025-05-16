import { Button } from "@common/components/button";

export const SignUpForm = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-[#D9D9D9] rounded-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-[#C4320A] rounded-full flex items-center justify-center mb-4 p-1">
            <div className="relative w-16 h-16">
            </div>
          </div>
          <h2 className="text-[30px] font-bold text-gray-900 mb-1">Únete a El peruanista</h2>
          <p className="text-[#757575] text-[14px] text-center">¡Sé parte de la comunidad más transformadora del Perú!</p>
        </div>
        <form className="flex flex-col">
          <label className="text-[#404040] text-[12px] mb-2">Correo electrónico</label>
          <input type="text" placeholder="Email" className="border border-[#D9D9D9] rounded-lg p-2 mb-4 w-full text-[#757575] text-[12px]"/>
          <label className="text-[#404040] text-[12px] mb-2">Contraseña</label>
          <input type="password" placeholder="Contraseña" className="border border-[#D9D9D9] rounded-lg p-2 mb-4 w-full text-[#757575] text-[12px]"/>
          <Button variant='red' className='font-semibold w-full'>Crear cuenta</Button>
        </form>
      </div>
    </div>
  )
}
