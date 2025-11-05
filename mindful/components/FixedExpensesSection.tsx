import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CheckCircle2, Circle, Edit2, Waves, Plus, Calendar } from 'lucide-react';
import type { BudgetItem } from '../context/BudgetContext';
import { useBudget } from '../context/BudgetContext';

interface FixedExpensesSectionProps {
  expenses: BudgetItem[];
  monthLabel: string;
  onAdd: () => void;
  onEdit: (item: BudgetItem) => void;
  onTogglePaid: (id: string) => void;
  onUpdatePaymentDate: (id: string, fecha: string | null) => void;
}

const FALLBACK_CATEGORY = 'Sin categoría';

const formatPaymentDateLabel = (value?: string) => {
  if (!value) {
    return 'Sin fecha registrada';
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

export function FixedExpensesSection({
  expenses,
  monthLabel,
  onAdd,
  onEdit,
  onTogglePaid,
  onUpdatePaymentDate,
}: FixedExpensesSectionProps) {
  const { formatCurrency } = useBudget();
  const totalEstimado = expenses.reduce((sum, item) => sum + item.montoEstimado, 0);
  const totalPagado = expenses.reduce((sum, item) => sum + item.pagado, 0);
  const totalPendiente = Math.max(totalEstimado - totalPagado, 0);
  const monthDescriptor = monthLabel?.toLowerCase?.() ?? '';
  const groupedExpenses = useMemo(() => {
    const categoryMap = new Map<string, BudgetItem[]>();

    expenses.forEach((item) => {
      const categoryKey = item.categoria?.trim() || FALLBACK_CATEGORY;
      const current = categoryMap.get(categoryKey) ?? [];
      current.push(item);
      categoryMap.set(categoryKey, current);
    });

    return Array.from(categoryMap.entries())
      .map(([categoria, items]) => {
        const sortedItems = [...items].sort((a, b) => {
          if (b.montoEstimado !== a.montoEstimado) {
            return b.montoEstimado - a.montoEstimado;
          }
          const aName = a.concepto?.trim?.() ?? '';
          const bName = b.concepto?.trim?.() ?? '';
          return aName.localeCompare(bName, 'es', { sensitivity: 'base' });
        });
        const totalCategoriaEstimado = sortedItems.reduce(
          (sum, item) => sum + item.montoEstimado,
          0,
        );
        const totalCategoriaPagado = sortedItems.reduce((sum, item) => sum + item.pagado, 0);
        const totalCategoriaPendiente = Math.max(totalCategoriaEstimado - totalCategoriaPagado, 0);
        return {
          categoria,
          items: sortedItems,
          totalEstimado: totalCategoriaEstimado,
          totalPagado: totalCategoriaPagado,
          totalPendiente: totalCategoriaPendiente,
        };
      })
      .sort((a, b) => {
        if (b.totalEstimado !== a.totalEstimado) {
          return b.totalEstimado - a.totalEstimado;
        }
        return a.categoria.localeCompare(b.categoria, 'es', { sensitivity: 'base' });
      });
  }, [expenses]);

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

      {groupedExpenses.length > 0 ? (
        <div className="space-y-5">
          {groupedExpenses.map((group, groupIndex) => (
            <motion.div
              key={group.categoria}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: groupIndex * 0.08 }}
              className="rounded-3xl bg-gradient-to-br from-white/55 to-white/25 backdrop-blur-md border border-white/30 shadow-lg p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{group.categoria}</h4>
                  <span className="text-xs opacity-60" style={{ color: '#597370' }}>
                    {group.items.length === 1 ? '1 gasto' : `${group.items.length} gastos`}
                  </span>
                </div>
                <div className="text-right text-xs space-y-1" style={{ color: '#597370' }}>
                  <div>
                    <span className="opacity-60">Estimado </span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(group.totalEstimado)}</span>
                  </div>
                  <div>
                    <span className="opacity-60">Pagado </span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(group.totalPagado)}</span>
                  </div>
                  {group.totalPendiente > 0 && (
                    <div style={{ color: '#C78C60' }}>
                      <span className="opacity-60">Pendiente </span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(group.totalPendiente)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {group.items.map((expense, itemIndex) => {
                  const pendiente = Math.max(expense.montoEstimado - expense.pagado, 0);
                  const fechaLabel = formatPaymentDateLabel(expense.fechaPago);
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: groupIndex * 0.05 + itemIndex * 0.04,
                      }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-md border border-white/40 p-5"
                    >
                      <AnimatePresence>
                        {expense.isPagado && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.25 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.45 }}
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(126, 212, 193, 0.25), rgba(199, 140, 96, 0.18))',
                            }}
                          />
                        )}
                      </AnimatePresence>

                      <div className="relative z-10 flex flex-col gap-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {expense.isPagado ? (
                                <CheckCircle2 className="w-4 h-4" style={{ color: '#7ED4C1' }} />
                              ) : (
                                <Circle className="w-4 h-4" style={{ color: '#C78C60', opacity: 0.8 }} />
                              )}
                              <div className="truncate" style={{ fontSize: '15px', fontWeight: 600 }}>
                                {expense.concepto?.trim?.() || 'Gasto sin nombre'}
                              </div>
                            </div>
                            {expense.nota && (
                              <p className="mt-2 text-xs leading-snug opacity-70" style={{ color: '#597370' }}>
                                {expense.nota}
                              </p>
                            )}
                            <div className="mt-3 space-y-1">
                              <div className="flex flex-wrap items-center gap-2 text-xs opacity-70" style={{ color: '#597370' }}>
                                <Calendar className="w-3.5 h-3.5" />
                                <motion.input
                                  whileFocus={{ boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)' }}
                                  type="date"
                                  value={expense.fechaPago ?? ''}
                                  onChange={(event) =>
                                    onUpdatePaymentDate(expense.id, event.target.value || null)
                                  }
                                  className="px-3 py-1.5 rounded-xl bg-white/70 border border-white/50 outline-none transition-all"
                                />
                              </div>
                              <p className="text-xs opacity-60" style={{ color: '#597370' }}>
                                {fechaLabel}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div style={{ fontSize: '15px', fontWeight: 600 }}>
                              {formatCurrency(expense.montoEstimado)}
                            </div>
                            {pendiente > 0 ? (
                              <span className="text-xs opacity-70" style={{ color: '#C78C60' }}>
                                Pendiente {formatCurrency(pendiente)}
                              </span>
                            ) : (
                              <span className="text-xs" style={{ color: '#7ED4C1' }}>
                                Pagado {formatCurrency(expense.pagado)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
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
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
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
