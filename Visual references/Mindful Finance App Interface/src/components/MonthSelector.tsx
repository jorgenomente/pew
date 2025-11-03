import { motion } from 'motion/react';
import { ChevronDown, Calendar } from 'lucide-react';
import { useState } from 'react';

interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number, year: number) => void;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const mesesCortos = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export function MonthSelector({ selectedMonth, selectedYear, onMonthChange }: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Generate last 6 months including current
  const getRecentMonths = () => {
    const months = [];
    const now = new Date(selectedYear, selectedMonth, 1);
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i);
      months.push({
        month: date.getMonth(),
        year: date.getFullYear(),
        label: mesesCortos[date.getMonth()],
        fullLabel: meses[date.getMonth()],
      });
    }
    
    return months;
  };

  const recentMonths = getRecentMonths();

  return (
    <div className="space-y-4">
      {/* Main selector */}
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-md border border-white/40 shadow-md"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 opacity-60" />
            <div className="text-left">
              <div className="text-sm opacity-60">Período</div>
              <div>{meses[selectedMonth]} {selectedYear}</div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 opacity-60" />
          </motion.div>
        </motion.button>

        {/* Dropdown */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 z-20 rounded-2xl bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {meses.map((mes, index) => (
                <motion.button
                  key={index}
                  whileHover={{ backgroundColor: 'rgba(126, 212, 193, 0.1)' }}
                  onClick={() => {
                    onMonthChange(index, selectedYear);
                    setIsOpen(false);
                  }}
                  className={`w-full px-5 py-3 text-left transition-colors ${
                    index === selectedMonth
                      ? 'bg-[#7ED4C1]/20'
                      : ''
                  }`}
                >
                  {mes} {selectedYear}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Recent months timeline */}
      <div className="overflow-x-auto pb-2 -mx-1">
        <div className="flex gap-2 px-1">
          {recentMonths.map((month, index) => {
            const isSelected = month.month === selectedMonth && month.year === selectedYear;
            
            return (
              <motion.button
                key={`${month.year}-${month.month}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMonthChange(month.month, month.year)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#C78C60] to-[#B57A50] text-white shadow-md'
                    : 'bg-white/40 backdrop-blur-sm border border-white/30'
                }`}
              >
                <div className="text-xs opacity-70 capitalize">{month.label}</div>
                <div className="text-sm">{month.year}</div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
