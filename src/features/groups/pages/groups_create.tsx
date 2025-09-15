import { db } from '@db/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Layout } from '@common/components/layout';
import { Header } from '@common/components/header';
import { PageBanner } from '@common/components/page_banner';
import { DEPARTMENT_OPTIONS, PROVINCES_BY_DEPARTMENT, DISTRICTS_BY_PROVINCE } from '@common/data/geo';
import { pushBlobToStorage } from '@common/utils';
import { useAuthStore } from '@auth/store/auth_store';
import { Admonition } from '@common/components/admonition';
import { SuccessModal } from '@common/components/modal_create';
import { Info } from 'lucide-react';
import { MDXEditorComponent } from '@common/components/mxEditorComponent';
import TermsModal from '@common/components/termsModal';
import { MultiImageUpload } from '@common/components/multi_image_upload';
import { useMultiImageUpload } from '@common/hooks/useMultiImageUpload';

type GroupFormData = {
  groupName: string;
  description: string;
  coverImages: File[];
  department: string;
  province: string;
  district: string;
  acceptTerms: boolean;
};

const ERROR_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  IMAGE_REQUIRED: 'La imagen del grupo es obligatoria',
  IMAGE_TYPE: 'Debe ser un archivo de imagen válido',
  IMAGE_SIZE: 'El tamaño máximo permitido es 5MB',
  MAX_LENGTH: 'Máximo 255 caracteres',
  LOGIN_REQUIRED: 'Debes iniciar sesión para crear un grupo',
};

