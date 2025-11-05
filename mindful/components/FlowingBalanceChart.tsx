import { motion } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';

interface FlowingBalanceChartProps {
  income: number;
  expenses: number;
}

export function FlowingBalanceChart({ income, expenses }: FlowingBalanceChartProps) {
  const { getMonthName, formatCurrency } = useBudget();

  const balance = income - expenses;
  const total = income + expenses;
  const incomePercent = total === 0 ? 0 : (income / total) * 100;

  return (
    <div 
      className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm border border-white/20 shadow-lg"
      style={{ height: '232px' }} // 29 * 8 = 232px (balanced height 220-240px range)
    >
      {/* Flowing wave animation */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7ED4C1" stopOpacity="0.3" />
            <stop offset={`${incomePercent}%`} stopColor="#7ED4C1" stopOpacity="0.3" />
            <stop offset={`${incomePercent}%`} stopColor="#C78C60" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#C78C60" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        
        {/* Animated wave layers */}
        <motion.path
          initial={{ d: "M0,150 Q250,130 500,150 T1000,150 L1000,300 L0,300 Z" }}
          animate={{
            d: [
              "M0,150 Q250,130 500,150 T1000,150 L1000,300 L0,300 Z",
              "M0,145 Q250,165 500,145 T1000,145 L1000,300 L0,300 Z",
              "M0,150 Q250,130 500,150 T1000,150 L1000,300 L0,300 Z",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          fill="url(#waveGradient)"
          opacity="0.5"
        />
        
        <motion.path
          initial={{ d: "M0,170 Q250,150 500,170 T1000,170 L1000,300 L0,300 Z" }}
          animate={{
            d: [
              "M0,170 Q250,150 500,170 T1000,170 L1000,300 L0,300 Z",
              "M0,165 Q250,185 500,165 T1000,165 L1000,300 L0,300 Z",
              "M0,170 Q250,150 500,170 T1000,170 L1000,300 L0,300 Z",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          fill="url(#waveGradient)"
          opacity="0.3"
        />
      </svg>

      {/* Balance display - refined typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <div className="text-sm mb-2 opacity-60" style={{ color: '#597370', fontSize: '14px' }}>
            Balance {getMonthName()}
          </div>
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              fontSize: '32px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: balance >= 0 ? '#7ED4C1' : '#C78C60'
            }}
          >
            {formatCurrency(balance)}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating labels - refined positioning */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#7ED4C1]" />
        <span className="text-sm opacity-70" style={{ fontSize: '14px' }}>
          Ingresos {formatCurrency(income)}
        </span>
      </div>
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#C78C60]" />
        <span className="text-sm opacity-70" style={{ fontSize: '14px' }}>
          Gastos {formatCurrency(expenses)}
        </span>
      </div>
    </div>
  );
}
