import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Settings as SettingsIcon, Check } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { CURRENCY_OPTIONS, type CurrencyCode } from '../lib/currency';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_AMOUNT = 1234567.89;

const buildCurrencyPreview = (code: CurrencyCode) => {
  const option = CURRENCY_OPTIONS.find((item) => item.code === code) ?? CURRENCY_OPTIONS[0];
  const formatter = new Intl.NumberFormat(option.locale, {
    style: 'currency',
    currency: option.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: option.fractionDigits,
  });
  return formatter.format(SAMPLE_AMOUNT);
};

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const {
    currencyCode,
    currencyConfig,
    setCurrencyCode,
    formatCurrency,
  } = useBudget();

  const options = CURRENCY_OPTIONS;
  const currentPreview = useMemo(
    () => formatCurrency(SAMPLE_AMOUNT),
    [formatCurrency],
  );

  const handleSelect = (code: CurrencyCode) => {
    if (code === currencyCode) {
      return;
    }
    setCurrencyCode(code);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#0F3C3B]/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10 overflow-y-auto"
          >
            <div className="w-full max-w-md">
              <div className="rounded-3xl bg-gradient-to-br from-[#E9E5DA] to-[#E9E5DA]/95 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden">
                <div className="relative px-6 pt-6 pb-5 border-b border-[#0F3C3B]/10">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={onClose}
                    className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center"
                    aria-label="Cerrar configuración"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7ED4C1]/20 flex items-center justify-center">
                      <SettingsIcon className="w-5 h-5" style={{ color: '#0F3C3B' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Configuración</h3>
                      <p className="text-xs opacity-60">Elegí cómo querés ver tu moneda</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-5">
                  <div className="rounded-2xl border border-white/50 bg-white/60 backdrop-blur-sm p-4">
                    <p className="text-xs uppercase tracking-widest opacity-60" style={{ color: '#597370' }}>
                      Vista previa actual ({currencyConfig.code})
                    </p>
                    <p className="mt-1 text-lg font-semibold">{currentPreview}</p>
                  </div>

                  <div className="space-y-3">
                    {options.map((option) => {
                      const isActive = option.code === currencyCode;
                      const preview = buildCurrencyPreview(option.code);

                      return (
                        <motion.button
                          key={option.code}
                          type="button"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelect(option.code)}
                          className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                            isActive
                              ? 'border-[#7ED4C1] bg-[#7ED4C1]/15 shadow-sm'
                              : 'border-white/40 bg-white/50 hover:border-[#7ED4C1]/60'
                          }`}
                          aria-pressed={isActive}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold">{option.label}</div>
                              <div className="text-xs opacity-60" style={{ color: '#597370' }}>
                                {preview}
                              </div>
                            </div>
                            {isActive ? (
                              <div className="flex items-center gap-1 text-[#0F3C3B] text-xs font-semibold">
                                <Check className="w-4 h-4" />
                                Activa
                              </div>
                            ) : null}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl border border-white/50 bg-white/60 text-sm font-semibold text-[#0F3C3B]"
                    >
                      Cerrar
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
