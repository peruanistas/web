import { Button } from "@common/components/button";
import { Link } from "wouter";

export const LoginForm = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-[#D9D9D9] rounded-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-[#C4320A] rounded-full flex items-center justify-center mb-4 p-1">
            <div className="relative w-16 h-16"></div>
          </div>
          <h2 className="text-[30px] font-bold text-gray-900 mb-1">Iniciar sesión</h2>
            <div className="text-[#757575] text-[14px] text-center w-full">¿Aún no tienes cuenta?{" "}
              <Link to="/signup" className="underline cursor-pointer">
                Regístrate
              </Link>
            </div>
        </div>
        <div className="flex flex-col">
          <label className="text-[#404040] mb-2">Correo electrónico</label>
          <input type="text" placeholder="Email" className="border border-[#D9D9D9] rounded-lg p-2 mb-4 w-full text-[#757575]"/>
          <label className="text-[#404040] mb-2">Contraseña</label>
          <input type="password" placeholder="Contraseña" className="border border-[#D9D9D9] rounded-lg p-2 mb-4 w-full text-[#757575]"/>
          <Button variant='red' className='font-semibold w-full'>Iniciar sesión</Button>
        </div>
      </div>
    </div>
  );
}
