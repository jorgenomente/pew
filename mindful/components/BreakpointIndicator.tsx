import { motion } from 'framer-motion';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export function BreakpointIndicator() {
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 0));
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateWidth = () => setWidth(window.innerWidth);

    const showTemporarily = (duration = 3000) => {
      setIsVisible(true);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => setIsVisible(false), duration);
    };

    updateWidth();
    const initialTimer = window.setTimeout(() => showTemporarily(3000), 0);

    const handleResize = () => {
      updateWidth();
      showTemporarily(2000);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(initialTimer);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
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
