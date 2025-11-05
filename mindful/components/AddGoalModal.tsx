import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, DollarSign, Calendar, Flag } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { GoalFormData, GoalPriority } from '../types';
import { useBudget } from '../context/BudgetContext';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: GoalFormData) => void;
}

export function AddGoalModal({ isOpen, onClose, onAdd }: AddGoalModalProps) {
  const { currencyConfig } = useBudget();
  const [formData, setFormData] = useState<GoalFormData>({
    nombre: '',
    montoObjetivo: '',
    montoActual: '',
    fecha: '',
    prioridad: 'media',
  });

  const amountPlaceholder = useMemo(() => {
    if (currencyConfig.fractionDigits <= 0) {
      return '0';
    }
    return `0${currencyConfig.decimalSeparator}${'0'.repeat(currencyConfig.fractionDigits)}`;
  }, [currencyConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
    setFormData({
      nombre: '',
      montoObjetivo: '',
      montoActual: '',
      fecha: '',
      prioridad: 'media',
    });
  };

  const prioridades: Array<{ value: GoalPriority; label: string; color: string }> = [
    { value: 'alta', label: 'Alta', color: '#C78C60' },
    { value: 'media', label: 'Media', color: '#7ED4C1' },
    { value: 'baja', label: 'Baja', color: '#0F3C3B' },
  ];

  const progress = formData.montoObjetivo && formData.montoActual
    ? (parseFloat(formData.montoActual) / parseFloat(formData.montoObjetivo)) * 100
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0F3C3B]/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto z-50 max-h-[90vh] overflow-auto"
          >
            <div className="rounded-3xl bg-gradient-to-br from-[#E9E5DA] to-[#E9E5DA]/95 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-6 pb-4 border-b border-[#0F3C3B]/10">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </motion.button>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C78C60]/20 flex items-center justify-center">
                    <Target className="w-5 h-5" style={{ color: '#C78C60' }} />
                  </div>
                  <div>
                    <h3 className="mb-0.5">Nueva meta</h3>
                    <p className="text-xs opacity-60">Define un objetivo financiero</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm opacity-70">
                    <Target className="w-4 h-4" />
                    Nombre de la meta
                  </label>
                  <motion.input
                    whileFocus={{
                      boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                    }}
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Viaje a Europa, Casa nueva..."
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none placeholder:opacity-40"
                    required
                  />
                </div>

                {/* Monto objetivo */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm opacity-70">
                    <DollarSign className="w-4 h-4" />
                    {`Monto objetivo (${currencyConfig.code})`}
                  </label>
                  <motion.input
                    whileFocus={{
                      boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                    }}
                    type="number"
                    value={formData.montoObjetivo}
                    onChange={(e) => setFormData({ ...formData, montoObjetivo: e.target.value })}
                    placeholder={amountPlaceholder}
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none placeholder:opacity-40"
                    required
                  />
                </div>

                {/* Monto actual */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm opacity-70">
                    <DollarSign className="w-4 h-4" />
                    {`Monto actual (${currencyConfig.code})`}
                  </label>
                  <motion.input
                    whileFocus={{
                      boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                    }}
                    type="number"
                    value={formData.montoActual}
                    onChange={(e) => setFormData({ ...formData, montoActual: e.target.value })}
                    placeholder={amountPlaceholder}
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none placeholder:opacity-40"
                  />
                </div>

                {/* Progress preview */}
                {formData.montoObjetivo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-2xl bg-white/40 space-y-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-70">Progreso</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="relative h-2 bg-white/40 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
                      >
                        <motion.div
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="h-full w-full bg-gradient-to-r from-transparent via-[#C78C60] to-transparent"
                          style={{ width: '200%' }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Fecha */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm opacity-70">
                    <Calendar className="w-4 h-4" />
                    Fecha objetivo
                  </label>
                  <motion.input
                    whileFocus={{
                      boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                    }}
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none"
                  />
                </div>

                {/* Prioridad */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm opacity-70">
                    <Flag className="w-4 h-4" />
                    Prioridad
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {prioridades.map((p) => (
                      <motion.button
                        key={p.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, prioridad: p.value })}
                        whileTap={{ scale: 0.95 }}
                        className={`py-3 rounded-xl transition-all ${
                          formData.prioridad === p.value
                            ? 'text-white shadow-md'
                            : 'bg-white/40 text-[#0F3C3B]/60'
                        }`}
                        style={{
                          backgroundColor: formData.prioridad === p.value ? p.color : undefined,
                        }}
                      >
                        {p.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 rounded-2xl text-white shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #C78C60, #B57A50)',
                  }}
                >
                  Crear meta
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
