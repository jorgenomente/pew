import { motion } from 'framer-motion';
import type { KeyboardEvent } from 'react';
import { Waves, PieChart, Target, Wallet } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const navItems = [
    { id: 'home', icon: Waves, label: 'Inicio' },
    { id: 'budget', icon: Wallet, label: 'Presupuesto' },
    { id: 'categories', icon: PieChart, label: 'Categorías' },
    { id: 'goals', icon: Target, label: 'Metas' },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white/80 to-white/40 backdrop-blur-xl border-t border-white/30 px-6 pb-6 pt-3 z-50"
      aria-label="Navegación principal"
    >
      <div className="flex items-center justify-around max-w-md mx-auto" role="tablist">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const handleSelect = () => {
            if (item.id !== activeTab) {
              onTabChange(item.id);
            }
          };
          const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleSelect();
            }
          };
          
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={handleSelect}
              onTap={handleSelect}
              onKeyDown={handleKeyDown}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center gap-1 py-2 px-3"
              role="tab"
              aria-selected={isActive}
              aria-label={item.label}
            >
              {/* Glow effect for active tab */}
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7ED4C1]/30 to-[#C78C60]/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <motion.div
                animate={isActive ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                } : {}}
                transition={{
                  duration: 0.5,
                }}
                className="relative"
              >
                <Icon
                  className="w-6 h-6 transition-colors"
                  style={{
                    color: isActive ? '#0F3C3B' : 'rgba(15, 60, 59, 0.5)',
                  }}
                />
                
                {/* Ripple effect */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{
                      scale: [1, 1.5, 2],
                      opacity: [0.6, 0.3, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    style={{
                      border: '2px solid #7ED4C1',
                    }}
                  />
                )}
              </motion.div>
              
              <span
                className="text-xs transition-opacity relative"
                style={{
                  opacity: isActive ? 1 : 0.5,
                  color: '#0F3C3B',
                }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
