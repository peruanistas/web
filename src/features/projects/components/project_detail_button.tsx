type ProjectDetailButtonProps = {
    title: string;
    theme?: 'main' | 'secondary';
};

export default function ProjectDetailButton({ title, theme = 'main' }: ProjectDetailButtonProps) {
    const buttonClass =
        theme === 'main'
            ? 'project_detail_button main'
            : 'project_detail_button secondary';

    return (
        <button className={buttonClass}>
            <h1>{title}</h1>
        </button>
    );
}