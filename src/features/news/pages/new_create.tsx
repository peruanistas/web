import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';



type NewsFormData = {
  NewsTitle: string;
  description: string;
  link?: string;
  coverImage: FileList;
  department: string;
  city: string;
  district: string;
  acceptTerms: boolean;
};


export default function NewCreatePage(){

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<NewsFormData>();

  const onSubmit = async (data: NewsFormData) => {
    // Simulamos el envío del formulario
    console.log('Datos del proyecto:', {
      ...data,
      coverImage: data.coverImage[0]?.name // Solo mostramos el nombre del archivo
    });
    
    // Aquí iría la llamada a tu API
    await new Promise(resolve => setTimeout(resolve, 1000));
    reset();
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
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Titulo de la Noticia */}
            <div>
              <label htmlFor="NewsTitle" className="block font-medium text-gray-700 mb-1">
                Titulo de la Noticia <span className="text-red-500">*</span>
              </label>
              <input
                id="NewsTitle"
                type="text"
                {...register('NewsTitle', {
                  required: 'El nombre de la noticia es obligatorio',
                  maxLength: {
                    value: 25,
                    message: 'Máximo 25 caracteres'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-md ${errors.NewsTitle ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Titulo de la noticia"
              />
              {errors.NewsTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.NewsTitle.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description', {
                  required: 'La descripción es obligatoria',
                  maxLength: {
                    value: 500,
                    message: 'Máximo 500 caracteres'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Describe detalladamente ..."
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Enlace */}
            <div>
              <label htmlFor="link" className="block font-medium text-gray-700 mb-1">
                Enlace (opcional)
              </label>
              <input
                id="link"
                type="url"
                {...register('link', {
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                    message: 'Ingresa una URL válida'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-md ${errors.link ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="https://ejemplo.com"
              />
              {errors.link && (
                <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>
              )}
            </div>

            {/* Imagen de portada */}
            <div>
                <span className="block font-medium text-gray-700 mb-1">
                    Imagen de portada <span className="text-red-500">*</span>
                </span>
                <div className="mt-1 flex items-center">
                    {/* Botón que activa el input file */}
                    <button
                    type="button"
                    onClick={() => document.getElementById('coverImage')?.click()}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                        Seleccionar archivo
                    </button>
                    {/* Texto del archivo seleccionado*/}
                    <span className="ml-2 text-sm text-gray-500 select-none">
                    {watch('coverImage')?.[0]?.name || 'Ningún archivo seleccionado'}
                    </span>
                    {/* Input file oculto */}
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

            {/* Ubicación - Departamento, Ciudad, Distrito */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="department" className="block font-medium text-gray-700 mb-1">
                  Departamento <span className="text-red-500">*</span>
                </label>
                <input
                  id="department"
                  type="text"
                  {...register('department', {
                    required: 'El departamento es obligatorio'
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Lima"
                />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block font-medium text-gray-700 mb-1">
                  Ciudad <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  {...register('city', {
                    required: 'La ciudad es obligatoria'
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Lima"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="district" className="block font-medium text-gray-700 mb-1">
                  Distrito <span className="text-red-500">*</span>
                </label>
                <input
                  id="district"
                  type="text"
                  {...register('district', {
                    required: 'El distrito es obligatorio'
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${errors.district ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Miraflores"
                />
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                )}
              </div>
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
                {isSubmitting ? 'Creando proyecto...' : 'Crear Proyecto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>);
}