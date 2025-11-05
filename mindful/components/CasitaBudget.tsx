import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, Wifi, Droplet, Wrench, Edit2, Waves, Circle, CheckCircle2 } from 'lucide-react';
import { useBudget, BudgetItem as BudgetItemType } from '../context/BudgetContext';
import { InlineEditableText } from './InlineEditableText';
import type { IconComponent } from '../types';

interface CasitaBudgetProps {
  onEdit?: (item: BudgetItemType) => void;
}

export function CasitaBudget({ onEdit }: CasitaBudgetProps) {
  const {
    expenses,
    budgetName,
    setBudgetName,
    updateExpenseName,
    toggleExpensePaid,
    formatCurrency,
  } = useBudget();
  
  // Map expenses to include icons
  const items = expenses.map(expense => ({
    ...expense,
    icon: getIconForConcept(expense.concepto)
  }));
  
  const totalEstimado = items.reduce((sum, item) => sum + item.montoEstimado, 0);
  const totalPagado = items.reduce((sum, item) => sum + item.pagado, 0);
  const totalPendiente = totalEstimado - totalPagado;
  
  return (
    <div className="space-y-4">
      {/* Header with totals - consistent padding */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-md border border-white/30 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-[#7ED4C1]/20 flex items-center justify-center">
            <Home className="w-6 h-6" style={{ color: '#0F3C3B' }} />
          </div>
          <div className="flex-1">
            <InlineEditableText
              value={budgetName}
              onSave={setBudgetName}
              style={{ fontSize: '16px', fontWeight: 600 }}
              type="neutral"
              placeholder="Nombre del presupuesto"
            />
            <p className="text-xs opacity-60 mt-1" style={{ color: '#597370' }}>Balance mensual</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-4 rounded-2xl bg-white/30">
            <div className="text-xs opacity-60 mb-2" style={{ color: '#597370' }}>Estimado</div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatCurrency(totalEstimado)}</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-[#7ED4C1]/20">
            <div className="text-xs opacity-60 mb-2" style={{ color: '#597370' }}>Pagado</div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatCurrency(totalPagado)}</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-[#C78C60]/20">
            <div className="text-xs opacity-60 mb-2" style={{ color: '#597370' }}>Pendiente</div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatCurrency(totalPendiente)}</div>
          </div>
        </div>
      </motion.div>
      
      {/* Budget items - editable categories and payment status */}
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item, index) => {
            const Icon = item.icon;
            const porcentajePagado = (item.pagado / item.montoEstimado) * 100;
            const pendiente = item.montoEstimado - item.pagado;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/30 shadow-lg p-6"
                style={{ minHeight: '104px' }}
              >
                {/* Wave ripple effect when marked as paid */}
                <AnimatePresence>
                  {item.isPagado && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0.6 }}
                      animate={{ scale: 3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute inset-0 rounded-3xl pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, rgba(126, 212, 193, 0.4) 0%, transparent 70%)',
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Edit button */}
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(item)}
                    className="absolute top-4 right-16 w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity z-10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                )}

                {/* Payment status toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleExpensePaid(item.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center z-10 transition-all"
                  title={item.isPagado ? 'Marcar como pendiente' : 'Marcar como pagado'}
                  style={{
                    background: item.isPagado 
                      ? 'linear-gradient(135deg, #C78C60 0%, #7ED4C1 100%)' 
                      : 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {item.isPagado ? (
                      <motion.div
                        key="paid"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pending"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Circle className="w-6 h-6" style={{ color: '#C78C60', opacity: 0.5 }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <div className="flex items-start justify-between mb-4 pr-24">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-white/50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" style={{ color: '#0F3C3B' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <InlineEditableText
                        value={item.concepto}
                        onSave={(newName) => updateExpenseName(item.id, newName)}
                        style={{ fontSize: '16px', fontWeight: 600 }}
                        type="expense"
                        placeholder="Categoría"
                      />
                      <div className="text-xs opacity-60 mt-1" style={{ color: '#597370' }}>
                        {formatCurrency(item.montoEstimado)} estimado
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="mb-1" style={{ fontSize: '16px', fontWeight: 600, color: '#7ED4C1' }}>
                      {formatCurrency(item.pagado)}
                    </div>
                    {pendiente > 0 && (
                      <div className="text-xs opacity-60 whitespace-nowrap" style={{ color: '#597370' }}>
                        {formatCurrency(pendiente)} restante
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Progress bar with breathing animation */}
                <div className="relative h-2 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${porcentajePagado}%`,
                      opacity: [1, 0.8, 1],
                    }}
                    transition={{ 
                      width: { duration: 0.8, delay: index * 0.06, ease: "easeOut" },
                      opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: porcentajePagado === 100
                        ? 'linear-gradient(90deg, #7ED4C1, #7ED4C1)'
                        : 'linear-gradient(90deg, #C78C60, #7ED4C1)',
                    }}
                  />
                </div>

                {/* Paid/Pending label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-4 right-4 text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: item.isPagado ? 'rgba(126, 212, 193, 0.2)' : 'rgba(199, 140, 96, 0.2)',
                    color: item.isPagado ? '#7ED4C1' : '#C78C60',
                  }}
                >
                  {item.isPagado ? 'Pagado' : 'Pendiente'}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm border border-white/30 p-8 text-center"
        >
          <Waves className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm opacity-60">Sin gastos registrados</p>
        </motion.div>
      )}
    </div>
  );
}

// Helper function to get icon for each concept
function getIconForConcept(concepto: string) {
  const iconMap: Record<string, IconComponent> = {
    'Alquiler': Home,
    'Servicios': Zap,
    'Internet': Wifi,
    'Agua': Droplet,
    'Mantenimiento': Wrench,
  };
  return iconMap[concepto] || Home;
}