export function GroupsCreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
    trigger,
  } = useForm<GroupFormData>();

  register('description', {
    required: ERROR_MESSAGES.REQUIRED,
    validate: (value) => value?.trim().length > 0 || ERROR_MESSAGES.REQUIRED,
  });

  // Initialize multi-image upload hook
  const multiImageUpload = useMultiImageUpload({
    fieldName: 'coverImages',
    setValue,
    trigger,
    maxImages: 1,
  });

  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);

  // Cascade resets for department -> province -> district
  const departmentValue = watch('department');
  const provinceValue = watch('province');

  useEffect(() => {
    setValue('province', '');
    setValue('district', '');
  }, [departmentValue, setValue]);

  useEffect(() => {
    setValue('district', '');
  }, [provinceValue, setValue]);

  const onSubmit = async (form_data: GroupFormData) => {
    try {
      if (!user) throw new Error('Debes iniciar sesión para crear un grupo');
      if (!form_data.coverImages[0])
        throw new Error('No se subió ninguna imagen del grupo');

      const uploadedPath = await pushBlobToStorage(db, 'multimedia', form_data.coverImages[0]);

      const groupData = {
        name: form_data.groupName,
        description: form_data.description,
        geo_department: form_data.department,
        geo_district: form_data.district,
        image_url: uploadedPath,
        owner_id: user.id,
      };

      const { data, error } = await db
        .from('groups')
        .insert(groupData)
        .select('id')
        .single();

      if (error) throw error;
      if (!data?.id) throw new Error('No se obtuvo ID del grupo');
      setCreatedGroupId(data.id);
      setIsModalOpen(true);
      reset();
    } catch (error) {
      console.error('Error al crear grupo:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Ocurrió un error desconocido';
      alert(`Error: ${errorMessage}`);
    }
  };

  // Register coverImages field for react-hook-form
  register('coverImages', {
    required: ERROR_MESSAGES.IMAGE_REQUIRED,
  });

  const handleDescriptionChange = (markdown: string) => {
    setValue('description', markdown, { shouldValidate: true });
    trigger('description');
  };

  useEffect(() => {
    document.title = 'Crear Grupo';
  }, []);

  return (
    <Layout>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen pb-12">
        <PageBanner
          title="Crear Grupo"
          description="Completa el formulario para crear un nuevo grupo"
          variant="group"
        />
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {!user && (
              <Admonition
                title="Debes iniciar sesión para crear grupos"
                icon={<Info />}
              />
            )}

            {/* Nombre del Grupo */}
            <div>
              <label
                htmlFor="groupName"
                className="block font-medium text-gray-700 mb-1"
              >
                Nombre del Grupo <span className="text-red-500">*</span>
              </label>
              <input
                id="groupName"
                type="text"
                {...register('groupName', {
                  required: ERROR_MESSAGES.REQUIRED,
                  maxLength: {
                    value: 255,
                    message: ERROR_MESSAGES.MAX_LENGTH,
                  },
                })}
                className={`w-full px-3 py-2 border rounded-md ${errors.groupName ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Mi grupo increíble"
              />
              {errors.groupName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.groupName.message}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label
                htmlFor="description"
                className="block font-medium text-gray-700 mb-1"
              >
                Descripción <span className="text-red-500">*</span>
              </label>
              <div id="description" aria-describedby="description-error">
                <MDXEditorComponent
                  markdown={watch('description') || ''}
                  onChange={handleDescriptionChange}
                  error={!!errors.description}
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message || ERROR_MESSAGES.REQUIRED}
                </p>
              )}
            </div>

            {/* Imagen de portada */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Imagen del grupo <span className="text-red-500">*</span>
              </label>
              <MultiImageUpload
                files={multiImageUpload.files}
                onChange={multiImageUpload.handleFilesChange}
                maxImages={1}
                maxFileSize={5 * 1024 * 1024} // 5MB
                accept="image/*"
              />
              {errors.coverImages && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.coverImages.message}
                </p>
              )}
            </div>

            {/* Ubicación - Departamento, Provincia, Distrito */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Select para Departamento */}
              <div>
                <label
                  htmlFor="department"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Departamento <span className="text-red-500">*</span>
                </label>
                <select
                  id="department"
                  {...register('department', {
                    required: 'El departamento es obligatorio',
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Seleccione un departamento</option>
                  {DEPARTMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.department.message}
                  </p>
                )}
              </div>

              {/* Select para Provincia (dependiente del Departamento seleccionado) */}
              <div>
                <label
                  htmlFor="province"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Provincia <span className="text-red-500">*</span>
                </label>
                <select
                  id="province"
                  disabled={!watch('department')}
                  {...register('province', {
                    required: 'Debe seleccionar una provincia',
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${errors.province ? 'border-red-500' : 'border-gray-300'
                    } ${!watch('department') ? 'bg-gray-100' : ''}`}
                >
                  <option value="">
                    {watch('department')
                      ? 'Seleccione una provincia'
                      : 'Primero seleccione un departamento'}
                  </option>
                  {watch('department') &&
                    PROVINCES_BY_DEPARTMENT[watch('department')]?.map(
                      (option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      )
                    )}
                </select>
                {errors.province && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.province.message}
                  </p>
                )}
              </div>

              {/* Select para Distrito (dependiente de la Provincia seleccionada) */}
              <div>
                <label
                  htmlFor="district"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Distrito <span className="text-red-500">*</span>
                </label>
                <select
                  id="district"
                  disabled={!watch('province')}
                  {...register('district', {
                    required: 'Debe seleccionar un distrito',
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${errors.district ? 'border-red-500' : 'border-gray-300'
                    } ${!watch('province') ? 'bg-gray-100' : ''}`}
                >
                  <option value="">
                    {watch('province')
                      ? 'Seleccione un distrito'
                      : 'Primero seleccione una provincia'}
                  </option>
                  {watch('province') &&
                    DISTRICTS_BY_PROVINCE[watch('province')]?.map(
                      (option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      )
                    )}
                </select>
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.district.message}
                  </p>
                )}
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="flex">
              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  {...register('acceptTerms', {
                    required: 'Debes aceptar los términos y condiciones',
                  })}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-base">
                <label
                  htmlFor="acceptTerms"
                  className="font-medium text-gray-700"
                >
                  Acepto los{' '}
                  <button
                    type="button"
                    onClick={() => setIsTermsOpen(true)}
                    className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                  >
                    términos y condiciones
                  </button>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>
            </div>

            {/* Botón de envío */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--color-primary)] text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creando...' : 'Crear Grupo'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="¡Grupo creado exitosamente!"
        type="grupo"
        routeType="grupos"
        projectId={createdGroupId}
      />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </Layout>
  );
}
