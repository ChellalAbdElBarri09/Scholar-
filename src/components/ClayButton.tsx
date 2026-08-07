import React from 'react';

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ClayButton: React.FC<ClayButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  let variantStyle = 'clay-button text-[#e2e8f0]';
  if (variant === 'accent') {
    variantStyle = 'clay-button-accent text-white font-medium';
  } else if (variant === 'secondary') {
    variantStyle = 'bg-[#122e31] hover:bg-[#18393d] text-[#B3C1B4] border border-[#446E5F]/30 rounded-[18px] shadow-md transition-all active:scale-95';
  } else if (variant === 'danger') {
    variantStyle = 'bg-gradient-to-r from-rose-900/80 to-red-800/80 hover:from-rose-800 hover:to-red-700 text-rose-100 border border-rose-500/30 rounded-[18px] shadow-lg active:scale-95 transition-all';
  }

  let sizeStyle = 'px-4 py-2.5 text-sm';
  if (size === 'sm') sizeStyle = 'px-3 py-1.5 text-xs rounded-[14px]';
  if (size === 'lg') sizeStyle = 'px-6 py-3 text-base rounded-[20px]';

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyle} ${sizeStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
