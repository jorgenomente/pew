import React from 'react';

interface UIButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function UIButton({ variant = 'primary', children, onClick, className = '' }: UIButtonProps) {
  const baseStyles = 'px-6 py-3 transition-all duration-[var(--duration-fast)] font-medium cursor-pointer inline-flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-[var(--aqua)] text-[var(--petroleum)] hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02]',
    secondary: 'bg-[var(--copper)] text-white hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02]',
    ghost: 'border-2 border-[var(--petroleum)] text-[var(--petroleum)] bg-transparent hover:bg-[var(--petroleum)] hover:text-white'
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ borderRadius: 'var(--radius-input)' }}
    >
      {children}
    </button>
  );
}
