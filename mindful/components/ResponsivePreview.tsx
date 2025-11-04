import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Tablet, Smartphone, X, Eye } from 'lucide-react';
import { useState, ReactNode } from 'react';
import type { IconComponent } from '../types';

interface Breakpoint {
  name: string;
  width: number;
  icon: IconComponent;
  label: string;
}

const breakpoints: Breakpoint[] = [
  { name: 'desktop', width: 1440, icon: Monitor, label: 'Desktop' },
  { name: 'tablet', width: 1024, icon: Tablet, label: 'Tablet' },
  { name: 'mobile', width: 375, icon: Smartphone, label: 'Mobile' },
];

interface ResponsivePreviewProps {
  children: ReactNode;
}

export function ResponsivePreview({ children }: ResponsivePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<string | null>(null);

  if (!isOpen && selectedBreakpoint === null) {
    return (
      <>
        {/* Toggle button - fixed position */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#0F3C3B] to-[#0F3C3B]/80 text-white shadow-2xl flex items-center justify-center border-2 border-white/20"
          title="Open responsive preview"
        >
          <Eye className="w-6 h-6" />
        </motion.button>
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F3C3B] p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl text-white mb-2">ῥέω — Responsive Preview</h1>
          <p className="text-sm text-white/60">
            Vista previa en {selectedBreakpoint ? '1 dispositivo' : '3 dispositivos'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Breakpoint selector */}
          <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-full p-1.5">
            <button
              onClick={() => setSelectedBreakpoint(null)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedBreakpoint === null
                  ? 'bg-white text-[#0F3C3B]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              All
            </button>
            {breakpoints.map((bp) => {
              const Icon = bp.icon;
              return (
                <button
                  key={bp.name}
                  onClick={() => setSelectedBreakpoint(bp.name)}
                  className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
                    selectedBreakpoint === bp.name
                      ? 'bg-white text-[#0F3C3B]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {bp.label}
                </button>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsOpen(false);
              setSelectedBreakpoint(null);
            }}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 hover:bg-white/20"
            title="Close preview"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>

      {/* Preview panels */}
      <AnimatePresence mode="wait">
        {selectedBreakpoint === null ? (
          <motion.div
            key="all-breakpoints"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          >
            {breakpoints.map((breakpoint, index) => (
              <PreviewPanel
                key={breakpoint.name}
                breakpoint={breakpoint}
                index={index}
              >
                {children}
              </PreviewPanel>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={selectedBreakpoint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            <PreviewPanel
              breakpoint={breakpoints.find((bp) => bp.name === selectedBreakpoint)!}
              index={0}
              isFullView
            >
              {children}
            </PreviewPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PreviewPanelProps {
  breakpoint: Breakpoint;
  children: ReactNode;
  index: number;
  isFullView?: boolean;
}

function PreviewPanel({ breakpoint, children, index, isFullView }: PreviewPanelProps) {
  const Icon = breakpoint.icon;
  const scale = isFullView ? 0.85 : 0.28;
  const containerHeight = isFullView ? 'calc(100vh - 200px)' : '800px';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col"
    >
      {/* Panel header */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-t-2xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold">{breakpoint.label}</div>
            <div className="text-white/60 text-sm">{breakpoint.width}px</div>
          </div>
        </div>
        
        {/* Indicator dots */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
      </div>

      {/* Preview container */}
      <div
        className="bg-white/5 backdrop-blur-sm border-x border-b border-white/20 rounded-b-2xl overflow-hidden"
        style={{ height: containerHeight }}
      >
        <div className="w-full h-full overflow-auto bg-[#E9E5DA]">
          <div
            style={{
              width: `${breakpoint.width}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              height: `calc(100% / ${scale})`,
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Panel footer */}
      <div className="mt-3 px-2">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Escala: {Math.round(scale * 100)}%</span>
          <span>
            {breakpoint.name === 'desktop' && 'Grid: 12 columnas'}
            {breakpoint.name === 'tablet' && 'Grid: 8 columnas'}
            {breakpoint.name === 'mobile' && 'Grid: 4 columnas'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
