import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, FileText, DollarSign, Tag } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MovementFormData, MovementType } from '../types';
import { useBudget } from '../context/BudgetContext';

interface AddMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (movement: MovementFormData) => void;
  defaultPersona?: string;
  defaultTipo?: MovementType;
  incomeOnly?: boolean;
  expenseOnly?: boolean;
}

export function AddMovementModal({
  isOpen,
  onClose,
  onAdd,
  defaultPersona,
  defaultTipo,
  incomeOnly = false,
  expenseOnly = false,
}: AddMovementModalProps) {
  const { personaOptions } = useBudget();
  const basePersonas = personaOptions;
  const personaPreset = defaultPersona?.trim();
  const personaSelectOptions = useMemo(() => {
    if (personaPreset && !basePersonas.includes(personaPreset)) {
      return [personaPreset, ...basePersonas];
    }
    return basePersonas;
  }, [basePersonas, personaPreset]);
  const resolvedPersona = personaPreset ?? '';

  const resolvedTipo = incomeOnly ? 'income' : expenseOnly ? 'expense' : (defaultTipo ?? 'income');

  const createInitialFormState = useCallback(
    (personaValue: string): Omit<MovementFormData, 'tipo'> => ({
      fecha: '',
      persona: expenseOnly ? 'General' : personaValue,
      categoria: '',
      descripcion: '',
      monto: '',
      recibido: false,
    }),
    [expenseOnly],
  );

  const [tipo, setTipo] = useState<MovementType>(resolvedTipo);
  const [formData, setFormData] = useState<Omit<MovementFormData, 'tipo'>>(
    () => createInitialFormState(resolvedPersona)
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const personaValue = defaultPersona?.trim() ?? '';
    const nextTipo = incomeOnly ? 'income' : expenseOnly ? 'expense' : (defaultTipo ?? 'income');
    const timeout = setTimeout(() => {
      setTipo(nextTipo);
      setFormData(createInitialFormState(expenseOnly ? 'General' : personaValue));
    }, 0);

    return () => clearTimeout(timeout);
  }, [isOpen, defaultPersona, defaultTipo, incomeOnly, expenseOnly, createInitialFormState]);

  const categorias = useMemo(
    () =>
      tipo === 'income'
        ? ['Salario', 'Freelance', 'Inversión', 'Otro']
        : ['Alquiler', 'Expensas', 'Suscripciones', 'Seguros', 'Comida', 'Transporte', 'Servicios', 'Otro'],
    [tipo],
  );

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

  const headerTitle = incomeOnly
    ? 'Registrar mis ingresos'
    : expenseOnly
      ? 'Registrar gasto fijo mensual'
      : 'Agregar movimiento';
  const headerSubtitle = incomeOnly
    ? 'Sumá un nuevo ingreso en tu presupuesto mensual'
    : expenseOnly
      ? 'Anotá un gasto que se repite cada mes'
      : 'Registrá un ingreso o gasto nuevo';
  const descripcionLabel = incomeOnly
    ? '¿Cómo querés nombrar este ingreso?'
    : expenseOnly
      ? '¿Cómo querés nombrar este gasto?'
      : 'Descripción';
  const descripcionPlaceholder = incomeOnly
    ? 'Ej: Sueldo empresa'
    : tipo === 'income'
      ? 'Ej: Bono anual'
      : 'Ej: Alquiler, Expensas...';
  const montoLabel = incomeOnly
    ? 'Monto a registrar'
    : expenseOnly
      ? 'Monto mensual estimado'
      : 'Monto (ARS)';
  const fechaLabel =
    incomeOnly || tipo === 'income'
      ? 'Lo recibo aproximadamente el'
      : 'Lo pago aproximadamente el';
  const submitLabel = incomeOnly
    ? 'Registrar ingreso'
    : expenseOnly
      ? 'Registrar gasto'
      : 'Agregar movimiento';
  const showTipoToggle = !incomeOnly && !expenseOnly;
  const showPersonaInput = !expenseOnly;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const descripcion = formData.descripcion.trim();
    const personaAfterSubmit = expenseOnly ? '' : formData.persona.trim();
    const finalTipo: MovementType = incomeOnly ? 'income' : expenseOnly ? 'expense' : tipo;
    const payload: MovementFormData = {
      ...formData,
      categoria: formData.categoria?.trim() || descripcion,
      descripcion,
      persona: expenseOnly ? 'General' : formData.persona,
      tipo: finalTipo,
    };
    onAdd(payload);
    onClose();
    setFormData(createInitialFormState(personaAfterSubmit || resolvedPersona));
  };

  const descriptionField = (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm opacity-70">
        <FileText className="w-4 h-4" />
        {descripcionLabel}
      </label>
      <motion.input
        whileFocus={{
          boxShadow: tipo === 'income'
            ? '0 0 0 3px rgba(126, 212, 193, 0.2)'
            : '0 0 0 3px rgba(199, 140, 96, 0.2)',
        }}
        type="text"
        value={formData.descripcion}
        onChange={(e) => {
          const value = e.target.value;
          setFormData((prev) => ({
            ...prev,
            descripcion: value,
            categoria: incomeOnly ? value : prev.categoria,
          }));
        }}
        placeholder={descripcionPlaceholder}
        className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none placeholder:opacity-40"
        required
      />
    </div>
  );

  const dateField = (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm opacity-70">
        <Calendar className="w-4 h-4" />
        {fechaLabel}
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
        required={incomeOnly || tipo === 'income'}
      />
    </div>
  );

  const categoryField = (
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
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </motion.select>
    </div>
  );

  const amountField = (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm opacity-70">
        <DollarSign className="w-4 h-4" />
        {montoLabel}
      </label>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`relative rounded-3xl border border-white/40 backdrop-blur-sm shadow-inner ${
          tipo === 'income'
            ? 'bg-gradient-to-r from-[#7ED4C1]/20 via-white/80 to-white/60'
            : 'bg-gradient-to-r from-[#C78C60]/20 via-white/80 to-white/60'
        }`}
      >
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#0F3C3B]/60">
          ARS
        </span>
        <motion.input
          whileFocus={{
            boxShadow: tipo === 'income'
              ? '0 0 0 4px rgba(126, 212, 193, 0.25)'
              : '0 0 0 4px rgba(199, 140, 96, 0.25)',
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
  );

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
              <div className="rounded-3xl bg-gradient-to-br from-[#E9E5DA] to-[#E9E5DA]/95 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden max-h-[calc(100vh-3rem)]">
              {/* Header */}
                <div className="relative p-6 pb-4 border-b border-[#0F3C3B]/10">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                  
                  <h3 className="mb-1">{headerTitle}</h3>
                  <p className="text-xs opacity-60">{headerSubtitle}</p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-6rem)]"
                  style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 120px)' }}
                >
                  {/* Tipo toggle */}
                  {showTipoToggle && (
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
                  )}

                  {/* Persona */}
                  {showPersonaInput && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm opacity-70">
                        <User className="w-4 h-4" />
                        Me llamo
                      </label>
                      <motion.input
                        whileFocus={{
                          boxShadow: tipo === 'income' 
                            ? '0 0 0 3px rgba(126, 212, 193, 0.2)'
                            : '0 0 0 3px rgba(199, 140, 96, 0.2)',
                        }}
                        value={formData.persona}
                        onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 transition-all outline-none"
                        placeholder="Ej: Jorge"
                        list="persona-options"
                        required={incomeOnly || tipo === 'income'}
                      />
                      {personaSelectOptions.length > 0 && (
                        <datalist id="persona-options">
                          {personaSelectOptions.map((option) => (
                            <option key={option} value={option} />
                          ))}
                        </datalist>
                      )}
                    </div>
                  )}

                  {expenseOnly ? (
                    <>
                      {descriptionField}
                      {dateField}
                      {amountField}
                    </>
                  ) : (
                    <>
                      {dateField}
                      {!incomeOnly && categoryField}
                      {descriptionField}
                      {amountField}
                    </>
                  )}

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
                          background: tipo === 'income'
                            ? 'linear-gradient(135deg, #7ED4C1, #5FCFBA)'
                            : 'linear-gradient(135deg, #C78C60, #B57A50)',
                        }}
                      >
                        {submitLabel}
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
