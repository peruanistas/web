type ContentLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function ContentLayout({ children, style, className, ...rest }: ContentLayoutProps) {
  return (
    <div className={`w-full px-6 ${className ?? ''}`} style={style} {...rest}>
      <div className='max-w-3xl m-auto h-full w-full'>
        {children}
      </div>
    </div>
  );
}
