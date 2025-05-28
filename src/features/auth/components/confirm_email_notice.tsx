import { MailIcon, InfoIcon } from "lucide-react"

export const ConfirmEmailNotice = () => {
  //const userEmail = "usuario@ejemplo.com"

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-[#D9D9D9] rounded-lg p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <MailIcon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-[24px] font-bold text-gray-900 mb-2">Confirma tu correo electrónico</h1>
            <p className="text-[#404040]">
              Hemos enviado un correo de confirmación al correo que ingresaste.{/*<strong>{userEmail}</strong>*/}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <InfoIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¿Por qué necesitamos verificar tu correo?</p>
                <p>
                  La verificación de tu correo electrónico nos ayuda a mantener tu cuenta segura y te permite recibir
                  notificaciones importantes sobre tu actividad en Peruanista.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-[#D9D9D9] rounded-lg p-4">
              <h2 className="font-medium text-gray-900 mb-2">Pasos para confirmar tu correo:</h2>
              <ol className="list-decimal list-inside text-[#404040] space-y-2 text-sm">
                <li>Revisa tu bandeja de entrada</li>
                <li>
                  Busca un correo de <strong>Supabase</strong>
                </li>
                <li>Haz clic en el botón "Confirmar correo electrónico"</li>
                <li>Regresa a esta página y actualiza</li>
              </ol>
            </div>
            <div className="mt-8 text-center text-sm text-[#757575]">
              <p>
                ¿No recibiste el correo? Revisa tu carpeta de spam o{" "}
                <button className="text-blue-600 hover:underline">contacta a soporte</button>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
