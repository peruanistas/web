import { useAuthStore } from '@auth/store/auth_store';
import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import { pushBlobToStorage } from '@common/utils';
import { db } from '@db/client';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PageBanner } from '@common/components/page_banner';
import { type MDXEditorMethods } from '@mdxeditor/editor'; // Importación type-only
import { 
  MDXEditor, 
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  Separator,
  CreateLink,
  headingsPlugin, //Mejora proxima
  listsPlugin,
  linkPlugin,
  quotePlugin,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

type NewsFormData = {
  title: string;
  description: string;
  link?: string;
  coverImage: FileList;
  acceptTerms: boolean;
};

const ERROR_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  IMAGE_REQUIRED: 'La imagen de portada es obligatoria',
  IMAGE_TYPE: 'Debe ser un archivo de imagen válido',
  IMAGE_SIZE: 'El tamaño máximo permitido es 5MB',
  MAX_LENGTH: 'Máximo 255 caracteres',
  LOGIN_REQUIRED: 'Debes iniciar sesión para crear un proyecto'
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB


export default function NewCreatePage() {
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    trigger // Agregado para observar los valores del formulario
  } = useForm<NewsFormData>();

  register('description', {
  required: ERROR_MESSAGES.REQUIRED,
  validate: (value) => (value?.trim().length > 0) || ERROR_MESSAGES.REQUIRED
  });
  const editorRef = useRef<MDXEditorMethods>(null);
    const handleDescriptionChange = (markdown: string) => {
      setValue('description', markdown, { shouldValidate: true });
      trigger('description');
    };

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Extraemos las propiedades del register para el input file
  const { ref: fileRef, onChange: hookFormOnChange, ...fileRegisterProps } = 
    register('coverImage', {
      required: ERROR_MESSAGES.IMAGE_REQUIRED,
      validate: {
        fileType: (files) => 
          files[0]?.type?.startsWith('image/') || ERROR_MESSAGES.IMAGE_TYPE,
        fileSize: (files) => 
          files[0]?.size <= MAX_FILE_SIZE || ERROR_MESSAGES.IMAGE_SIZE
      }
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
          content: form_data.description,
          image_url: bucket_path,
          author_id: user.id,
          published_at: new Date().toISOString(),
          active: true,
          visibility: 'public', 
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
      <div className="flex flex-col items-center justify-baseline min-h-screen pb-12">
        <PageBanner
          title="Crear Noticia"
          description="Registra una nueva noticia para compartir con la comunidad"
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
              <label htmlFor="title" className="block font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register('title', {
                  required: 'El título es obligatorio',
                  maxLength: {
                    value: 255,
                    message: 'Máximo 255 caracteres'
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
              <div id="description" aria-describedby="description-error">
                <MDXEditor
                  ref={editorRef}
                  markdown={watch('description') || ''}
                  onChange={handleDescriptionChange}
                  plugins={[
                    toolbarPlugin({
                      toolbarContents: () => (
                        <>
                          <UndoRedo />
                          <BoldItalicUnderlineToggles />
                          <Separator />
                          <ListsToggle />
                          {/* <Separator />
                          <CreateLink /> */}
                          
                        </>
                      )
                    }),
                    listsPlugin(),
                    linkPlugin(),
                    quotePlugin(),
                   
                  ]}
                  contentEditableClassName={`
                    [&_ul]:list-disc 
                    [&_ul]:pl-6 
                    [&_ol]:list-decimal 
                    [&_ol]:pl-6
                    [&_li]:my-1
                    [&_em]:italic
                    [&_i]:italic
                    font-[Inter] text-gray-900 border 
                    ${errors.description ? 'border-red-500' : 'border-gray-200'} min-h-[200px] rounded-md p-2`}
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

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
                  {watch('coverImage')?.[0]?.name || 'Ningún archivo seleccionado'}
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
                <p className="mt-1 text-sm text-red-600">{errors.coverImage.message}</p>
              )}
            </div>        

            {/* Términos y condiciones */}
            {/* <div className="flex items-start">
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
            </div> */}

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
