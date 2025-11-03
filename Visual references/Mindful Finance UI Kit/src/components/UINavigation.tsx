import React, { useState } from 'react';
import { Home, BarChart3, Wallet, User } from 'lucide-react';

export function UINavigation() {
  const [active, setActive] = useState(0);
  
  const navItems = [
    { icon: Home, label: 'Inicio' },
    { icon: BarChart3, label: 'Análisis' },
    { icon: Wallet, label: 'Cuentas' },
    { icon: User, label: 'Perfil' }
  ];
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--sand)] px-4 py-3"
      style={{ boxShadow: '0 -4px 16px rgba(46, 73, 67, 0.08)' }}
    >
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = active === index;
          
          return (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all duration-[var(--duration-fast)] relative ${
                isActive ? 'text-[var(--aqua)]' : 'text-[var(--petroleum)] opacity-60'
              }`}
            >
              {isActive && (
                <div 
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--aqua)] rounded-full"
                />
              )}
              <Icon size={20} />
              <span style={{ fontSize: 'var(--text-micro)' }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
