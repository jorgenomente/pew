import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (item: any) => void;
  item: any;
  type: 'income' | 'casita';
}

export function EditItemModal({ isOpen, onClose, onUpdate, item, type }: EditItemModalProps) {
  const [formData, setFormData] = useState({
    concepto: '',
    montoEstimado: '',
    montoPagado: '',
    nota: '',
  });

  useEffect(() => {
    if (item && isOpen) {
      if (type === 'income') {
        setFormData({
          concepto: item.fuente || '',
          montoEstimado: item.monto?.toString() || '',
          montoPagado: item.monto?.toString() || '',
          nota: '',
        });
      } else {
        setFormData({
          concepto: item.concepto || '',
          montoEstimado: item.montoEstimado?.toString() || '',
          montoPagado: item.pagado?.toString() || '',
          nota: item.nota || '',
        });
      }
    }
  }, [item, isOpen, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...item, ...formData });
    onClose();
  };

  const porcentajePagado = formData.montoEstimado && formData.montoPagado
    ? (parseFloat(formData.montoPagado) / parseFloat(formData.montoEstimado)) * 100
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
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto z-50"
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
                
                <h3 className="mb-1">Editar {type === 'income' ? 'ingreso' : 'gasto'}</h3>
                <p className="text-xs opacity-60">Actualizar información</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Concepto */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm opacity-70">
                    <FileText className="w-4 h-4" />
                    {type === 'income' ? 'Fuente' : 'Concepto'}
                  </label>
                  <motion.input
                    whileFocus={{
                      boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                    }}
                    type="text"
                    value={formData.concepto}
                    onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none"
                    required
                  />
                </div>

                {/* Monto estimado/total */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm opacity-70">
                    <DollarSign className="w-4 h-4" />
                    {type === 'income' ? 'Monto total (ARS)' : 'Monto estimado (ARS)'}
                  </label>
                  <motion.input
                    whileFocus={{
                      boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                    }}
                    type="number"
                    value={formData.montoEstimado}
                    onChange={(e) => setFormData({ ...formData, montoEstimado: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none"
                    required
                  />
                </div>

                {/* Monto pagado (only for casita) */}
                {type === 'casita' && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm opacity-70">
                      <DollarSign className="w-4 h-4" />
                      Monto pagado (ARS)
                    </label>
                    <motion.input
                      whileFocus={{
                        boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                      }}
                      type="number"
                      value={formData.montoPagado}
                      onChange={(e) => setFormData({ ...formData, montoPagado: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none"
                    />
                  </div>
                )}

                {/* Progress preview (only for casita) */}
                {type === 'casita' && formData.montoEstimado && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-2xl bg-white/40 space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-70">Progreso</span>
                      <span>{Math.round(porcentajePagado)}%</span>
                    </div>
                    <div className="h-2 bg-white/40 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(porcentajePagado, 100)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: porcentajePagado >= 100
                            ? 'linear-gradient(90deg, #7ED4C1, #7ED4C1)'
                            : 'linear-gradient(90deg, #C78C60, #7ED4C1)',
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Nota (only for casita) */}
                {type === 'casita' && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm opacity-70">
                      <FileText className="w-4 h-4" />
                      Nota opcional
                    </label>
                    <motion.textarea
                      whileFocus={{
                        boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                      }}
                      value={formData.nota}
                      onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
                      placeholder="Agregar detalles adicionales..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none placeholder:opacity-40 resize-none"
                    />
                  </div>
                )}

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
                  Actualizar
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
