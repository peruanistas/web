import { useForm } from 'react-hook-form';
import { TermsModal } from '@common/components/terms_modal';
import { Button } from '@common/components/button';
import { DatePicker } from '@common/components/date_picker';
import { useState, useEffect } from 'react';
import { DEPARTMENT_OPTIONS, PROVINCES_BY_DEPARTMENT, DISTRICTS_BY_PROVINCE } from '@common/data/geo';
import { db } from '@db/client';
import type { Tables } from '@db/schema';
import { useAuthStore } from '@auth/store/auth_store';
import { useLocation } from 'wouter';
import 'react-phone-number-input/style.css';
import { CountryDropdown } from 'react-country-region-selector';
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import dniHelpImage from '@assets/images/dni_help.png';
import { AlertTriangle } from 'lucide-react';

// Utility function to convert uppercase names to Pascal case
const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Step 1 form inputs (DNI verification)
type Step1Inputs = {
  document_number: string;
  verification_code: string;
  emission_date: string;
};

// Step 2 form inputs (complete profile)
type Step2Inputs = {
  celular: string;
  pais: string;
  departamento: string;
  provincia: string;
  distrito: string;
  acceptTerms: boolean;
};

// DNI verification response type
type DNIVerificationResponse = {
  verified: boolean;
  verification_nonce_id: string;
  details: {
    document_number: { provided: string; reniec: string; match: boolean };
    verification_code: { provided: string; reniec: string; match: boolean };
    emission_date: { provided: string; reniec: string; match: boolean };
  };
  person: {
    name: string;
    first_lastname: string;
    second_lastname: string;
    full_name: string;
  };
  error?: string;
};

