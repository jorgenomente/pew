import React from 'react';

interface UIInputProps {
  variant?: 'filled' | 'outlined';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}

export function UIInput({ 
  variant = 'outlined', 
  placeholder, 
  value, 
  onChange, 
  type = 'text',
  className = '' 
}: UIInputProps) {
  const baseStyles = 'px-4 py-3 w-full transition-all duration-[var(--duration-fast)]';
  
  const variantStyles = {
    filled: 'bg-white border-none shadow-[var(--shadow-sm)] focus:shadow-[var(--shadow-md)] focus:outline-none focus:ring-2 focus:ring-[var(--aqua)] focus:ring-opacity-50',
    outlined: 'bg-transparent border-2 border-[var(--sand)] focus:border-[var(--aqua)] focus:outline-none focus:shadow-[0_0_0_3px_rgba(159,217,201,0.1)]'
  };
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ borderRadius: 'var(--radius-input)' }}
    />
  );
}
