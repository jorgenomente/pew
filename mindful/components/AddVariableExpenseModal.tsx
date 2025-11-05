import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, DollarSign, FileText, StickyNote, Tag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { VariableExpenseFormData } from '../types';
import { useBudget } from '../context/BudgetContext';

const EXPENSE_CATEGORY_SUGGESTIONS = [
  'Regalos',
  'Experiencias',
  'Ropa',
  'Hogar',
  'Tecnología',
  'Transporte',
  'Salud',
  'Educación',
  'Mascotas',
  'Suscripciones',
  'Otro',
] as const;

interface AddVariableExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: VariableExpenseFormData) => void;
}

const createInitialState = (): VariableExpenseFormData => ({
  concepto: '',
  categoria: '',
  fecha: '',
  monto: '',
  nota: '',
});

export function AddVariableExpenseModal({ isOpen, onClose, onAdd }: AddVariableExpenseModalProps) {
  const { expenseCategories, registerExpenseCategory } = useBudget();
  const [formData, setFormData] = useState<VariableExpenseFormData>(createInitialState);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryValue, setNewCategoryValue] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const timeout = setTimeout(() => {
      setFormData(createInitialState());
      setIsAddingCategory(false);
      setNewCategoryValue('');
    }, 0);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  const sortedExpenseCategories = useMemo(
    () =>
      [...expenseCategories].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })),
    [expenseCategories],
  );
  const hasExpenseCategories = sortedExpenseCategories.length > 0;
  const availableExpenseSuggestions = useMemo(
    () =>
      EXPENSE_CATEGORY_SUGGESTIONS.filter(
        (suggestion) =>
          !expenseCategories.some(
            (existing) => existing.toLowerCase() === suggestion.toLowerCase(),
          ),
      ),
    [expenseCategories],
  );
  const showNewCategoryInput = !hasExpenseCategories || isAddingCategory;

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

  const formattedMonto = useMemo(
    () => formatAmountDisplay(formData.monto),
    [formData.monto],
  );

  const commitExpenseCategory = (rawValue: string) => {
    const nextValue = rawValue.trim();
    if (!nextValue) {
      return '';
    }
    registerExpenseCategory(nextValue);
    setFormData((prev) => ({
      ...prev,
      categoria: nextValue,
    }));
    setIsAddingCategory(false);
    setNewCategoryValue('');
    return nextValue;
  };

  const handleSuggestionClick = (suggestion: string) => {
    commitExpenseCategory(suggestion);
  };

  const handleCategorySelect = (value: string) => {
    if (value === '__create__') {
      setIsAddingCategory(true);
      setFormData((prev) => ({ ...prev, categoria: '' }));
      return;
    }
    setIsAddingCategory(false);
    setNewCategoryValue('');
    setFormData((prev) => ({ ...prev, categoria: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let categoriaSeleccionada = formData.categoria?.trim() ?? '';
    if (showNewCategoryInput && newCategoryValue.trim()) {
      categoriaSeleccionada = commitExpenseCategory(newCategoryValue) || categoriaSeleccionada;
    }

    const payload: VariableExpenseFormData = {
      concepto: formData.concepto.trim(),
      categoria: categoriaSeleccionada,
      fecha: formData.fecha,
      monto: formData.monto,
      nota: formData.nota.trim(),
    };

    onAdd(payload);
    onClose();
    setFormData(createInitialState());
    setIsAddingCategory(false);
    setNewCategoryValue('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0F3C3B]/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 sm:py-12 overflow-y-auto"
          >
            <div className="w-full max-w-md">
              <div className="rounded-3xl bg-gradient-to-br from-[#E9E5DA] to-[#E9E5DA]/95 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden max-h-[calc(100vh-3rem)]">
                <div className="relative p-6 pb-4 border-b border-[#0F3C3B]/10">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                  <h3 className="mb-1">Agregar gasto variable</h3>
                  <p className="text-xs opacity-60">
                    Guardá los gastos excepcionales que querés realizar este mes.
                  </p>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-6rem)]"
                  style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 120px)' }}
                >
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm opacity-70">
                      <FileText className="w-4 h-4" />
                      ¿Cómo querés nombrar este gasto?
                    </label>
                    <motion.input
                      whileFocus={{
                        boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                      }}
                      type="text"
                      value={formData.concepto}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, concepto: e.target.value }))
                      }
                      placeholder="Ej: Regalo cumpleaños, Festival de música..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none placeholder:opacity-40"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm opacity-70">
                      <Tag className="w-4 h-4" />
                      Categoría
                    </label>
                    {hasExpenseCategories && !showNewCategoryInput && (
                      <motion.select
                        whileFocus={{
                          boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                        }}
                        value={formData.categoria}
                        onChange={(e) => handleCategorySelect(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none"
                      >
                        <option value="">Seleccioná una categoría</option>
                        {sortedExpenseCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="__create__">Crear categoría nueva</option>
                      </motion.select>
                    )}

                    {showNewCategoryInput && (
                      <div className="space-y-2">
                        {hasExpenseCategories && (
                          <p className="text-xs opacity-60" style={{ color: '#597370' }}>
                            Creá una nueva categoría para este gasto puntual.
                          </p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-2">
                          <motion.input
                            whileFocus={{
                              boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                            }}
                            type="text"
                            value={newCategoryValue}
                            onChange={(e) => setNewCategoryValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newCategoryValue.trim()) {
                                  commitExpenseCategory(newCategoryValue);
                                }
                              }
                            }}
                            placeholder="Ej: Festival, Regalo..."
                            className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none placeholder:opacity-40"
                          />
                          <div className="flex gap-2">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                if (newCategoryValue.trim()) {
                                  commitExpenseCategory(newCategoryValue);
                                }
                              }}
                              disabled={!newCategoryValue.trim()}
                              className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{
                                background: 'linear-gradient(135deg, #C78C60, #B57A50)',
                              }}
                            >
                              Guardar
                            </motion.button>
                            {hasExpenseCategories && (
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                  setIsAddingCategory(false);
                                  setNewCategoryValue('');
                                }}
                                className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/40 bg-white/50 text-[#C78C60]"
                              >
                                Cancelar
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {availableExpenseSuggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {availableExpenseSuggestions.map((suggestion) => (
                              <motion.button
                                key={suggestion}
                                type="button"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/60 border border-white/40 text-[#C78C60]"
                              >
                                {suggestion}
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {!hasExpenseCategories && (
                      <p className="text-xs opacity-60" style={{ color: '#597370' }}>
                        Todavía no cargaste categorías. Creá una para tus gastos variables.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm opacity-70">
                      <Calendar className="w-4 h-4" />
                      ¿Cuándo ocurre?
                    </label>
                    <motion.input
                      whileFocus={{
                        boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                      }}
                      type="date"
                      value={formData.fecha}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, fecha: e.target.value }))
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm opacity-70">
                      <DollarSign className="w-4 h-4" />
                      Monto estimado
                    </label>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="relative rounded-3xl border border-white/40 backdrop-blur-sm shadow-inner bg-gradient-to-r from-[#C78C60]/20 via-white/80 to-white/60"
                    >
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#0F3C3B]/60">
                        ARS
                      </span>
                      <motion.input
                        whileFocus={{
                          boxShadow: '0 0 0 4px rgba(199, 140, 96, 0.25)',
                        }}
                        type="text"
                        inputMode="decimal"
                        value={formattedMonto}
                        onChange={(e) => {
                          const normalized = normalizeAmountInput(e.target.value);
                          setFormData((prev) => ({ ...prev, monto: normalized }));
                        }}
                        placeholder="0,00"
                        className="w-full bg-transparent pl-20 pr-6 py-5 text-3xl font-semibold tracking-tight text-[#0F3C3B] placeholder:opacity-30 outline-none"
                        required
                      />
                    </motion.div>
                    <p className="text-xs opacity-60 mt-2" style={{ color: '#597370' }}>
                      Podés usar punto o coma para los decimales.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm opacity-70">
                      <StickyNote className="w-4 h-4" />
                      Nota
                    </label>
                    <motion.textarea
                      whileFocus={{
                        boxShadow: '0 0 0 3px rgba(199, 140, 96, 0.2)',
                      }}
                      value={formData.nota}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nota: e.target.value }))}
                      rows={3}
                      placeholder="Agregá un detalle para recordarlo más adelante (opcional)"
                      className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none placeholder:opacity-40 resize-none"
                    />
                  </div>

                  <div
                    className="sticky pt-6"
                    style={{
                      bottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
                      marginTop: 'calc(env(safe-area-inset-bottom, 0px) / 2)',
                    }}
                  >
                    <div className="rounded-3xl bg-gradient-to-t from-[#E9E5DA] via-[#E9E5DA]/95 to-transparent p-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3 rounded-2xl text-white shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #C78C60, #B57A50)',
                        }}
                      >
                        Registrar gasto variable
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

