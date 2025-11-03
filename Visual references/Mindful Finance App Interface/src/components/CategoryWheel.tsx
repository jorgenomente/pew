import { motion } from 'motion/react';
import { ShoppingBag, Home, Utensils, Car, Heart, Sparkles } from 'lucide-react';

interface Category {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: any;
}

export function CategoryWheel() {
  const categories: Category[] = [
    { name: 'Compras', amount: 845, percentage: 28, color: '#7ED4C1', icon: ShoppingBag },
    { name: 'Hogar', amount: 1200, percentage: 40, color: '#C78C60', icon: Home },
    { name: 'Comida', amount: 450, percentage: 15, color: '#0F3C3B', icon: Utensils },
    { name: 'Transporte', amount: 320, percentage: 11, color: 'rgba(126, 212, 193, 0.6)', icon: Car },
    { name: 'Bienestar', amount: 185, percentage: 6, color: 'rgba(199, 140, 96, 0.6)', icon: Heart },
  ];

  return (
    <div className="space-y-4">
      {/* Organic circle visualization */}
      <div className="relative w-full aspect-square max-w-[280px] mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {categories.map((category, index) => {
            const prevTotal = categories.slice(0, index).reduce((sum, cat) => sum + cat.percentage, 0);
            const circumference = 2 * Math.PI * 70;
            const strokeDasharray = `${(category.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((prevTotal / 100) * circumference);
            
            return (
              <motion.circle
                key={category.name}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray }}
                transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke={category.color}
                strokeWidth="24"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                opacity="0.8"
              />
            );
          })}
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-60" />
            <div className="text-xs opacity-60">Total</div>
            <div className="text-2xl">$3,000</div>
          </motion.div>
        </div>
      </div>

      {/* Category list */}
      <div className="space-y-2">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-sm border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}40` }}
                >
                  <Icon className="w-4 h-4" style={{ color: category.color }} />
                </div>
                <div>
                  <div className="text-sm">{category.name}</div>
                  <div className="text-xs opacity-60">{category.percentage}%</div>
                </div>
              </div>
              <div className="text-sm">${category.amount.toLocaleString()}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
