import { motion } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface HistoryMonth {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

interface BudgetHistoryProps {
  onMonthSelect: (month: number, year: number) => void;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function BudgetHistory({ onMonthSelect }: BudgetHistoryProps) {
  // Mock historical data
  const history: HistoryMonth[] = [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="mb-6">
        <h3 className="mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>Historial de presupuestos</h3>
        <span className="text-sm opacity-60" style={{ color: '#597370' }}>meses anteriores</span>
      </div>

      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/30 shadow-md p-6 text-center text-sm opacity-70"
        >
          Todavía no hay meses anteriores cargados.
        </motion.div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          {history.map((month, index) => {
            const monthIndex = Math.max(0, meses.indexOf(month.month));
            const isPositive = month.balance > 0;
            const incomeRatio =
              month.totalIncome > 0 ? Math.min((month.totalExpenses / month.totalIncome) * 100, 100) : 0;

            return (
              <motion.button
                key={`${month.year}-${month.month}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                whileHover={{ 
                  scale: 1.03, 
                  y: -3,
                  boxShadow: '0 8px 24px rgba(199, 140, 96, 0.25)',
                  borderColor: 'rgba(199, 140, 96, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onMonthSelect(monthIndex, month.year)}
                className="col-span-6 sm:col-span-4 md:col-span-3 text-left rounded-3xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/30 shadow-md p-6 transition-all duration-300"
                style={{ width: '100%', maxWidth: '180px', margin: '0 auto' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-white/50 flex items-center justify-center">
                      <Calendar className="w-4 h-4" style={{ color: '#0F3C3B' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 600 }}>{month.month}</div>
                      <div className="text-xs opacity-60" style={{ color: '#597370' }}>{month.year}</div>
                    </div>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-4 ${
                  isPositive ? 'bg-[#7ED4C1]/20' : 'bg-[#C78C60]/20'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" style={{ color: '#7ED4C1' }} />
                  ) : (
                    <TrendingDown className="w-4 h-4" style={{ color: '#C78C60' }} />
                  )}
                  <span className="text-sm" style={{ fontWeight: 600 }}>
                    {isPositive ? '+' : ''}{Math.round(month.balance / 1000)}k
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-60 text-xs" style={{ color: '#597370' }}>Ingresos</span>
                    <span style={{ color: '#7ED4C1', fontSize: '14px', fontWeight: 600 }}>
                      ${Math.round(month.totalIncome / 1000)}k
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-60 text-xs" style={{ color: '#597370' }}>Gastos</span>
                    <span style={{ color: '#C78C60', fontSize: '14px', fontWeight: 600 }}>
                      ${Math.round(month.totalExpenses / 1000)}k
                    </span>
                  </div>
                </div>

                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${incomeRatio}%` }}
                    transition={{ duration: 0.8, delay: index * 0.06 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#C78C60] to-[#7ED4C1]"
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
