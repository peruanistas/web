import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import { pushBlobToStorage } from '@common/utils';
import { db } from '@db/client';
import { useAuthStore } from '@auth/store/auth_store';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type NewsFormData = {
  title: string;
  content: string;
  link?: string;
  coverImage: FileList;
  acceptTerms: boolean;
};

export default function NewCreatePage() {
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch, // Agregado para observar los valores del formulario
  } = useForm<NewsFormData>();

  const coverImage = watch('coverImage'); // Observa el campo coverImage

  const onSubmit = async (form_data: NewsFormData) => {
    try {
      if (!user) throw new Error('Debes iniciar sesión para crear una noticia');

      if (!form_data.coverImage[0]) {
        throw new Error('No se subió ninguna imagen de portada');
      }

      const bucket_path = await pushBlobToStorage(db, 'multimedia', form_data.coverImage[0]);

      const { error } = await db
        .from('publications')
        .insert({
          title: form_data.title,
          content: form_data.content,
          image_url: bucket_path,
          author_id: user.id,
          published_at: new Date().toISOString(),
          active: true,
          visibility: 'public', // Puedes ajustar esto según tu lógica
        });

      if (error) throw error;

      reset();
      alert('Noticia creada exitosamente!');
    } catch (error) {
      console.error('Error al crear noticia:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Error: ${errorMessage}`);
    }
  };

  useEffect(() => {
    document.title = 'Crear Noticia';
  }, []);

  return (
    <Layout>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-4">Crear Noticia</h1>
          <p className="text-center text-gray-600 mb-8">
            Completa el formulario para registrar una nueva noticia
          </p>

          {!user && (
            <div className="mb-4 text-red-600 font-medium">
              Debes iniciar sesión para crear noticias.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register('title', {
                  required: 'El título es obligatorio',
                  maxLength: {
                    value: 100,
                    message: 'Máximo 100 caracteres'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Título de la noticia"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Contenido */}
            <div>
              <label htmlFor="content" className="block font-medium text-gray-700 mb-1">
                Contenido <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                rows={4}
                {...register('content', {
                  required: 'El contenido es obligatorio',
                  maxLength: {
                    value: 1000,
                    message: 'Máximo 1000 caracteres'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-md ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Escribe el contenido de la noticia..."
              ></textarea>
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            {/* Imagen de portada */}
            <div>
              <span className="block font-medium text-gray-700 mb-1">
                Imagen de portada <span className="text-red-500">*</span>
              </span>
              <div className="mt-1 flex items-center">
                <button
                  type="button"
                  onClick={() => document.getElementById('coverImage')?.click()}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Seleccionar archivo
                </button>
                <span className="ml-2 text-sm text-gray-500 select-none">
                  {coverImage?.[0]?.name || 'Ningún archivo seleccionado'}
                </span>
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  {...register('coverImage', {
                    required: 'La imagen de portada es obligatoria',
                    validate: {
                      fileType: (files) =>
                        files[0]?.type.startsWith('image/') || 'Debe ser un archivo de imagen',
                      fileSize: (files) =>
                        files[0]?.size <= 5 * 1024 * 1024 || 'El tamaño máximo es 5MB'
                    }
                  })}
                  className="hidden"
                />
              </div>
              {errors.coverImage && (
                <p className="mt-1 text-sm text-red-600">{errors.coverImage.message}</p>
              )}
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start">
              <div>
                <input
                  id="acceptTerms"
                  type="checkbox"
                  {...register('acceptTerms', {
                    required: 'Debes aceptar los términos y condiciones'
                  })}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-base">
                <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                  Acepto los términos y condiciones
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
                )}
              </div>
            </div>

            {/* Botón de envío */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creando noticia...' : 'Crear noticia'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
