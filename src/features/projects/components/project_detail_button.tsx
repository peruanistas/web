import { Loader } from '@common/components/loader';
import { useState } from 'react';

type ProjectDetailButtonProps = {
  title: string;
  disabled?: boolean;
  loading?: boolean;
  theme?: 'main' | 'secondary';
  onClick?: () => Promise<void>;
};

export default function ProjectDetailButton({
  title,
  disabled = false,
  loading = false,
  theme = 'main',
  onClick = async () => { }
}: ProjectDetailButtonProps) {
  const [isLoading, setLoading] = useState(false);

  const buttonClass =
    theme === 'main'
      ? 'project_detail_button main'
      : 'project_detail_button secondary';

  if (disabled) {
    return (
      <button className={`${buttonClass} cursor-not-allowed flex items-center justify-center h-14 bg-gray-300! text-gray-600!`} disabled>
        {
          isLoading || loading ? (
            <Loader />
          ) : (
            <h3>{title}</h3>
          )
        }
      </button>
    );
  }

  return (
    <button className={`${buttonClass} cursor-pointer flex items-center justify-center h-14`} onClick={async () => {
      try {
        setLoading(true);
        await onClick();
      } catch (error) {
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }}>
      {
        isLoading || loading ? (
          <Loader variant='white' />
        ) : (
          <h3>{title}</h3>
        )
      }
    </button>
  );
}
