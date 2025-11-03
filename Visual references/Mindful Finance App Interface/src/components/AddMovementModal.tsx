import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Tag, FileText, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface AddMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (movement: any) => void;
}

export function AddMovementModal({ isOpen, onClose, onAdd }: AddMovementModalProps) {
  const [tipo, setTipo] = useState<'income' | 'expense'>('expense');
  const [formData, setFormData] = useState({
    fecha: '',
    persona: 'Paola',
    categoria: '',
    descripcion: '',
    monto: '',
    recibido: false,
  });

  const categorias = tipo === 'income' 
    ? ['Salario', 'Freelance', 'Inversión', 'Otro']
    : ['Hogar', 'Comida', 'Transporte', 'Compras', 'Bienestar', 'Otro'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, tipo });
    onClose();
    setFormData({
      fecha: '',
      persona: 'Paola',
      categoria: '',
      descripcion: '',
      monto: '',
      recibido: false,
    });
  };

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
                
                <h3 className="mb-1">Agregar movimiento</h3>
                <p className="text-xs opacity-60">Registrá un ingreso o gasto nuevo</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Tipo toggle */}
                <div className="flex gap-2 p-1 rounded-2xl bg-white/40">
                  <button
                    type="button"
                    onClick={() => setTipo('income')}
                    className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                      tipo === 'income'
                        ? 'bg-[#7ED4C1] text-[#0F3C3B] shadow-md'
                        : 'text-[#0F3C3B]/60'
                    }`}
                  >
                    Ingreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipo('expense')}
                    className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                      tipo === 'expense'
                        ? 'bg-[#C78C60] text-white shadow-md'
                        : 'text-[#0F3C3B]/60'
                    }`}
                  >
                    Gasto
                  </button>
                </div>

                {/* Fecha */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm opacity-70">
                    <Calendar className="w-4 h-4" />
                    Fecha
                  </label>
                  <motion.input
                    whileFocus={{
                      boxShadow: tipo === 'income' 
                        ? '0 0 0 3px rgba(126, 212, 193, 0.2)'
                        : '0 0 0 3px rgba(199, 140, 96, 0.2)',
                    }}
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none"
                    required
                  />
                </div>

                {/* Persona */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm opacity-70">
                    <User className="w-4 h-4" />
                    Persona
                  </label>
                  <motion.select
                    whileFocus={{
                      boxShadow: tipo === 'income' 
                        ? '0 0 0 3px rgba(126, 212, 193, 0.2)'
                        : '0 0 0 3px rgba(199, 140, 96, 0.2)',
                    }}
                    value={formData.persona}
                    onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none"
                  >
                    <option value="Paola">Paola</option>
                    <option value="Jorge">Jorge</option>
                  </motion.select>
                </div>

                {/* Categoría */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm opacity-70">
                    <Tag className="w-4 h-4" />
                    Categoría
                  </label>
                  <motion.select
                    whileFocus={{
                      boxShadow: tipo === 'income' 
                        ? '0 0 0 3px rgba(126, 212, 193, 0.2)'
                        : '0 0 0 3px rgba(199, 140, 96, 0.2)',
                    }}
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none"
                    required
                  >
                    <option value="">Seleccioná una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </motion.select>
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm opacity-70">
                    <FileText className="w-4 h-4" />
                    Descripción
                  </label>
                  <motion.input
                    whileFocus={{
                      boxShadow: tipo === 'income' 
                        ? '0 0 0 3px rgba(126, 212, 193, 0.2)'
                        : '0 0 0 3px rgba(199, 140, 96, 0.2)',
                    }}
                    type="text"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Ej: Supermercado Carrefour"
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none placeholder:opacity-40"
                    required
                  />
                </div>

                {/* Monto */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm opacity-70">
                    <DollarSign className="w-4 h-4" />
                    Monto (ARS)
                  </label>
                  <motion.input
                    whileFocus={{
                      boxShadow: tipo === 'income' 
                        ? '0 0 0 3px rgba(126, 212, 193, 0.2)'
                        : '0 0 0 3px rgba(199, 140, 96, 0.2)',
                    }}
                    type="number"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none placeholder:opacity-40"
                    required
                  />
                </div>

                {/* Recibido toggle */}
                <label className="flex items-center gap-3 p-4 rounded-2xl bg-white/40 cursor-pointer">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="relative w-12 h-6 rounded-full transition-colors"
                    style={{
                      backgroundColor: formData.recibido ? '#7ED4C1' : 'rgba(15, 60, 59, 0.2)',
                    }}
                  >
                    <motion.div
                      animate={{
                        x: formData.recibido ? 24 : 2,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                    />
                  </motion.div>
                  <div className="flex-1">
                    <div className="text-sm">Recibido / Pagado</div>
                    <div className="text-xs opacity-60">Marcar como completado</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.recibido}
                    onChange={(e) => setFormData({ ...formData, recibido: e.target.checked })}
                    className="sr-only"
                  />
                </label>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 rounded-2xl text-white shadow-lg"
                  style={{
                    background: tipo === 'income'
                      ? 'linear-gradient(135deg, #7ED4C1, #5FCFBA)'
                      : 'linear-gradient(135deg, #C78C60, #B57A50)',
                  }}
                >
                  Agregar movimiento
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
