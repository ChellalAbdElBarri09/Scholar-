import React from 'react';

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'flat' | 'accent';
}

export const ClayCard: React.FC<ClayCardProps> = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const baseStyle = variant === 'flat' 
    ? 'clay-card-flat p-5' 
    : variant === 'accent'
    ? 'bg-gradient-to-br from-[#1c4743] to-[#12312d] border border-[#88A590]/25 rounded-[24px] p-5 shadow-2xl shadow-black/40'
    : 'clay-card p-5';

  return (
    <div className={`${baseStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
