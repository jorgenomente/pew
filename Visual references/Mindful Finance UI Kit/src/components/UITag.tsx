import React from 'react';

interface UITagProps {
  children: React.ReactNode;
  variant?: 'paid' | 'pending' | 'neutral';
  className?: string;
}

export function UITag({ children, variant = 'neutral', className = '' }: UITagProps) {
  const variantStyles = {
    paid: 'bg-gradient-to-r from-[var(--aqua)] to-[#B8E6D5] text-[var(--petroleum)]',
    pending: 'bg-gradient-to-r from-[var(--copper)] to-[#D89A7E] text-white',
    neutral: 'bg-[var(--sand)] text-[var(--petroleum)]'
  };
  
  return (
    <span
      className={`inline-block px-3 py-1 ${variantStyles[variant]} ${className}`}
      style={{ 
        borderRadius: 'var(--radius-tag)',
        fontSize: 'var(--text-caption)'
      }}
    >
      {children}
    </span>
  );
}
