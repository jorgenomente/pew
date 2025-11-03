import { motion } from 'motion/react';
import { Users } from 'lucide-react';

interface MonthlyChartProps {
  paolaTotal: number;
  jorgeTotal: number;
}

export function MonthlyChart({ paolaTotal, jorgeTotal }: MonthlyChartProps) {
  const total = paolaTotal + jorgeTotal;
  const paolaPercentage = total > 0 ? (paolaTotal / total) * 100 : 0;
  const jorgePercentage = total > 0 ? (jorgeTotal / total) * 100 : 0;
  
  return (
    <div 
      className="rounded-3xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm border border-white/20 shadow-lg p-6"
      style={{ minHeight: '360px' }} // Matches EvolutionChart height
    >
      {/* Donut chart - equal padding on all sides */}
      <div className="relative w-48 h-48 mx-auto mb-8">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {/* Paola segment */}
          <motion.circle
            initial={{ strokeDasharray: '0 628' }}
            animate={{ strokeDasharray: `${(paolaPercentage / 100) * 628} 628` }}
            transition={{ duration: 1, ease: "easeOut" }}
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#C78C60"
            strokeWidth="30"
            strokeLinecap="round"
            opacity="0.85"
          />
          
          {/* Jorge segment */}
          <motion.circle
            initial={{ strokeDasharray: '0 628' }}
            animate={{ strokeDasharray: `${(jorgePercentage / 100) * 628} 628` }}
            transition={{ duration: 1, delay: 0.12, ease: "easeOut" }}
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#7ED4C1"
            strokeWidth="30"
            strokeDashoffset={-((paolaPercentage / 100) * 628)}
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="text-center"
          >
            <Users className="w-5 h-5 mx-auto mb-2 opacity-60" />
            <div className="text-xs opacity-60 mb-1" style={{ color: '#597370' }}>Total</div>
            <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.01em' }}>
              ${total.toLocaleString()}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Legend - consistent spacing */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-sm border border-white/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#C78C60' }} />
            <span style={{ fontSize: '16px', fontWeight: 500 }}>Paola</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span style={{ fontSize: '18px', fontWeight: 600 }}>
              ${paolaTotal.toLocaleString()}
            </span>
            <span className="text-xs opacity-60" style={{ color: '#597370' }}>
              {Math.round(paolaPercentage)}%
            </span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-sm border border-white/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#7ED4C1' }} />
            <span style={{ fontSize: '16px', fontWeight: 500 }}>Jorge</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span style={{ fontSize: '18px', fontWeight: 600 }}>
              ${jorgeTotal.toLocaleString()}
            </span>
            <span className="text-xs opacity-60" style={{ color: '#597370' }}>
              {Math.round(jorgePercentage)}%
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
