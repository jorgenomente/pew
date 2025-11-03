import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface UIModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function UIModal({ isOpen, onClose, title, children }: UIModalProps) {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        background: 'rgba(46, 73, 67, 0.4)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md p-6 relative animate-fade-up"
        style={{ 
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[var(--petroleum)]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[var(--petroleum)] hover:text-[var(--copper)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
