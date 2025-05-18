type ContentLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function ContentLayout({ children, style, className, ...rest }: ContentLayoutProps) {
  return (
    <div className={`w-full px-page ${className ?? ''}`} style={style} {...rest}>
      <div className='max-w-[78rem] m-auto h-full w-full'>
        {children}
      </div>
    </div>
  );
}
