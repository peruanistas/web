import { db } from '@db/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Layout } from '@common/components/layout';
import { Header } from '@common/components/header';
import { PageBanner } from '@common/components/page_banner';
import { pushBlobToStorage } from '@common/utils';
import { DEPARTMENT_OPTIONS, PROVINCES_BY_DEPARTMENT, DISTRICTS_BY_PROVINCE } from '@common/data/geo';
import { Admonition } from '@common/components/admonition';
import { SuccessModal } from '@common/components/modal_create';
import { Info } from 'lucide-react';
import { useAuthStore } from '@auth/store/auth_store';
import { MDXEditorComponent } from '@common/components/mxEditorComponent';
import TermsModal from '@common/components/termsModal';

type ProjectFormData = {
  projectName: string;
  description: string;
  // link?: string;
  coverImage: FileList;
  department: string;
  province: string;
  district: string;
  acceptTerms: boolean;
  projectType: 'improve' | 'create';
  projectCategory:
  | 'investment'
  | 'optimization'
  | 'extension'
  | 'repair'
  | 'replacement';
  // productiveUnit: 'Opcion 1' | 'Opcion 2';
  // improvementChoice: 'Opcion 1' | 'Opcion 2';
  // creditStatus: 'Aprobado' | 'Desaprobado';
};

