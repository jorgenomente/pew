import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  index: number;
}

export function TransactionCard({ transaction, index }: TransactionCardProps) {
  const isIncome = transaction.type === 'income';
  const color = isIncome ? '#7ED4C1' : '#C78C60';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="rounded-3xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/30 shadow-md p-6 cursor-pointer"
      style={{ minHeight: '88px' }} // 11 * 8 = 88px
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title with fade ellipsis */}
          <div className="relative mb-2">
            <h3 
              className="truncate pr-4"
              style={{ 
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '1.4'
              }}
            >
              {transaction.title}
            </h3>
            <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-white/60 to-transparent pointer-events-none" />
          </div>
          
          <div className="flex items-center gap-3">
            <span 
              className="text-sm opacity-60" 
              style={{ 
                color: '#597370',
                fontSize: '14px'
              }}
            >
              {transaction.category}
            </span>
            <span 
              className="text-xs opacity-50"
              style={{ fontSize: '12px' }}
            >
              {transaction.date}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.08 + 0.2 }}
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: color,
              letterSpacing: '-0.01em'
            }}
          >
            {isIncome ? '+' : ''}{transaction.amount < 0 ? transaction.amount : `$${transaction.amount}`}
          </motion.div>
          
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
            isIncome ? 'bg-[#7ED4C1]/20' : 'bg-[#C78C60]/20'
          }`}>
            {isIncome ? (
              <TrendingUp className="w-3 h-3" style={{ color }} />
            ) : (
              <TrendingDown className="w-3 h-3" style={{ color }} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
