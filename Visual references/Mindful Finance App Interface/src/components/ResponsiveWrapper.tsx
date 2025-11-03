import { useState, useEffect, ReactNode } from 'react';
import { ResponsivePreview } from './ResponsivePreview';
import { motion } from 'motion/react';
import { Maximize2 } from 'lucide-react';

interface ResponsiveWrapperProps {
  children: ReactNode;
  enablePreview?: boolean;
}

export function ResponsiveWrapper({ children, enablePreview = true }: ResponsiveWrapperProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    // Show toggle button after initial load
    const timer = setTimeout(() => setShowToggle(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for keyboard shortcut (Ctrl/Cmd + Shift + P)
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setPreviewMode((prev) => !prev);
      }
    };

    if (enablePreview) {
      window.addEventListener('keydown', handleKeyboard);
      return () => window.removeEventListener('keydown', handleKeyboard);
    }
  }, [enablePreview]);

  if (!enablePreview) {
    return <>{children}</>;
  }

  if (previewMode) {
    return <ResponsivePreview>{children}</ResponsivePreview>;
  }

  return (
    <>
      {children}
      
      {/* Floating toggle button */}
      {showToggle && (
        <motion.button
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setPreviewMode(true)}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#0F3C3B] to-[#0F3C3B]/80 text-white shadow-2xl flex items-center justify-center border-2 border-white/20 group"
          title="Open responsive preview (Ctrl+Shift+P)"
        >
          <Maximize2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-[#0F3C3B] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Vista responsive
            <div className="text-[10px] opacity-60 mt-0.5">Ctrl+Shift+P</div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0F3C3B]" />
          </div>
        </motion.button>
      )}
    </>
  );
}
