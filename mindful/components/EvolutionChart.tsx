import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface MonthData {
  mes: string;
  ingresos: number;
  gastos: number;
  balance: number;
}

export function EvolutionChart() {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const data: MonthData[] = [];
  const hasData = data.length > 0;
  const maxValue = hasData ? Math.max(...data.flatMap(d => [d.ingresos, d.gastos])) : 0;
  
  return (
    <div 
      className="rounded-3xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm border border-white/20 shadow-lg p-6"
      style={{ minHeight: '360px' }}
    >
      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="w-5 h-5 opacity-60" style={{ color: '#597370' }} />
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>Evolución mensual</div>
          <div className="text-xs opacity-60" style={{ color: '#597370' }}>Últimos 6 meses</div>
        </div>
      </div>
      
      {hasData ? (
        <>
          <div className="relative h-48 flex items-end justify-between gap-2 mb-6">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-full border-t opacity-10"
                  style={{ borderColor: '#0F3C3B' }}
                />
              ))}
            </div>

            {data.map((month, index) => {
              const ingresosHeight = (month.ingresos / maxValue) * 100;
              const gastosHeight = (month.gastos / maxValue) * 100;
              const isHovered = hoveredMonth === index;

              return (
                <div
                  key={month.mes}
                  className="relative flex-1 flex flex-col items-center gap-3"
                  onMouseEnter={() => setHoveredMonth(index)}
                  onMouseLeave={() => setHoveredMonth(null)}
                >
                  <div className="relative w-full flex gap-1.5 items-end h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: `${ingresosHeight}%`,
                        scale: isHovered ? [1, 1.05, 1] : 1,
                      }}
                      transition={{
                        height: { duration: 0.7, delay: index * 0.06, ease: 'easeOut' },
                        scale: { duration: 0.4, repeat: isHovered ? Infinity : 0, ease: 'easeInOut' },
                      }}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-[#7ED4C1]/80 to-[#7ED4C1]/40 cursor-pointer"
                      style={{ minWidth: '12px' }}
                    />

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: `${gastosHeight}%`,
                        scale: isHovered ? [1, 1.05, 1] : 1,
                      }}
                      transition={{
                        height: { duration: 0.7, delay: index * 0.06 + 0.03, ease: 'easeOut' },
                        scale: { duration: 0.4, repeat: isHovered ? Infinity : 0, ease: 'easeInOut' },
                      }}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-[#C78C60]/80 to-[#C78C60]/40 cursor-pointer"
                      style={{ minWidth: '12px' }}
                    />
                  </div>

                  <span className="text-xs opacity-60" style={{ color: '#597370', fontSize: '12px' }}>
                    {month.mes}
                  </span>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-12 left-1/2 -translate-x-1/2 z-10 w-40"
                      >
                        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl p-3">
                          <div className="text-xs mb-2 opacity-70" style={{ color: '#0F3C3B' }}>
                            {month.mes} 2025
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#7ED4C1]" />
                                <span>Ingresos</span>
                              </div>
                              <span style={{ fontWeight: 600, color: '#7ED4C1' }}>
                                ${(month.ingresos / 1000).toFixed(0)}k
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#C78C60]" />
                                <span>Gastos</span>
                              </div>
                              <span style={{ fontWeight: 600, color: '#C78C60' }}>
                                ${(month.gastos / 1000).toFixed(0)}k
                              </span>
                            </div>

                            <div className="pt-1.5 mt-1.5 border-t border-black/10">
                              <div className="flex items-center justify-between text-xs">
                                <span>Balance</span>
                                <span
                                  style={{
                                    fontWeight: 700,
                                    color: month.balance >= 0 ? '#7ED4C1' : '#C78C60',
                                  }}
                                >
                                  ${(month.balance / 1000).toFixed(0)}k
                                </span>
                              </div>
                            </div>
                          </div>

                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 -mt-px"
                            style={{
                              width: 0,
                              height: 0,
                              borderLeft: '6px solid transparent',
                              borderRight: '6px solid transparent',
                              borderTop: '6px solid rgba(255, 255, 255, 0.95)',
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-xs mb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#7ED4C1]/80 to-[#7ED4C1]/40" />
                  <span className="opacity-60">Ingresos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#C78C60]/80 to-[#C78C60]/40" />
                  <span className="opacity-60">Gastos</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm opacity-60" style={{ color: '#597370' }}>
                Promedio combinado
              </span>
              <span style={{ fontSize: '18px', fontWeight: 600 }}>
                ${Math.round(data.reduce((sum, d) => sum + d.ingresos + d.gastos, 0) / data.length / 1000)}k
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-center gap-3 opacity-70">
          <span>Todavía no hay datos históricos.</span>
          <span className="text-xs opacity-50">
            Registrá movimientos para empezar a ver tendencias.
          </span>
        </div>
      )}
    </div>
  );
}