const ERROR_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  IMAGE_REQUIRED: 'La imagen de portada es obligatoria',
  IMAGE_TYPE: 'Debe ser un archivo de imagen válido',
  IMAGE_SIZE: 'El tamaño máximo permitido es 5MB',
  MAX_LENGTH: 'Máximo 255 caracteres',
  LOGIN_REQUIRED: 'Debes iniciar sesión para crear un proyecto',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ProjectsCreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
    trigger,
  } = useForm<ProjectFormData>({
    defaultValues: {
      projectType: 'create', // Valor por defecto
    },
  });

  register('description', {
    required: ERROR_MESSAGES.REQUIRED,
    validate: (value) => value?.trim().length > 0 || ERROR_MESSAGES.REQUIRED,
  });

  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

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

  const onSubmit = async (form_data: ProjectFormData) => {
    try {
      if (!user) throw new Error(ERROR_MESSAGES.LOGIN_REQUIRED);

      if (!form_data.coverImage[0]) {
        throw new Error(ERROR_MESSAGES.IMAGE_REQUIRED);
      }

      const bucket_path = await pushBlobToStorage(
        db,
        'multimedia',
        form_data.coverImage[0]
      );

      const { data, error } = await db
        .from('projects')
        .insert({
          title: form_data.projectName,
          content: form_data.description,
          geo_department: form_data.department,
          geo_district: form_data.district,
          image_url: bucket_path,
          author_id: user.id,
          ioarr_type: form_data.projectCategory,
          published_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) throw error;
      if (!data?.id) throw new Error('No se obtuvo ID del proyecto');
      setCreatedProjectId(data.id);
      setIsModalOpen(true);
      reset();
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(`Error: ${errorMessage}`);
    }
  };
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Extraemos las propiedades del register para el input file
  const {
    ref: fileRef,
    onChange: hookFormOnChange,
    ...fileRegisterProps
  } = register('coverImage', {
    required: ERROR_MESSAGES.IMAGE_REQUIRED,
    validate: {
      fileType: (files) =>
        files[0]?.type?.startsWith('image/') || ERROR_MESSAGES.IMAGE_TYPE,
      fileSize: (files) =>
        files[0]?.size <= MAX_FILE_SIZE || ERROR_MESSAGES.IMAGE_SIZE,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Manejar previsualización
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }

    // 2. Propagamos el evento al hook form
    hookFormOnChange(e);
    trigger('coverImage');
  };

  useEffect(() => {
    document.title = 'Crear Proyecto';
  }, []);
  const handleDescriptionChange = (markdown: string) => {
    setValue('description', markdown, { shouldValidate: true });
    trigger('description');
  };

  return (
    <Layout>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen pb-12 ">
        <PageBanner
          title="Crear Proyecto"
          description="Completa el formulario para crear un nuevo proyecto"
        />
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg">
          {!user && (
            <Admonition
              title="Debes iniciar sesión para crear proyectos"
              icon={<Info />}
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre del Proyecto */}
            <div>
              <label
                htmlFor="projectName"
                className="block font-medium text-gray-700 mb-1"
              >
                Nombre del Proyecto <span className="text-red-500">*</span>
              </label>
              <input
                id="projectName"
                type="text"
                {...register('projectName', {
                  required: ERROR_MESSAGES.REQUIRED,
                  maxLength: {
                    value: 255,
                    message: ERROR_MESSAGES.MAX_LENGTH,
                  },
                })}
                className={`w-full px-3 py-2 border rounded-md ${errors.projectName ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Mi proyecto innovador"
              />
              {errors.projectName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.projectName.message}
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

            {/* Enlace - Oculto*/}
            {/* <div>
              <label htmlFor="link" className="block font-medium text-gray-700 mb-1">
                Enlace (opcional)
              </label>
              <input
                id="link"
                type="url"
                {...register('link', {
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: 'Ingresa una URL válida'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-md ${errors.link ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="https://ejemplo.com"
              />
              {errors.link && (
                <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>
              )}
            </div> */}

            {/* Imagen de portada */}
            <div>
              <span className="block font-medium text-gray-700 mb-1">
                Imagen de portada <span className="text-red-500">*</span>
              </span>

              {previewImage && (
                <div className="mb-4">
                  <img
                    src={previewImage}
                    alt="Previsualización"
                    className="max-h-60 w-auto rounded-md object-contain border border-gray-200"
                  />
                </div>
              )}

              <div className="mt-1 flex items-center">
                <button
                  type="button"
                  onClick={() => document.getElementById('coverImage')?.click()}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  {previewImage ? 'Cambiar imagen' : 'Seleccionar archivo'}
                </button>
                <span className="ml-2 text-sm text-gray-500 select-none">
                  {watch('coverImage')?.[0]?.name ||
                    'Ningún archivo seleccionado'}
                </span>
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileRef}
                  {...fileRegisterProps}
                  className="hidden"
                />
              </div>
              {errors.coverImage && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.coverImage.message}
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
            <div className="mt-8 pt-8">
              {/* Sección de evaluación del proyecto */}
              <h2 className="text-xl font-semibold mb-6">Evalúa tu proyecto</h2>
              {/* Radio buttons para tipo de proyecto */}
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-3">
                  Mi proyecto es para ...{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="improve"
                      {...register('projectType', {
                        required: 'Selecciona una opción',
                      })}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">
                      Mejorar algo que ya existe
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="create"
                      {...register('projectType', {
                        required: 'Selecciona una opción',
                      })}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Crear algo nuevo</span>
                  </label>
                </div>
                {errors.projectType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.projectType.message}
                  </p>
                )}
              </div>

              {/* Tipo de proyecto y Unidad productiva*/}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="projectCategory"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Tipo de proyecto <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="projectCategory"
                    {...register('projectCategory', {
                      required: 'Selecciona un tipo de proyecto',
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecciona...</option>
                    <option value="investment">Inversión</option>
                    <option value="optimization">Optimización</option>
                    <option value="extension">Ampliación</option>
                    <option value="repair">Reparación</option>
                    <option value="replacement">Reemplazo</option>
                  </select>
                  {errors.projectCategory && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.projectCategory.message}
                    </p>
                  )}
                </div>

                {/* <div>
                  <label htmlFor="productiveUnit" className="block font-medium text-gray-700 mb-1">
                    Unidad productiva <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="productiveUnit"
                    {...register('productiveUnit', { required: 'Selecciona una unidad productiva' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecciona...</option>
                    <option value="Opcion 1">Opción 1</option>
                    <option value="Opcion 2">Opción 2</option>
                  </select>
                  {errors.productiveUnit && (
                    <p className="mt-1 text-sm text-red-600">{errors.productiveUnit.message}</p>
                  )}
                </div> */}
              </div>

              {/* Escoge tu mejora y Crédito */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="improvementChoice" className="block font-medium text-gray-700 mb-1">
                    Escoge tu mejora <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="improvementChoice"
                    {...register('improvementChoice', { required: 'Selecciona una mejora' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecciona...</option>
                    <option value="Opcion 1">Opción 1</option>
                    <option value="Opcion 2">Opción 2</option>
                  </select>
                  {errors.improvementChoice && (
                    <p className="mt-1 text-sm text-red-600">{errors.improvementChoice.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="creditStatus" className="block font-medium text-gray-700 mb-1">
                    Crédito de línea <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="creditStatus"
                    {...register('creditStatus', { required: 'Selecciona un estado de crédito' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecciona...</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Desaprobado">Desaprobado</option>
                  </select>
                  {errors.creditStatus && (
                    <p className="mt-1 text-sm text-red-600">{errors.creditStatus.message}</p>
                  )}
                </div>
              </div> */}
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
                {isSubmitting ? 'Creando proyecto...' : 'Crear Proyecto'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="¡Proyecto creado exitosamente!"
        type="proyecto"
        routeType="proyectos"
        projectId={createdProjectId}
      />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </Layout>
  );
}
