import { motion } from 'framer-motion';
import { Users, Waves } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

const SEGMENT_COLORS = ['#C78C60', '#7ED4C1', '#0F3C3B', '#FFC857'];
const CIRCUMFERENCE = 2 * Math.PI * 70;

interface PersonaTotal {
  persona: string;
  total: number;
}

interface MonthlyChartProps {
  personaTotals: PersonaTotal[];
}

export function MonthlyChart({ personaTotals }: MonthlyChartProps) {
  const { formatCurrency } = useBudget();
  const relevantTotals = personaTotals.filter((item) => item.total > 0);
  const totalAmount = relevantTotals.reduce((sum, item) => sum + item.total, 0);

  if (totalAmount <= 0) {
    return (
      <div
        className="rounded-3xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm border border-white/20 shadow-lg p-6 flex flex-col items-center justify-center text-center gap-3"
        style={{ minHeight: '360px' }}
      >
        <Waves className="w-8 h-8 opacity-30" />
        <p className="text-sm opacity-60">Aún no registraste ingresos</p>
        <p className="text-xs opacity-40">Agregá movimientos para ver la distribución personal</p>
      </div>
    );
  }

  const boundedTotals = relevantTotals.slice(0, SEGMENT_COLORS.length);
  const segments = boundedTotals.map((item, index) => {
    const percentage = (item.total / totalAmount) * 100;
    const dashArray = `${(percentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    const previousPercentage = boundedTotals
      .slice(0, index)
      .reduce((sum, current) => sum + (current.total / totalAmount) * 100, 0);
    const dashOffset = -((previousPercentage / 100) * CIRCUMFERENCE);

    return {
      ...item,
      color: SEGMENT_COLORS[index],
      percentage,
      dashArray,
      dashOffset,
      animationDelay: index * 0.12,
    };
  });

  return (
    <div
      className="rounded-3xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm border border-white/20 shadow-lg p-6"
      style={{ minHeight: '360px' }}
    >
      <div className="relative w-48 h-48 mx-auto mb-8">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {segments.map((segment) => (
            <motion.circle
              key={segment.persona}
              initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
              animate={{ strokeDasharray: segment.dashArray }}
              transition={{ duration: 1, delay: segment.animationDelay, ease: 'easeOut' }}
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke={segment.color}
              strokeWidth="30"
              strokeDashoffset={segment.dashOffset}
              strokeLinecap="round"
              opacity="0.85"
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="text-center"
          >
            <Users className="w-5 h-5 mx-auto mb-2 opacity-60" />
            <div className="text-xs opacity-60 mb-1" style={{ color: '#597370' }}>
              Total
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.01em' }}>
              {formatCurrency(totalAmount)}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="space-y-3">
        {segments.map((segment, index) => (
          <motion.div
            key={`${segment.persona}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-sm border border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }} />
              <span style={{ fontSize: '16px', fontWeight: 500 }}>{segment.persona}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span style={{ fontSize: '18px', fontWeight: 600 }}>
                {formatCurrency(segment.total)}
              </span>
              <span className="text-xs opacity-60" style={{ color: '#597370' }}>
                {Math.round(segment.percentage)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
