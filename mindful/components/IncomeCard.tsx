import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle2, Circle, Edit2, Plus, Check } from 'lucide-react';
import type { IncomeEntry } from '../context/BudgetContext';
import { useBudget } from '../context/BudgetContext';
import { DEFAULT_PERSONAS, type Persona } from '../types';

interface IncomeCardProps {
  persona: Persona;
  entries: IncomeEntry[];
  index: number;
  onToggleRecibido: (id: string) => void;
  onRenamePersona?: (oldName: string, newName: string) => void;
  onUpdatePersonaColor?: (persona: Persona, hue: number) => void;
  onEdit?: (income: IncomeEntry) => void;
  onAddPersonaIncome?: (persona: Persona) => void;
  personaHue?: number;
}

const COLOR_CHOICES = [210, 20, 150, 310, 115, 45];

const normalizeHue = (value: number) => {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};

const getPersonaColors = (hueValue: number) => {
  const hue = normalizeHue(hueValue);
  const primary = `hsl(${hue}, 70%, 56%)`;
  const soft = `hsla(${hue}, 68%, 18%, 0.55)`;
  const chip = `linear-gradient(135deg, hsla(${hue}, 75%, 21%, 0.96), hsla(${(hue + 18) % 360}, 68%, 26%, 0.96))`;
  const secondary = `hsl(${hue}, 20%, 32%)`;
  const chipText = 'hsla(0, 0%, 98%, 0.95)';
  return { primary, soft, chip, secondary, chipText, hue };
};