export const CompleteProfileForm = () => {
  const { setProfileCompleted } = useAuthStore.getState();
  const { user } = useAuthStore();
  const [, navigate] = useLocation();

  // Form step state
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [verifiedUserData, setVerifiedUserData] = useState<DNIVerificationResponse | null>(null);

  // Step 1 form
  const step1Form = useForm<Step1Inputs>();
  const [step1Loading, setStep1Loading] = useState(false);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // Step 2 form
  const step2Form = useForm<Step2Inputs>();
  const [modalVisible, setModalVisible] = useState<'terminos' | 'privacidad' | null>(null);
  const [step2Error, setStep2Error] = useState<string | null>(null);

  const departamentoSeleccionado = step2Form.watch('departamento');
  const provinciaSeleccionada = step2Form.watch('provincia');

  const provincias = departamentoSeleccionado
    ? PROVINCES_BY_DEPARTMENT[departamentoSeleccionado] || []
    : [];

  const distritos = provinciaSeleccionada
    ? DISTRICTS_BY_PROVINCE[provinciaSeleccionada] || []
    : [];

  // Reset provincia and distrito when departamento changes
  useEffect(() => {
    step2Form.setValue('provincia', '');
    step2Form.setValue('distrito', '');
  }, [departamentoSeleccionado, step2Form]);

  useEffect(() => {
    if (!user) return;
    const nonceData = getSignupNonceData(user.id);
    if (nonceData) {
      setVerifiedUserData(nonceData);
      setCurrentStep(2);
    }
  }, [user]);

  // Reset distrito when provincia changes
  useEffect(() => {
    step2Form.setValue('distrito', '');
  }, [provinciaSeleccionada, step2Form]);

  // Step 1: DNI Verification
  const onStep1Submit = async (data: Step1Inputs) => {
    setStep1Loading(true);
    setStep1Error(null);

    if (!user) {
      toast('Primero vuelve a registrate');
      return;
    }

    try {
      const response = await fetch(
        'https://blnqgjxcgdyaeutdeomf.supabase.co/functions/v1/dni_validation_nonce',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            document_number: data.document_number,
            verification_code: data.verification_code,
            emission_date: data.emission_date,
          }),
        }
      );

      const result: DNIVerificationResponse = await response.json();

      if (!response.ok || !result.verified) {
        setStep1Error(result.error || 'Error en la verificación del DNI');
        toast.error('Error en la verificación del DNI');
        return;
      }

      window.localStorage.setItem(`verification_nonce_result_${user.id}`, JSON.stringify(result));

      // Success - store verified data and move to step 2
      setVerifiedUserData(result);
      setCurrentStep(2);
      toast.success('DNI verificado correctamente');
    } catch (error) {
      console.error('Error verifying DNI:', error);
      setStep1Error('Error de conexión. Inténtalo de nuevo.');
      toast.error('Error de conexión');
    } finally {
      setStep1Loading(false);
    }
  };

  // Step 2: Complete Profile
  const onStep2Submit = async (data: Step2Inputs) => {
    if (!user || !verifiedUserData) {
      setStep2Error('Datos de verificación no disponibles');
      return;
    }

    try {
      const phoneParsed = parsePhoneNumber(data.celular || '');

      console.log({ nonce: getSignupNonceData(user.id)!.verification_nonce_id });

      const { data: signupCompleteData, error } = await db.rpc('signup_complete', {
        nonce_id: getSignupNonceData(user.id)!.verification_nonce_id,
        p_celular: phoneParsed?.nationalNumber || '',
        p_phone_country_code: phoneParsed?.countryCallingCode
          ? `+${phoneParsed.countryCallingCode}`
          : '',
        p_country_code: data.pais,
        p_geo_department: data.departamento,
        p_geo_district: data.distrito,
      }).single();

      if (error) throw error;

      if (!signupCompleteData.success) {
        toast.error('No se pudo crear el perfil. Por favor verifica la información');
        return;
      }

      // Refetch the user profile to update the auth store with complete data
      const { data: updatedProfile, error: fetchError } = await db
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.warn('Failed to refetch profile after update:', fetchError);
      } else if (updatedProfile) {
        // Update the auth store with the complete profile data
        useAuthStore.getState().setUser({
          ...user,
          profile: updatedProfile as Required<Tables<'profiles'>>,
        });
      }

      setProfileCompleted(true);
      localStorage.removeItem(`verification_nonce_result_${user.id}`);
      toast.success('¡Perfil completado exitosamente!');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      setStep2Error(
        error instanceof Error ? error.message : 'Error al guardar el perfil'
      );
      toast.error('Error al guardar el perfil');
    }
  };

  return (
    <div className="w-full xl:w-[800px] mx-auto">
      <div className="bg-white border border-[#D9D9D9] rounded-lg p-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
              1
            </div>
            <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
              2
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <>
            <h2 className="text-[24px] font-bold text-gray-900 mb-2 text-center">
              Verificación de Identidad
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Para garantizar la seguridad, necesitamos verificar tu identidad con tu DNI
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side - Form */}
              <div>
                {step1Error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {step1Error}
                  </div>
                )}

                <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-6">
                  <div>
                    <label className="text-[#404040] block mb-1">
                      Número de DNI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="12345678"
                      className="border border-[#D9D9D9] rounded-lg p-3 w-full text-[#404040]"
                      {...step1Form.register('document_number', {
                        required: 'Campo requerido',
                        pattern: {
                          value: /^[0-9]{8}$/,
                          message: 'El DNI debe tener exactamente 8 dígitos'
                        }
                      })}
                    />
                    {step1Form.formState.errors.document_number && (
                      <p className="text-red-500 text-xs mt-1">
                        {step1Form.formState.errors.document_number.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[#404040] block mb-1">
                      Código de verificación (1 dígito) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="1"
                      className="border border-[#D9D9D9] rounded-lg p-3 w-full text-[#404040]"
                      {...step1Form.register('verification_code', {
                        required: 'Campo requerido',
                        pattern: {
                          value: /^[0-9]{1,4}$/,
                          message: 'Código inválido'
                        }
                      })}
                    />
                    {step1Form.formState.errors.verification_code && (
                      <p className="text-red-500 text-xs mt-1">
                        {step1Form.formState.errors.verification_code.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[#404040] block mb-1">
                      Fecha de nacimiento <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      control={step1Form.control}
                      name="emission_date"
                      rules={{
                        required: 'Campo requerido',
                        pattern: {
                          value: /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/,
                          message: 'Formato debe ser DD/MM/YYYY'
                        }
                      }}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="30/01/2004"
                        />
                      )}
                    />
                    {step1Form.formState.errors.emission_date && (
                      <p className="text-red-500 text-xs mt-1">
                        {step1Form.formState.errors.emission_date.message}
                      </p>
                    )}
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800 text-center">
                      Esta información es solo para fines de verificación y no será almacenada
                    </p>
                  </div>

                  <Button
                    variant="red"
                    className="font-semibold w-full cursor-pointer"
                    type="submit"
                    disabled={step1Loading}
                  >
                    {step1Loading ? 'Verificando...' : 'Verificar DNI'}
                  </Button>
                </form>
              </div>

              {/* Right side - DNI Help Image */}
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ¿Dónde encuentro estos datos?
                </h3>
                <img
                  src={dniHelpImage}
                  alt="Guía para encontrar los datos del DNI"
                  className="max-w-full h-auto border border-gray-200 rounded-lg shadow-sm"
                />
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Estos datos se encuentran en tu DNI físico
                </p>
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && verifiedUserData && (
          <>
            <h2 className="text-[24px] font-bold text-gray-900 mb-2 text-center">
              Completa tu perfil
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Tu identidad ha sido verificada. Completa los datos restantes
            </p>

            {/* Verified Identity Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">✓ Identidad Verificada</h3>
              <div className="text-sm text-green-800">
                <p><strong>Nombre:</strong> {formatName(verifiedUserData.person.full_name)}</p>
                <p><strong>DNI:</strong> {verifiedUserData.details.document_number.reniec}</p>
              </div>
            </div>

            {step2Error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {step2Error}
              </div>
            )}

            <form
              onSubmit={step2Form.handleSubmit(onStep2Submit)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
            >
              {/* Read-only fields */}
              <div>
                <label className="text-[#404040] block mb-1">Nombres</label>
                <input
                  type="text"
                  value={formatName(verifiedUserData.person.name)}
                  className="border border-gray-300 rounded-lg p-2 w-full text-gray-500 bg-gray-50 cursor-not-allowed"
                  disabled
                />
              </div>

              <div>
                <label className="text-[#404040] block mb-1">Apellido paterno</label>
                <input
                  type="text"
                  value={formatName(verifiedUserData.person.first_lastname)}
                  className="border border-gray-300 rounded-lg p-2 w-full text-gray-500 bg-gray-50 cursor-not-allowed"
                  disabled
                />
              </div>

              <div>
                <label className="text-[#404040] block mb-1">Apellido materno</label>
                <input
                  type="text"
                  value={formatName(verifiedUserData.person.second_lastname)}
                  className="border border-gray-300 rounded-lg p-2 w-full text-gray-500 bg-gray-50 cursor-not-allowed"
                  disabled
                />
              </div>

              <div>
                <label className="text-[#404040] block mb-1">DNI</label>
                <input
                  type="text"
                  value={verifiedUserData.details.document_number.reniec}
                  className="border border-gray-300 rounded-lg p-2 w-full text-gray-500 bg-gray-50 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* Editable fields */}
              <div className="sm:col-span-2">
                <label className="text-[#404040] block mb-1">
                  Celular <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={step2Form.control}
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
                      className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040] cursor-pointer"
                    />
                  )}
                />
                {step2Form.formState.errors.celular && (
                  <p className="text-red-500 text-xs mt-1">{step2Form.formState.errors.celular.message}</p>
                )}
              </div>

              <div>
                <label className="text-[#404040] block mb-1">
                  País <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={step2Form.control}
                  name="pais"
                  defaultValue='Peru'
                  rules={{
                    required: 'Campo requerido',
                  }}
                  render={({ field }) => (
                    <CountryDropdown
                      disabled={field.disabled}
                      name={field.name}
                      onChange={field.onChange}
                      ref={field.ref}
                      value={field.value}
                      defaultValue={'PE'}
                      className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040] cursor-pointer"
                    />
                  )}
                />
                {step2Form.formState.errors.pais && (
                  <p className="text-red-500 text-xs mt-1">{step2Form.formState.errors.pais.message}</p>
                )}
              </div>

              <div>
                <label className="text-[#404040] block mb-1">
                  Departamento <span className="text-red-500">*</span>
                </label>
                <select
                  className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040] truncate cursor-pointer"
                  {...step2Form.register('departamento', { required: 'Campo requerido' })}
                >
                  <option value="">Selecciona departamento</option>
                  {DEPARTMENT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value} className="truncate">
                      {option.label}
                    </option>
                  ))}
                </select>
                {step2Form.formState.errors.departamento && (
                  <p className="text-red-500 text-xs mt-1">{step2Form.formState.errors.departamento.message}</p>
                )}
              </div>

              <div>
                <label className="text-[#404040] block mb-1">
                  Provincia <span className="text-red-500">*</span>
                </label>
                <select
                  className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040] truncate cursor-pointer"
                  {...step2Form.register('provincia', { required: 'Campo requerido' })}
                  disabled={!departamentoSeleccionado}
                >
                  <option value="">
                    {!departamentoSeleccionado ? 'Selecciona departamento' : 'Selecciona provincia'}
                  </option>
                  {provincias.map(option => (
                    <option key={option.value} value={option.value} className="truncate">
                      {option.label}
                    </option>
                  ))}
                </select>
                {step2Form.formState.errors.provincia && (
                  <p className="text-red-500 text-xs mt-1">{step2Form.formState.errors.provincia.message}</p>
                )}
              </div>

              <div>
                <label className="text-[#404040] block mb-1">
                  Distrito <span className="text-red-500">*</span>
                </label>
                <select
                  className="border border-[#D9D9D9] rounded-lg p-2 w-full text-[#404040] cursor-pointer"
                  {...step2Form.register('distrito', { required: 'Campo requerido' })}
                  disabled={!provinciaSeleccionada}
                >
                  <option value="">
                    {!provinciaSeleccionada ? 'Selecciona provincia' : 'Selecciona distrito'}
                  </option>
                  {distritos.map(option => (
                    <option key={option.value} value={option.value} className="truncate">
                      {option.label}
                    </option>
                  ))}
                </select>
                {step2Form.formState.errors.distrito && (
                  <p className="text-red-500 text-xs mt-1">{step2Form.formState.errors.distrito.message}</p>
                )}
              </div>

              {/* Location Voting Warning */}
              <div className="sm:col-span-2">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900 mb-1">Importante sobre tu ubicación</h4>
                    <p className="text-sm text-amber-800">
                      Tus votos sumarán más puntos para los proyectos que sean de tu distrito. Recuerda, solo puedes cambiar tu distrito cada 6 meses.
                    </p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 text-sm text-[#757575]">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1 cursor-pointer"
                    {...step2Form.register('acceptTerms', { required: 'Debes aceptar los términos y condiciones' })}
                  />
                  <span>
                    He leído y acepto los{' '}
                    <button
                      type="button"
                      className="underline text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => setModalVisible('terminos')}
                    >
                      Términos y condiciones
                    </button>{' '}
                    y la{' '}
                    <button
                      type="button"
                      className="underline text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => setModalVisible('privacidad')}
                    >
                      Política de privacidad
                    </button>
                    .
                  </span>
                </label>
                {step2Form.formState.errors.acceptTerms && (
                  <p className="text-red-500 text-xs mt-1">{step2Form.formState.errors.acceptTerms.message}</p>
                )}
              </div>

              <div className="sm:col-span-2 flex gap-4">
                <Button
                  type="button"
                  variant="white"
                  className="flex-1 cursor-pointer"
                  onClick={() => setCurrentStep(1)}
                >
                  Volver
                </Button>
                <Button
                  variant="red"
                  className="font-semibold flex-1 cursor-pointer"
                  type="submit"
                  disabled={step2Form.formState.isSubmitting}
                >
                  {step2Form.formState.isSubmitting ? 'Guardando...' : 'Crear cuenta'}
                </Button>
              </div>
            </form>
          </>
        )}

        {modalVisible && (
          <TermsModal
            isOpen={true}
            onClose={() => setModalVisible(null)}
            title={
              modalVisible === 'terminos'
                ? 'Términos y condiciones'
                : 'Política de privacidad'
            }
          >
            {modalVisible === 'terminos' ? (
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

function getSignupNonceData(user_id: string): DNIVerificationResponse | null {
  const nonceResult = window.localStorage.getItem(`verification_nonce_result_${user_id}`);
  if (!nonceResult) {
    return null;
  }
  const resultParsed: DNIVerificationResponse = JSON.parse(nonceResult);
  return resultParsed;
}
