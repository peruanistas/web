type ProjectDetailButtonProps = {
    title: string;
    theme?: 'main' | 'secondary';
    onClick?: () => void;
};

export default function ProjectDetailButton({ title, theme = 'main', onClick=()=>{}}: ProjectDetailButtonProps) {
    const buttonClass =
        theme === 'main'
            ? 'project_detail_button main'
            : 'project_detail_button secondary';

    return (
        <button className={buttonClass} onClick={onClick}>
            <h1>{title}</h1>
        </button>
    );
}