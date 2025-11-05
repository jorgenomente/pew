import { motion } from 'framer-motion';
import { Calendar, ClipboardList, Plus, StickyNote, Tag, Trash2 } from 'lucide-react';
import type { VariableExpense } from '../context/BudgetContext';

interface VariableExpensesSectionProps {
  expenses: VariableExpense[];
  monthLabel: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const formatCurrency = (value: number) =>
  value.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  });

const formatDate = (value?: string) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
  });
};

export function VariableExpensesSection({
  expenses,
  monthLabel,
  onAdd,
  onRemove,
}: VariableExpensesSectionProps) {
  const descriptor = monthLabel?.toLowerCase?.() ?? 'este mes';
  const sortedExpenses = [...expenses].sort((a, b) => {
    const dateA = a.fecha ? new Date(a.fecha).getTime() : 0;
    const dateB = b.fecha ? new Date(b.fecha).getTime() : 0;
    if (dateA && dateB) {
      return dateA - dateB;
    }
    return b.monto - a.monto;
  });
  const total = sortedExpenses.reduce((sum, expense) => sum + expense.monto, 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.22 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>
            Gastos variables del mes
          </h3>
          <span className="text-sm opacity-60" style={{ color: '#597370' }}>
            {descriptor}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#F4C095] to-[#C78C60] text-white text-sm shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Agregar</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl bg-gradient-to-br from-white/45 to-white/25 backdrop-blur-md border border-white/30 p-5 mb-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C78C60]/20 flex items-center justify-center">
            <ClipboardList className="w-5 h-5" style={{ color: '#C78C60' }} />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest opacity-60" style={{ color: '#597370' }}>
              Total planificado
            </p>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>
              ${formatCurrency(total)}
            </div>
          </div>
        </div>
      </motion.div>

      {sortedExpenses.length > 0 ? (
        <div className="space-y-4">
          {sortedExpenses.map((expense, index) => {
            const formattedDate = formatDate(expense.fecha);
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/30 shadow-lg p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>{expense.concepto}</div>
                    <div className="mt-2 space-y-1">
                      {expense.categoria && (
                        <div className="flex items-center gap-2 text-xs opacity-70" style={{ color: '#C78C60' }}>
                          <Tag className="w-3.5 h-3.5" />
                          <span>{expense.categoria}</span>
                        </div>
                      )}
                      {formattedDate && (
                        <div className="flex items-center gap-2 text-xs opacity-70" style={{ color: '#597370' }}>
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formattedDate}</span>
                        </div>
                      )}
                      {expense.nota && (
                        <div className="flex items-start gap-2 text-xs opacity-70" style={{ color: '#597370' }}>
                          <StickyNote className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="leading-snug">{expense.nota}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>${formatCurrency(expense.monto)}</div>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onRemove(expense.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-xs font-semibold text-[#C78C60]"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm border border-white/30 p-8 text-center"
        >
          <ClipboardList className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm opacity-60" style={{ color: '#597370' }}>
            Agendá los gastos únicos de {descriptor} y mantenelos visibles durante el mes.
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}
