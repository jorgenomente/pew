import { motion } from 'motion/react';
import { User, CheckCircle2, Circle, Edit2 } from 'lucide-react';
import { InlineEditableText } from './InlineEditableText';

interface IncomeEntry {
  id: string;
  fecha: string;
  fuente: string;
  persona: 'Paola' | 'Jorge';
  monto: number;
  porcentaje: number;
  recibido: boolean;
}

interface IncomeCardProps {
  income: IncomeEntry;
  index: number;
  onToggleRecibido: (id: string) => void;
  onUpdatePersonName?: (id: string, newName: string) => void;
  onEdit?: (income: IncomeEntry) => void;
}

export function IncomeCard({ income, index, onToggleRecibido, onUpdatePersonName, onEdit }: IncomeCardProps) {
  const personaColor = income.persona === 'Paola' ? '#C78C60' : '#7ED4C1';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/30 shadow-lg p-6"
      style={{ minHeight: '120px' }}
    >
      {/* Edit button */}
      {onEdit && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(income)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
        >
          <Edit2 className="w-4 h-4" />
        </motion.button>
      )}

      <div className="flex items-start justify-between gap-4 pr-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${personaColor}30` }}
            >
              <User className="w-5 h-5" style={{ color: personaColor }} />
            </div>
            <div>
              {onUpdatePersonName ? (
                <InlineEditableText
                  value={income.persona}
                  onSave={(newName) => onUpdatePersonName(income.id, newName)}
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: personaColor 
                  }}
                  type={income.persona === 'Paola' ? 'expense' : 'income'}
                  placeholder="Nombre"
                />
              ) : (
                <div style={{ fontSize: '16px', fontWeight: 600, color: personaColor }}>
                  {income.persona}
                </div>
              )}
              <div className="text-xs opacity-60" style={{ color: '#597370' }}>{income.fecha}</div>
            </div>
          </div>
          
          <div className="mb-3" style={{ fontSize: '16px' }}>{income.fuente}</div>
          
          <div className="flex items-baseline gap-3">
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#7ED4C1', letterSpacing: '-0.01em' }}>
              ${income.monto.toLocaleString()}
            </div>
            <span className="text-xs opacity-60" style={{ color: '#597370' }}>
              {income.porcentaje}% del total
            </span>
          </div>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleRecibido(income.id)}
          className="flex flex-col items-center gap-1.5 pt-1"
        >
          {income.recibido ? (
            <CheckCircle2 className="w-7 h-7" style={{ color: '#7ED4C1' }} />
          ) : (
            <Circle className="w-7 h-7 opacity-30" />
          )}
          <span className="text-xs opacity-60" style={{ fontSize: '11px' }}>
            {income.recibido ? 'Recibido' : 'Pendiente'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
