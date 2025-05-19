import { useForm } from "react-hook-form";
import { TermsModal } from "@common/components/terms_modal";
import { Button } from "@common/components/button";
import { useState } from "react";
import { PE_DEPARTMENTS } from "@common/data/geo";
import { getDistrictsForDepartment } from "@common/utils";
import { db } from "@db/client";
import { useAuthStore } from "@auth/store/auth_store";
import { useLocation } from "wouter";

type Inputs = {
  nombres: string;
  apellidos: string;
  celular: string;
  tipo_documento: 'dni' | 'carnet';
  numero_documento: string;
  departamento: string;
  distrito: string;
  acceptTerms: boolean;
};

export const CompleteProfileForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      tipo_documento: 'dni'
    }
  });

  const [modalVisible, setModalVisible] = useState<"terminos" | "privacidad" | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const departamentoSeleccionado = watch("departamento");
  const tipoDocumentoSeleccionado = watch("tipo_documento");

  const { user } = useAuthStore();
  const [, navigate] = useLocation();

  const distritos = departamentoSeleccionado
    ? getDistrictsForDepartment(departamentoSeleccionado)
    : [];

  const onSubmit = async (data: Inputs) => {
    if (!user) {
      setSubmitError("No hay usuario autenticado");
      return;
    }

    try {
      setSubmitError(null);
      const profileData = {
        id: user.id,
        nombres: data.nombres.trim(),
        apellidos: data.apellidos.trim(),
        celular: data.celular,
        tipo_documento: data.tipo_documento,
        numero_documento: data.numero_documento,
        geo_department: data.departamento,
        geo_district: data.distrito,
        profile_completed: true
      };

      const { error } = await db
        .from('profiles')
        .insert(profileData);

      if (error) {
        console.error('Error al guardar perfil:', error);
        setSubmitError('Error al guardar el perfil. Por favor, inténtalo de nuevo.');
        return;
      }

      console.log("Perfil insertado correctamente:", profileData);
      navigate('/');
    } catch (error) {
      console.error('Error inesperado:', error);
      setSubmitError('Error inesperado. Por favor, inténtalo de nuevo.');
    }
  };

  const getDocumentConfig = (tipo: 'dni' | 'carnet') => {
    if (tipo === 'dni') {
      return {
        placeholder: "8 dígitos",
        pattern: /^[0-9]{8}$/,
        message: "El DNI debe tener exactamente 8 dígitos"
      };
    } else {
      return {
        placeholder: "12 dígitos",
        pattern: /^[0-9]{12}$/,
        message: "El carnet de extranjería debe tener exactamente 12 dígitos"
      };
    }
  };

  const documentConfig = getDocumentConfig(tipoDocumentoSeleccionado);

  return (
    <div className="w-full xl:w-[300px] mx-auto">
      <div className="bg-white border border-[#D9D9D9] rounded-lg p-8">
        <h2 className="text-[24px] font-bold text-gray-900 mb-6 text-center">
          Completa tu perfil
        </h2>
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {submitError}
          </div>
        )}
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
              placeholder="Ingresa tus nombres"
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040]"
              {...register("nombres", {
                required: 'Campo requerido',
                minLength: { value: 2, message: 'Debe tener al menos 2 caracteres' }
              })}
            />
            {errors.nombres && (
              <p className="text-red-500 text-xs mt-1">{errors.nombres.message}</p>
            )}
          </div>
          <div>
            <label className="text-[#404040] block mb-1">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ingresa tus apellidos"
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040]"
              {...register("apellidos", {
                required: 'Campo requerido',
                minLength: { value: 2, message: 'Debe tener al menos 2 caracteres' }
              })}
            />
            {errors.apellidos && (
              <p className="text-red-500 text-xs mt-1">{errors.apellidos.message}</p>
            )}
          </div>
          <div>
            <label className="text-[#404040] block mb-1">
              Celular <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="987654321"
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040]"
              {...register("celular", {
                required: 'Campo requerido',
                pattern: { value: /^9[0-9]{8}$/, message: "Debe empezar con 9 y tener 9 dígitos en total" },
              })}
            />
            {errors.celular && (
              <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>
            )}
          </div>
          <div>
            <label className="text-[#404040] block mb-1">
              Tipo de documento <span className="text-red-500">*</span>
            </label>
            <select
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040]"
              style={{ width: '100%', maxWidth: '100%' }}
              {...register("tipo_documento", { required: 'Campo requerido' })}
            >
              <option value="dni">DNI (Peruano)</option>
              <option value="carnet">Carnet de Extranjería</option>
            </select>
            {errors.tipo_documento && (
              <p className="text-red-500 text-xs mt-1">{errors.tipo_documento.message}</p>
            )}
          </div>
          <div>
            <label className="text-[#404040] block mb-1">
              {tipoDocumentoSeleccionado === 'dni' ? 'DNI' : 'Carnet de Extranjería'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={documentConfig.placeholder}
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040]"
              {...register("numero_documento", {
                required: 'Campo requerido',
                pattern: { value: documentConfig.pattern, message: documentConfig.message },
              })}
            />
            {errors.numero_documento && (
              <p className="text-red-500 text-xs mt-1">{errors.numero_documento.message}</p>
            )}
          </div>
          <div>
            <label className="text-[#404040] block mb-1">
              Departamento <span className="text-red-500">*</span>
            </label>
            <select
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040] truncate"
              {...register("departamento", { required: 'Campo requerido' })}
            >
              <option value="">Selecciona departamento</option>
              {Object.entries(PE_DEPARTMENTS).map(([code, { name }]) => (
                <option key={code} value={code} className="truncate">
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
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040]"
              style={{ width: '100%', maxWidth: '100%' }}
              {...register("distrito", { required: 'Campo requerido' })}
              disabled={!departamentoSeleccionado}
            >
              <option value="">
                {!departamentoSeleccionado ? 'Selecciona departamento' : 'Selecciona distrito'}
              </option>
              {distritos.map(([code, { name }]) => (
                <option key={code} value={code} className="truncate">
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
              <input
                type="checkbox"
                className="mt-1"
                {...register("acceptTerms", { required: 'Debes aceptar los términos y condiciones' })}
              />
              <span>
                He leído y acepto los{" "}
                <button
                  type="button"
                  className="underline text-blue-600 hover:text-blue-800"
                  onClick={() => setModalVisible("terminos")}
                >
                  Términos y condiciones
                </button>{" "}
                y la{" "}
                <button
                  type="button"
                  className="underline text-blue-600 hover:text-blue-800"
                  onClick={() => setModalVisible("privacidad")}
                >
                  Política de privacidad
                </button>
                .
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-red-500 text-xs mt-1">{errors.acceptTerms.message}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Button
              variant="red"
              className="font-semibold w-full mt-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar perfil'}
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
