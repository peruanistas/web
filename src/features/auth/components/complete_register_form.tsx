import { useForm } from "react-hook-form";
import { TermsModal } from "@common/components/terms_modal";
import { Button } from "@common/components/button";
import { useState } from "react";
import { DEPARTMENT_OPTIONS, DISTRICTS_BY_DEPARTMENT } from "@common/data/geo";
import { db } from "@db/client";
import { useAuthStore } from "@auth/store/auth_store";
import { useLocation } from "wouter";
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import { Controller } from 'react-hook-form';

type Inputs = {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  celular: string;
  country_code: string;
  tipo_documento: 'dni' | 'carnet';
  numero_documento: string;
  departamento: string;
  distrito: string;
  acceptTerms: boolean;
};

export const CompleteProfileForm = () => {
  const { setProfileCompleted } = useAuthStore.getState();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      tipo_documento: 'dni'
    }
  });

  const [modalVisible, setModalVisible] = useState<"terminos" | "privacidad" | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dniError, setDniError] = useState<string | null>(null);

  const departamentoSeleccionado = watch("departamento");
  const tipoDocumentoSeleccionado = watch("tipo_documento");

  const { user } = useAuthStore();
  const [, navigate] = useLocation();


const distritos = departamentoSeleccionado
  ? DISTRICTS_BY_DEPARTMENT[departamentoSeleccionado] || []
  : [];

  const onSubmit = async (data: Inputs) => {
    if (!user) {
      setSubmitError("No hay usuario autenticado");
      return;
    }

    setDniError(null);
    setSubmitError(null);

    try {
      let dniVerified = false;
      if (data.tipo_documento === 'dni') {
        const verifyResponse = await fetch(
          'https://blnqgjxcgdyaeutdeomf.supabase.co/functions/v1/dni_validation',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
            },
            body: JSON.stringify({
              numero_documento: data.numero_documento,
              nombres: data.nombres,
              apellido_paterno: data.apellido_paterno,
              apellido_materno: data.apellido_materno,
              user_id: user.id,
            }),
          }
        );

        const verificationResult = await verifyResponse.json();
        dniVerified = verifyResponse.ok && verificationResult.verified;
        
        if (!dniVerified) {
          setDniError('Los datos no coinciden con los registros de RENIEC');
          return;
        }
      }

      const phoneParsed = parsePhoneNumber(data.celular || '');

      const profileData = {
        id: user.id,
        nombres: data.nombres.trim(),
        apellido_paterno: data.apellido_paterno.trim(),
        apellido_materno: data.apellido_materno.trim(),
        celular: phoneParsed?.nationalNumber || '',
        country_code: phoneParsed?.countryCallingCode
          ? `+${phoneParsed.countryCallingCode}`
          : '',
        tipo_documento: data.tipo_documento,
        numero_documento: data.numero_documento,
        geo_department: data.departamento,
        geo_district: data.distrito,
        profile_completed: data.tipo_documento === 'dni' ? dniVerified : true,
      };

      const { error } = await db
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;

      setProfileCompleted(profileData.profile_completed);
      navigate(profileData.profile_completed ? '/' : '/perfil?verification=failed');
    } catch (error) {
      console.error('Error:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Error al guardar el perfil'
      );
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
      <div className="w-[600px] bg-white border border-[#D9D9D9] rounded-lg p-8">
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
              Apellido paterno <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ingresa tu apellido paterno"
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040]"
              {...register("apellido_paterno", {
                required: 'Campo requerido',
                minLength: { value: 2, message: 'Debe tener al menos 2 caracteres' }
              })}
            />
            {errors.apellido_paterno && (
              <p className="text-red-500 text-xs mt-1">{errors.apellido_paterno.message}</p>
            )}
          </div>
          <div>
            <label className="text-[#404040] block mb-1">
              Apellido materno <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ingresa tu apellido materno"
              className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040]"
              {...register("apellido_materno", {
                required: 'Campo requerido',
                minLength: { value: 2, message: 'Debe tener al menos 2 caracteres' }
              })}
            />
            {errors.apellido_materno && (
              <p className="text-red-500 text-xs mt-1">{errors.apellido_materno.message}</p>
            )}
          </div>
          <div>
            <label className="text-[#404040] block mb-1">
              Celular <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="celular"
              rules={{
                required: 'Campo requerido',
                validate: (value) =>
                  isValidPhoneNumber(value || '') || 'Número de teléfono inválido',
              }}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  defaultCountry="PE"
                  international
                  countryCallingCodeEditable={false}
                  className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040]"
                />
              )}
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
              {DEPARTMENT_OPTIONS.map(option => (
                <option key={option.value} value={option.value} className="truncate">
                  {option.label}
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
              {distritos.map(option => (
                <option key={option.value} value={option.value} className="truncate">
                  {option.label}
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
            {dniError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {dniError}
              </div>
            )}
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