import { motion } from 'motion/react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BreakpointIndicator() {
  const [width, setWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    // Show indicator briefly on load and resize
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 3000);
    
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 2000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getBreakpoint = () => {
    if (width >= 1024) return { name: 'Desktop', icon: Monitor, color: '#7ED4C1' };
    if (width >= 768) return { name: 'Tablet', icon: Tablet, color: '#C78C60' };
    return { name: 'Mobile', icon: Smartphone, color: '#0F3C3B' };
  };

  const breakpoint = getBreakpoint();
  const Icon = breakpoint.icon;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div
        className="px-4 py-2 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-3"
        style={{
          backgroundColor: `${breakpoint.color}20`,
          borderColor: `${breakpoint.color}40`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: breakpoint.color }} />
        <div>
          <div className="text-sm font-semibold" style={{ color: breakpoint.color }}>
            {breakpoint.name}
          </div>
          <div className="text-xs opacity-60" style={{ color: breakpoint.color }}>
            {width}px
          </div>
        </div>
      </div>
    </motion.div>
  );
}
