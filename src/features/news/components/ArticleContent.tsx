import React from 'react';

interface ArticleContentProps {
  content: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  return <p className="text-gray-700 mb-4">{content}</p>;
};

export default ArticleContent;