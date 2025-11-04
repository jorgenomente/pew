import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, DollarSign } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import type { BudgetItem, IncomeEntry } from '../context/BudgetContext';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (item: IncomeEntry | (BudgetItem & { nota?: string })) => void;
  onDelete?: (item: IncomeEntry | (BudgetItem & { nota?: string })) => void;
  item: IncomeEntry | (BudgetItem & { nota?: string }) | null;
  type: 'income' | 'casita';
}

const isIncomeEntry = (
  value: IncomeEntry | (BudgetItem & { nota?: string })
): value is IncomeEntry => 'fuente' in value;

const isBudgetItem = (
  value: IncomeEntry | (BudgetItem & { nota?: string })
): value is BudgetItem & { nota?: string } => 'concepto' in value;

export function EditItemModal({
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  item,
  type,
}: EditItemModalProps) {
  const [formData, setFormData] = useState({
    concepto: '',
    montoEstimado: '',
    montoPagado: '',
    nota: '',
  });

  useEffect(() => {
    if (!item || !isOpen) {
      return;
    }

    if (type === 'income') {
      if (!isIncomeEntry(item)) {
        return;
      }

      const frame = window.requestAnimationFrame(() =>
        setFormData({
          concepto: item.fuente || '',
          montoEstimado: item.monto?.toString() || '',
          montoPagado: item.monto?.toString() || '',
          nota: '',
        })
      );

      return () => window.cancelAnimationFrame(frame);
    }

    if (!isBudgetItem(item)) {
      return;
    }

    const frame = window.requestAnimationFrame(() =>
      setFormData({
        concepto: item.concepto || '',
        montoEstimado: item.montoEstimado?.toString() || '',
        montoPagado: item.pagado?.toString() || '',
        nota: item.nota || '',
      })
    );

    return () => window.cancelAnimationFrame(frame);
  }, [item, isOpen, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) {
      return;
    }

    if (type === 'income') {
      if (!isIncomeEntry(item)) {
        return;
      }

      const monto = parseAmount(formData.montoEstimado);

      const updatedIncome: IncomeEntry = {
        ...item,
        fuente: formData.concepto,
        monto,
      };
      onUpdate(updatedIncome);
    } else {
      if (!isBudgetItem(item)) {
        return;
      }

      const montoEstimado = parseAmount(formData.montoEstimado);
      const montoPagado = parseAmount(formData.montoPagado);

      const isPagado = montoPagado >= montoEstimado;

      const updatedBudgetItem: BudgetItem & { nota?: string } = {
        ...item,
        concepto: formData.concepto,
        montoEstimado,
        pagado: montoPagado,
        isPagado,
        nota: formData.nota,
      };
      onUpdate(updatedBudgetItem);
    }
    onClose();
  };

  const parseAmount = (value: string) => {
    const normalized = value.endsWith('.') ? value.slice(0, -1) : value;
    if (!normalized) {
      return 0;
    }
    const parsed = Number.parseFloat(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const normalizeAmountInput = (input: string) => {
    const cleaned = input.replace(/\s/g, '').replace(/[^\d.,]/g, '');

    if (!cleaned) {
      return '';
    }

    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');

    let decimalIndex = -1;
    let hasTrailingDecimal = false;

    if (lastComma !== -1) {
      const digitsAfterComma = cleaned
        .slice(lastComma + 1)
        .replace(/\D/g, '');

      if (digitsAfterComma.length === 0 && lastComma === cleaned.length - 1) {
        decimalIndex = lastComma;
        hasTrailingDecimal = true;
      } else if (digitsAfterComma.length <= 2) {
        decimalIndex = lastComma;
      }
    } else if (lastDot !== -1) {
      const digitsAfterDot = cleaned
        .slice(lastDot + 1)
        .replace(/\D/g, '');

      if (digitsAfterDot.length === 0 && lastDot === cleaned.length - 1) {
        decimalIndex = lastDot;
        hasTrailingDecimal = true;
      } else if (digitsAfterDot.length <= 2) {
        decimalIndex = lastDot;
      }
    }

    let integerDigits = '';
    let decimalDigits = '';

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      if (!/\d/.test(char)) {
        continue;
      }

      if (decimalIndex !== -1 && i > decimalIndex) {
        decimalDigits += char;
      } else {
        integerDigits += char;
      }
    }

    decimalDigits = decimalDigits.slice(0, 2);
    integerDigits = integerDigits.replace(/^0+(?=\d)/, '');

    if (!integerDigits && !decimalDigits && !hasTrailingDecimal) {
      return '';
    }

    const normalizedInteger = integerDigits || '0';
    if (hasTrailingDecimal) {
      return `${normalizedInteger}.`;
    }
    return decimalDigits ? `${normalizedInteger}.${decimalDigits}` : normalizedInteger;
  };

  const formatAmountDisplay = (value: string) => {
    if (!value) {
      return '';
    }

    const hasTrailingDecimal = value.endsWith('.');
    const baseValue = hasTrailingDecimal ? value.slice(0, -1) : value;

    const [integerPartRaw = '', decimalPartRaw = ''] = baseValue.split('.');
    const integerPart = integerPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const decimalPart = hasTrailingDecimal
      ? ','
      : decimalPartRaw
        ? `,${decimalPartRaw}`
        : '';

    return `${integerPart}${decimalPart}`;
  };

  const formattedMontoEstimado = useMemo(
    () => formatAmountDisplay(formData.montoEstimado),
    [formData.montoEstimado],
  );

  const formattedMontoPagado = useMemo(
    () => formatAmountDisplay(formData.montoPagado),
    [formData.montoPagado],
  );

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
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 sm:py-12 overflow-y-auto"
          >
            <div className="w-full max-w-md">
              <div className="rounded-3xl bg-gradient-to-br from-[#E9E5DA] to-[#E9E5DA]/95 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden max-h-[calc(100vh-4rem)]">
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
                <form
                  onSubmit={handleSubmit}
                  className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-6rem)]"
                  style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
                >
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
                    type="text"
                    inputMode="decimal"
                    value={formattedMontoEstimado}
                    onChange={(e) => {
                      const normalized = normalizeAmountInput(e.target.value);
                      setFormData((prev) => ({ ...prev, montoEstimado: normalized }));
                    }}
                    placeholder="0,00"
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
                      type="text"
                      inputMode="decimal"
                      value={formattedMontoPagado}
                      onChange={(e) => {
                        const normalized = normalizeAmountInput(e.target.value);
                        setFormData((prev) => ({ ...prev, montoPagado: normalized }));
                      }}
                      placeholder="0,00"
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
                <div className="sticky bottom-0 pt-4 space-y-2">
                  {onDelete && item && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => onDelete(item)}
                      className="w-full py-3 rounded-2xl bg-white/70 text-[#C5453D] border border-white/60 shadow-sm text-sm font-semibold"
                    >
                      Eliminar {type === 'income' ? 'ingreso' : 'gasto'}
                    </motion.button>
                  )}
                  <div
                    className="rounded-3xl bg-gradient-to-t from-[#E9E5DA] via-[#E9E5DA]/95 to-transparent p-1"
                    style={{
                      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)',
                    }}
                  >
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
                  </div>
                </div>
              </form>
            </div>
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
