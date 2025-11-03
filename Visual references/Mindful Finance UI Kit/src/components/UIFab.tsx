import React from 'react';
import { Plus } from 'lucide-react';

interface UIFabProps {
  onClick?: () => void;
  className?: string;
}

export function UIFab({ onClick, className = '' }: UIFabProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--copper)] to-[var(--aqua)] text-white shadow-[var(--shadow-lg)] hover:scale-110 hover:shadow-[0_8px_32px_rgba(159,217,201,0.4)] transition-all duration-[var(--duration-fast)] flex items-center justify-center ${className}`}
      style={{
        animation: 'breath 3s var(--ease-breath) infinite'
      }}
    >
      <Plus size={24} />
    </button>
  );
}
