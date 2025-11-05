import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CheckCircle2, Circle, Edit2, Waves, Plus } from 'lucide-react';
import type { BudgetItem } from '../context/BudgetContext';
import { useBudget } from '../context/BudgetContext';

interface FixedExpensesSectionProps {
  expenses: BudgetItem[];
  monthLabel: string;
  onAdd: () => void;
  onEdit: (item: BudgetItem) => void;
  onTogglePaid: (id: string) => void;
}

export function FixedExpensesSection({
  expenses,
  monthLabel,
  onAdd,
  onEdit,
  onTogglePaid,
}: FixedExpensesSectionProps) {
  const { formatCurrency } = useBudget();
  const totalEstimado = expenses.reduce((sum, item) => sum + item.montoEstimado, 0);
  const totalPagado = expenses.reduce((sum, item) => sum + item.pagado, 0);
  const totalPendiente = Math.max(totalEstimado - totalPagado, 0);
  const monthDescriptor = monthLabel?.toLowerCase?.() ?? '';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.18 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>
            Gastos fijos del mes
          </h3>
          <span className="text-sm opacity-60" style={{ color: '#597370' }}>
            {monthDescriptor || 'este mes'}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#C78C60] to-[#B57A50] text-white text-sm shadow-lg"
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
            <Wallet className="w-5 h-5" style={{ color: '#C78C60' }} />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest opacity-60" style={{ color: '#597370' }}>
              Total estimado
            </p>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>
              {formatCurrency(totalEstimado)}
            </div>
          </div>
          <div className="text-right text-xs" style={{ color: '#597370' }}>
            <div className="mb-1">
              <span className="opacity-60">Pagado </span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(totalPagado)}</span>
            </div>
            <div>
              <span className="opacity-60">Pendiente </span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(totalPendiente)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {expenses.length > 0 ? (
        <div className="space-y-4">
          {expenses.map((expense, index) => {
            const pendiente = Math.max(expense.montoEstimado - expense.pagado, 0);
            const progreso =
              expense.montoEstimado > 0
                ? Math.min(100, (expense.pagado / expense.montoEstimado) * 100)
                : expense.isPagado
                  ? 100
                  : 0;
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/30 shadow-lg p-6"
              >
                <AnimatePresence>
                  {expense.isPagado && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.35 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 rounded-3xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(126, 212, 193, 0.25), rgba(199, 140, 96, 0.2))',
                      }}
                    />
                  )}
                </AnimatePresence>

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>{expense.concepto}</div>
                    {expense.categoria && (
                      <p className="text-xs opacity-60 mt-1" style={{ color: '#597370' }}>
                        Categoría: {expense.categoria}
                      </p>
                    )}
                    {expense.nota && (
                      <p className="text-xs opacity-60 mt-1" style={{ color: '#597370' }}>
                        {expense.nota}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatCurrency(expense.montoEstimado)}</div>
                    {pendiente > 0 ? (
                      <span className="text-xs opacity-60" style={{ color: '#C78C60' }}>
                        Pendiente {formatCurrency(pendiente)}
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: '#7ED4C1' }}>
                        Pagado
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative z-10 mt-5 h-2 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progreso}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      background:
                        progreso >= 100
                          ? 'linear-gradient(90deg, #7ED4C1, #7ED4C1)'
                          : 'linear-gradient(90deg, #C78C60, #7ED4C1)',
                    }}
                  />
                </div>

                <div className="relative z-10 mt-5 flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onTogglePaid(expense.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-xs font-semibold transition-colors"
                    style={{
                      color: expense.isPagado ? '#0F3C3B' : '#C78C60',
                    }}
                  >
                    {expense.isPagado ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                    {expense.isPagado ? 'Marcar como pendiente' : 'Marcar como pagado'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onEdit(expense)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-xs transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
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
          <Waves className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm opacity-60" style={{ color: '#597370' }}>
            Sumá tus gastos fijos para anticipar el presupuesto mensual.
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}
