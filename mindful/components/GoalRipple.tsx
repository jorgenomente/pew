import { motion } from 'framer-motion';
import type { IconComponent } from '../types';
import { useBudget } from '../context/BudgetContext';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  icon: IconComponent;
}

export function GoalRipple() {
  const { formatCurrency } = useBudget();
  const goals: Goal[] = [];

  return (
    <div className="space-y-4">
      {goals.length === 0 ? (
        <div className="rounded-2xl bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-md border border-white/30 p-6 text-center text-sm opacity-70">
          Aún no creaste metas. Sumá tu primera meta para verla crecer acá.
        </div>
      ) : (
        goals.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100;
          const Icon = goal.icon;
          
          return (
            <motion.div
            key={goal.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-md border border-white/30 p-5"
          >
            {/* Ripple effect background */}
            <motion.div
              className="absolute inset-0 rounded-full bg-[#7ED4C1]/10"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{
                scale: [0, 2, 3],
                opacity: [0.8, 0.3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
                delay: index * 0.5,
              }}
              style={{
                transformOrigin: 'center',
              }}
            />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7ED4C1]/20 flex items-center justify-center">
                    <Icon className="w-5 h-5" style={{ color: '#0F3C3B' }} />
                  </div>
                  <div>
                    <div>{goal.name}</div>
                    <div className="text-xs opacity-60">
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                    </div>
                  </div>
                </div>
                <div className="text-sm opacity-70">{Math.round(progress)}%</div>
              </div>
              
              {/* Progress wave */}
              <div className="relative h-2 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
                >
                  <motion.div
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-full w-full bg-gradient-to-r from-transparent via-[#7ED4C1] to-transparent"
                    style={{ width: '200%' }}
                  />
                </motion.div>
              </div>
            </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
