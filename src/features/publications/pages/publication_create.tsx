import { useAuthStore } from '@auth/store/auth_store';
import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import { pushBlobToStorage } from '@common/utils';
import { db } from '@db/client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { PageBanner } from '@common/components/page_banner';
import { SuccessModal } from '@common/components/modal_create';
import { MDXEditorComponent } from '@common/components/mxEditorComponent';
import TermsModal from '@common/components/termsModal';
import { MultiImageUpload } from '@common/components/multi_image_upload';
import { useMultiImageUpload } from '@common/hooks/useMultiImageUpload';

type NewsFormData = {
  title: string;
  description: string;
  link?: string;
  coverImages: File[];
  acceptTerms: boolean;
};

const ERROR_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  IMAGE_REQUIRED: 'La imagen de portada es obligatoria',
  IMAGE_TYPE: 'Debe ser un archivo de imagen válido',
  IMAGE_SIZE: 'El tamaño máximo permitido es 5MB',
  MAX_LENGTH: 'Máximo 255 caracteres',
  LOGIN_REQUIRED: 'Debes iniciar sesión para crear un proyecto',
};

export function NewCreatePage() {
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    trigger, // Agregado para observar los valores del formulario
  } = useForm<NewsFormData>();

  register('description', {
    required: ERROR_MESSAGES.REQUIRED,
    validate: (value) => value?.trim().length > 0 || ERROR_MESSAGES.REQUIRED,
  });

  // Initialize multi-image upload hook with max 1 image
  const multiImageUpload = useMultiImageUpload({
    fieldName: 'coverImages',
    setValue,
    trigger,
    maxImages: 1,
  });

  // Debounce validation to avoid lag on every keystroke
  const validationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDescriptionChange = useCallback((markdown: string) => {
    setValue('description', markdown, { shouldValidate: false });
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    validationTimeoutRef.current = setTimeout(() => {
      trigger('description');
    }, 300);
  }, [setValue, trigger]);

  // Register coverImages field for react-hook-form
  register('coverImages', {
    required: ERROR_MESSAGES.IMAGE_REQUIRED,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [createdNewsId, setCreatedNewsId] = useState<string | null>(null);
  const onSubmit = async (form_data: NewsFormData) => {
    try {
      if (!user)
        throw new Error('Debes iniciar sesión para crear una publicacion');

      if (!form_data.coverImages[0]) {
        throw new Error('No se subió ninguna imagen de portada');
      }

      const bucket_path = await pushBlobToStorage(
        db,
        'multimedia',
        form_data.coverImages[0]
      );

      const { data, error } = await db
        .from('publications')
        .insert({
          title: form_data.title,
          content: form_data.description,
          image_url: bucket_path,
          author_id: user.id,
          published_at: new Date().toISOString(),
          active: true,
          visibility: 'public',
        })
        .select('id')
        .single();

      if (error) throw error;
      if (!data?.id) throw new Error('No se obtuvo ID del proyecto');
      setCreatedNewsId(data.id);
      setIsModalOpen(true);
      reset();
    } catch (error) {
      console.error('Error al crear noticia:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(`Error: ${errorMessage}`);
    }
  };

  useEffect(() => {
    document.title = 'Crear Publicacion';
  }, []);

  return (
    <Layout>
      <Header />
      <div className="flex flex-col items-center justify-baseline min-h-screen pb-12">
        <PageBanner
          title="Crear publicacion"
          description="Registra una nueva publicacion para compartir con la comunidad"
        />
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg">
          {!user && (
            <div className="mb-4 text-red-600 font-medium">
              Debes iniciar sesión para crear noticias.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Título */}
            <div>
              <label
                htmlFor="title"
                className="block font-medium text-gray-700 mb-1"
              >
                Título <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register('title', {
                  required: 'El título es obligatorio',
                  maxLength: {
                    value: 255,
                    message: 'Máximo 255 caracteres',
                  },
                })}
                className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Título de la publicación"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Contenido */}
            <div>
              <label
                htmlFor="content"
                className="block font-medium text-gray-700 mb-1"
              >
                Contenido <span className="text-red-500">*</span>
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
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Imagen de portada */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Imagen de portada <span className="text-red-500">*</span>
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
                {isSubmitting ? 'Creando publicacion...' : 'Crear publicacion'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Publicacion creada exitosamente!"
        type="publicacion"
        routeType="feed"
        projectId={createdNewsId}
      />
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </Layout>
  );
}
