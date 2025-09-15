import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { db } from '@db/client';
import { useAuthStore } from '@auth/store/auth_store';
import { MDXEditorComponent } from '@common/components/mxEditorComponent';
import { MultiImageUpload } from '@common/components/multi_image_upload';
import { useMultiImageUpload } from '@common/hooks/useMultiImageUpload';
import { pushBlobToStorage } from '@common/utils';
import type { GroupPostCreate } from '../types/group_posts';
import { toast } from 'sonner';

type GroupPostCreateFormData = {
  title: string;
  content: string;
  images: File[];
};

type GroupPostCreateFormProps = {
  groupId: string;
  onPostCreated?: () => void;
  onCancel?: () => void;
};

const ERROR_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  MAX_LENGTH: 'Máximo 255 caracteres',
  LOGIN_REQUIRED: 'Debes iniciar sesión para publicar',
};

export function GroupPostCreateForm({ groupId, onPostCreated, onCancel }: GroupPostCreateFormProps) {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    trigger,
  } = useForm<GroupPostCreateFormData>();

  // Register content field for MDX editor
  register('content', {
    required: ERROR_MESSAGES.REQUIRED,
    validate: (value) => value?.trim().length > 0 || ERROR_MESSAGES.REQUIRED,
  });

  // Initialize multi-image upload hook
  const multiImageUpload = useMultiImageUpload({
    fieldName: 'images',
    setValue,
    trigger,
    maxImages: 5,
  });

  const handleContentChange = (markdown: string) => {
    setValue('content', markdown, { shouldValidate: true });
    trigger('content');
  };

  const onSubmit = async (formData: GroupPostCreateFormData) => {
    if (!user) {
      toast.error('Debes iniciar sesión para publicar');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrls: string[] = [];


      // Upload images if any
      if (formData.images && formData.images.length > 0) {
        const uploadPromises = formData.images.map((img) =>
          pushBlobToStorage(db, 'multimedia', img)
        );
        imageUrls = await Promise.all(uploadPromises);
      }

      const postData: GroupPostCreate = {
        title: formData.title,
        content: formData.content,
        group_id: groupId,
        image_url: imageUrls,
      };

      const { error } = await db
        .from('group_publications')
        .insert({
          ...postData,
          author_id: user.id,
        });

      if (error) throw error;

      reset();
      multiImageUpload.reset();
      toast.success('¡Publicación creada exitosamente!');
      onPostCreated?.();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error al crear la publicación. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-800">Debes iniciar sesión para crear publicaciones en este grupo.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="¿De qué quieres hablar?"
            {...register('title', {
              required: ERROR_MESSAGES.REQUIRED,
              maxLength: {
                value: 255,
                message: ERROR_MESSAGES.MAX_LENGTH,
              },
            })}
            className={`w-full px-3 py-2 border rounded-md text-lg font-medium placeholder-gray-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <MDXEditorComponent
            markdown={watch('content') || ''}
            onChange={handleContentChange}
            error={!!errors.content}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        {/* Images */}
        <div>
          <MultiImageUpload
            files={multiImageUpload.files}
            onChange={multiImageUpload.handleFilesChange}
            maxImages={5}
            maxFileSize={5 * 1024 * 1024} // 5MB
            accept="image/*"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
}
