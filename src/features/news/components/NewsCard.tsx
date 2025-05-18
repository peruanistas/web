import React from 'react';
import ArticleContent from './ArticleContent';

interface NewsCardProps {
  title: string;
  subtitle?: string;
  author: string;
  date: string;
  imageUrl: string;
  content: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  subtitle,
  author,
  date,
  imageUrl,
  content,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 mx-auto">
      {/* Título y Subtítulo */}
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-xl text-gray-600 mb-2">{subtitle}</p>}
      <div className="border-b border-red-500 w-1/4 mb-4"></div>

      {/* Contenedor Principal con Iconos y Contenido */}
      <div className="flex flex-col md:flex-row space-x-4 mb-4">
        {/* Iconos de Interacción */}


        {/* Contenido Principal */}
        <div className="flex-1">


          {/* Imagen Principal */}
          <img
            src={imageUrl}
            alt="Article Image"
            className="w-full h-auto object-cover rounded-lg mb-4"
          />

          {/* Autor y Fecha */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-gray-500">Historia de</span>
              <span className="text-sm font-bold ml-1">{author}</span>
            </div>
            <span className="text-sm text-gray-500">{date}</span>
          </div>

          {/* Contenido del Artículo */}
          <ArticleContent content={content} />
        </div>
      </div>

      {/* Botón "Continuar Leyendo" Centrado 
      <div className="flex justify-center mt-4">
        <ContinueReadingButton />
      </div>
      */
      }

    </div>
  );
};

export default NewsCard;
