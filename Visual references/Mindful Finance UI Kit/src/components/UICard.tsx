import React, { ReactNode } from 'react';

interface UICardProps {
  size?: 'S' | 'M' | 'L';
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'income' | 'expense';
}

export function UICard({ 
  size = 'M', 
  title, 
  value, 
  icon, 
  subtitle,
  className = '',
  variant = 'default'
}: UICardProps) {
  const sizeStyles = {
    S: 'p-4',
    M: 'p-6',
    L: 'p-8'
  };
  
  const variantStyles = {
    default: 'bg-white border border-[var(--sand)]',
    income: 'bg-gradient-to-br from-[var(--aqua)] to-[#B8E6D5] text-white',
    expense: 'bg-gradient-to-br from-[var(--copper)] to-[#D89A7E] text-white'
  };
  
  return (
    <div
      className={`${sizeStyles[size]} ${variantStyles[variant]} transition-all duration-[var(--duration-fast)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 ${className}`}
      style={{ 
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="opacity-70">{title}</div>
        {icon && <div className="opacity-80">{icon}</div>}
      </div>
      <div className="mt-2 mb-1">{value}</div>
      {subtitle && (
        <div className="opacity-60 italic" style={{ fontSize: 'var(--text-caption)' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