export function IncomeCard({
  persona,
  entries,
  index,
  onToggleRecibido,
  onRenamePersona,
  onUpdatePersonaColor,
  onEdit,
  onAddPersonaIncome,
  personaHue,
}: IncomeCardProps) {
  const { formatCurrency } = useBudget();
  const personaLabel = persona?.trim() || DEFAULT_PERSONAS[0];
  const normalizedBaseHue = normalizeHue(
    personaHue ?? (26 + index * 28),
  );
  const [isEditingPersona, setIsEditingPersona] = useState(false);
  const [draftName, setDraftName] = useState(personaLabel);
  const [draftHue, setDraftHue] = useState<number>(normalizedBaseHue);

  const availableHues = useMemo(
    () => Array.from(new Set([normalizedBaseHue, ...COLOR_CHOICES].map(normalizeHue))),
    [normalizedBaseHue],
  );

  const displayHue = isEditingPersona ? draftHue : normalizedBaseHue;
  const personaColors = useMemo(() => getPersonaColors(displayHue), [displayHue]);
  const { primary, soft, chip, secondary, chipText } = personaColors;
  const draftColors = useMemo(() => getPersonaColors(draftHue), [draftHue]);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.monto - a.monto),
    [entries],
  );
  const totalAmount = useMemo(
    () => sortedEntries.reduce((sum, entry) => sum + entry.monto, 0),
    [sortedEntries],
  );
  const totalRecibido = useMemo(
    () => sortedEntries.reduce((sum, entry) => sum + (entry.recibido ? entry.monto : 0), 0),
    [sortedEntries],
  );

  const canAddPersonaIncome = Boolean(onAddPersonaIncome);
  const showPersonaEditor = Boolean(onRenamePersona) || Boolean(onUpdatePersonaColor);

  const handleOpenPersonaSettings = () => {
    setDraftName(personaLabel);
    setDraftHue(normalizedBaseHue);
    setIsEditingPersona(true);
  };

  const handlePersonaCancel = () => {
    setDraftName(personaLabel);
    setDraftHue(normalizedBaseHue);
    setIsEditingPersona(false);
  };

  const handlePersonaSave = () => {
    const trimmed = draftName.trim();
    const canRename = Boolean(onRenamePersona) && trimmed && trimmed !== personaLabel;
    const targetName = canRename && trimmed ? trimmed : personaLabel;

    if (canRename && trimmed && onRenamePersona) {
      onRenamePersona(personaLabel, trimmed);
    }

    if (onUpdatePersonaColor) {
      onUpdatePersonaColor(targetName, draftHue);
    }

    setIsEditingPersona(false);
  };

  const personaSummaryLabel =
    sortedEntries.length === 1 ? 'ingreso registrado' : 'ingresos registrados';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/30 shadow-lg p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shadow-inner"
            style={{ backgroundColor: soft }}
          >
            <User className="w-5 h-5" style={{ color: primary }} />
          </div>
          <div className="flex-1 min-w-0">
            {isEditingPersona ? (
              <div className="flex flex-col gap-3">
                <motion.input
                  whileFocus={{ boxShadow: '0 0 0 3px rgba(15, 60, 59, 0.12)' }}
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  placeholder="Nombre de la persona"
                  className="w-full px-3 py-2 rounded-xl border border-white/50 bg-white/70 backdrop-blur-sm text-sm outline-none"
                  style={{ color: draftColors.primary }}
                />
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium" style={{ color: '#597370' }}>
                    Elegí un color
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableHues.map((hue) => {
                      const normalizedHue = normalizeHue(hue);
                      const selected = normalizeHue(draftHue) === normalizedHue;
                      const swatchPrimary = `hsl(${normalizedHue}, 70%, 58%)`;
                      const swatchSecondary = `hsl(${(normalizedHue + 16) % 360}, 65%, 52%)`;
                      return (
                        <button
                          key={normalizedHue}
                          type="button"
                          onClick={() => setDraftHue(normalizedHue)}
                          className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform"
                          style={{
                            background: `linear-gradient(135deg, ${swatchPrimary}, ${swatchSecondary})`,
                            borderColor: selected ? '#0F3C3B' : 'transparent',
                          }}
                          aria-pressed={selected}
                        >
                          {selected && <Check className="w-3.5 h-3.5 text-[#0F3C3B]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handlePersonaSave}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${draftColors.primary}, hsl(${normalizeHue(
                        draftHue + 18,
                      )}, 58%, 50%))`,
                    }}
                  >
                    Guardar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handlePersonaCancel}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/70 border border-white/60 text-[#0F3C3B]"
                  >
                    Cancelar
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <div style={{ fontSize: '16px', fontWeight: 600, color: primary }}>
                  {personaLabel}
                </div>
                {showPersonaEditor && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleOpenPersonaSettings}
                    className="mt-0.5 rounded-full bg-white/70 border border-white/60 p-1 shadow-sm text-[#0F3C3B]/70"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </div>
            )}
            <div
              className="text-xs opacity-60 mt-1 truncate"
              style={{ color: '#597370' }}
              title={`${sortedEntries.length} ${personaSummaryLabel}`}
            >
              {sortedEntries.length} {personaSummaryLabel}
            </div>
          </div>
        </div>

        {canAddPersonaIncome && (
          <motion.button
            whileHover={!isEditingPersona ? { scale: 1.05 } : undefined}
            whileTap={!isEditingPersona ? { scale: 0.95 } : undefined}
            onClick={() => {
              if (isEditingPersona) {
                return;
              }
              onAddPersonaIncome?.(personaLabel);
            }}
            disabled={isEditingPersona}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/55 backdrop-blur-sm border border-white/40 text-xs text-[#0F3C3B]/80 shadow-sm transition-opacity ${
              isEditingPersona ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar ingreso</span>
          </motion.button>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/40 bg-white/50 px-4 py-3">
        <div>
          <div
            className="text-lg font-semibold"
            style={{ color: primary, letterSpacing: '-0.01em' }}
          >
            {formatCurrency(totalAmount)}
          </div>
          <span className="text-xs opacity-60" style={{ color: '#597370' }}>
            Total mensual estimado
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold" style={{ color: secondary }}>
            Recibido: {formatCurrency(totalRecibido)}
          </div>
          <div className="text-[11px] opacity-60" style={{ color: '#597370' }}>
            {totalAmount === 0
              ? '0% acreditado'
              : `${Math.round((totalRecibido / totalAmount) * 100)}% acreditado`}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {sortedEntries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-4 rounded-2xl border border-white/40 px-4 py-3 shadow-sm"
            style={{ background: chip }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold truncate" style={{ color: chipText }}>
                  {entry.fuente || 'Ingreso'}
                </span>
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onEdit(entry)}
                    className="rounded-full bg-white/70 border border-white/60 p-1 shadow-sm text-[#0F3C3B]/70"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </div>
              <div className="text-xs" style={{ color: chipText, opacity: 0.78 }}>
                {entry.fecha}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-semibold" style={{ color: primary }}>
                  {formatCurrency(entry.monto)}
                </div>
                <span className="text-[11px]" style={{ color: chipText, opacity: 0.72 }}>
                  {entry.porcentaje.toLocaleString(undefined, {
                    maximumFractionDigits: 1,
                  })}
                  % del total
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleRecibido(entry.id)}
                className="flex flex-col items-center gap-1"
              >
                {entry.recibido ? (
                  <CheckCircle2 className="w-6 h-6" style={{ color: primary }} />
                ) : (
                  <Circle className="w-6 h-6 opacity-40" />
                )}
                <span className="text-[10px]" style={{ color: chipText, opacity: 0.75 }}>
                  {entry.recibido ? 'Recibido' : 'Pendiente'}
                </span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
