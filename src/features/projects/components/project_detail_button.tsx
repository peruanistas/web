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
    onClick=async ()=>{}
}: ProjectDetailButtonProps) {
    const [isLoading, setLoading] = useState(false);

    const buttonClass =
        theme === 'main'
            ? 'project_detail_button main'
            : 'project_detail_button secondary';

    if (disabled) {
        return (
            <button className={`${buttonClass} bg-gray-300! text-gray-600! cursor-not-allowed`} disabled>
                {
                    isLoading || loading ? (
                        <span className="loader"></span>
                    ) : (
                        <h3>{title}</h3>
                    )
                }
            </button>
        );
    }

    return (
        <button className={buttonClass} onClick={async () => {
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
                    <span className="loader"></span>
                ) : (
                    <h3>{title}</h3>
                )
            }
        </button>
    );
}
