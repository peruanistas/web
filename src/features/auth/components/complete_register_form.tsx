import { useForm } from "react-hook-form";
import { TermsModal } from "@common/components/terms_modal";
import { Button } from "@common/components/button";
import { useState } from "react";
import { PE_DEPARTMENTS } from "@common/data/geo";
import { getDistrictsForDepartment } from "@common/utils";

type Inputs = {
  nombre: string;
  apellido: string;
  celular: string;
  dni: string;
  departamento: string;
  distrito: string;
};

export const CompleteProfileForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const [modalVisible, setModalVisible] = useState<"terminos" | "privacidad" | null>(null);

  const departamentoSeleccionado = watch("departamento");

  const distritos = departamentoSeleccionado
    ? getDistrictsForDepartment(departamentoSeleccionado)
    : [];

  const onSubmit = (data: Inputs) => {
    console.log("Datos enviados:", data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white border border-[#D9D9D9] rounded-lg p-8">
        <h2 className="text-[24px] font-bold text-gray-900 mb-6 text-center">
          Completa tu perfil
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
        >
          <div>
            <label className="text-[#404040] block mb-1">
              Nombres <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nombre"
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#757575]"
              {...register("nombre", { required: 'Campo requerido' })}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
            )}
          </div>
          <div>
            <label className="text-[#404040] block mb-1">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Apellido"
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#757575]"
              {...register("apellido", { required: 'Campo requerido' })}
            />
            {errors.apellido && (
              <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>
            )}
          </div>
          <div>
            <label className="text-[#404040] block mb-1">
              Celular <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="9 dígitos"
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#757575]"
              {...register("celular", {
                required: 'Campo requerido',
                pattern: { value: /^[0-9]{9}$/, message: "9 dígitos" },
              })}
            />
            {errors.celular && (
              <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>
            )}
          </div>
          <div>
            <label className="text-[#404040] block mb-1">
              DNI <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="8 dígitos"
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#757575]"
              {...register("dni", {
                required: 'Campo requerido',
                pattern: { value: /^[0-9]{8}$/, message: "8 dígitos" },
              })}
            />
            {errors.dni && (
              <p className="text-red-500 text-xs mt-1">{errors.dni.message}</p>
            )}
          </div>
          <div>
            <label className="text-[#404040] block mb-1">
              Departamento <span className="text-red-500">*</span>
            </label>
            <select
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#757575]"
              {...register("departamento", { required: 'Campo requerido' })}
            >
              <option value="">Selecciona</option>
              {Object.entries(PE_DEPARTMENTS).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            {errors.departamento && (
              <p className="text-red-500 text-xs mt-1">{errors.departamento.message}</p>
            )}
          </div>
          <div>
            <label className="text-[#404040] block mb-1">
              Distrito <span className="text-red-500">*</span>
            </label>
            <select
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#757575]"
              {...register("distrito", { required: 'Campo requerido' })}
              disabled={!departamentoSeleccionado}
            >
              <option value="">Selecciona</option>
              {distritos.map(([code, { name }]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            {errors.distrito && (
              <p className="text-red-500 text-xs mt-1">{errors.distrito.message}</p>
            )}
          </div>
          <div className="sm:col-span-2 text-sm text-[#757575]">
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" required />
              <span>
                He leído y acepto los{" "}
                <button
                  type="button"
                  className="underline text-blue-600"
                  onClick={() => setModalVisible("terminos")}
                >
                  Términos y condiciones
                </button>{" "}
                y la{" "}
                <button
                  type="button"
                  className="underline text-blue-600"
                  onClick={() => setModalVisible("privacidad")}
                >
                  Política de privacidad
                </button>
                .
              </span>
            </label>
          </div>
          <div className="sm:col-span-2">
            <Button
              variant="red"
              className="font-semibold w-full mt-2"
              type="submit"
              disabled={isSubmitting}
            >
              Guardar perfil
            </Button>
          </div>
        </form>
        {modalVisible && (
          <TermsModal
            isOpen={true}
            onClose={() => setModalVisible(null)}
            title={
              modalVisible === "terminos"
                ? "Términos y condiciones"
                : "Política de privacidad"
            }
          >
            {modalVisible === "terminos" ? (
              <>
                <p>Estos son los términos y condiciones del servicio...</p>
                <p>Asegúrate de leerlos con atención.</p>
              </>
            ) : (
              <>
                <p>Política de privacidad que explica el uso de tus datos...</p>
                <p>Comprometidos con tu seguridad.</p>
              </>
            )}
          </TermsModal>
        )}
      </div>
    </div>
  );
};
