import { motion, AnimatePresence } from 'motion/react';
import { FlowingBalanceChart } from './components/FlowingBalanceChart';
import { TransactionCard } from './components/TransactionCard';
import { CategoryWheel } from './components/CategoryWheel';
import { GoalRipple } from './components/GoalRipple';
import { BudgetSection } from './components/BudgetSection';
import { BottomNavigation } from './components/BottomNavigation';
import { AddGoalModal } from './components/AddGoalModal';
import { AddMovementModal } from './components/AddMovementModal';
import { FloatingActionButton } from './components/FloatingActionButton';
import { ResponsiveWrapper } from './components/ResponsiveWrapper';
import { BudgetProvider, useBudget } from './context/BudgetContext';
import { Bell, User, Plus } from 'lucide-react';
import { useState } from 'react';

const mockTransactions = [
  { id: '1', title: 'Salario mensual', category: 'Ingresos', amount: 4500, type: 'income' as const, date: '1 Nov' },
  { id: '2', title: 'Alquiler', category: 'Hogar', amount: -1200, type: 'expense' as const, date: '1 Nov' },
  { id: '3', title: 'Supermercado', category: 'Comida', amount: -145, type: 'expense' as const, date: '31 Oct' },
  { id: '4', title: 'Compra online', category: 'Compras', amount: -89, type: 'expense' as const, date: '30 Oct' },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const { getTotalIncome, getTotalExpenses } = useBudget();

  const handleAddGoal = (goal: any) => {
    console.log('New goal:', goal);
  };

  const handleAddMovement = (movement: any) => {
    console.log('New movement:', movement);
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-32 bg-gradient-to-br from-[#E9E5DA] via-[#E9E5DA] to-[#D5D9CE]">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-[#7ED4C1]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-[#C78C60]/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main content - max-width 1280px with 24px padding */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between pt-12 pb-6"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl tracking-tight mb-1"
            >
              ῥέω
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs opacity-60 italic"
            >
              finanzas que fluyen.
            </motion.p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/40 backdrop-blur-sm border border-white/30 flex items-center justify-center"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#7ED4C1]/40 to-[#C78C60]/40 backdrop-blur-sm border border-white/30 flex items-center justify-center"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </motion.header>

        {/* Content based on active tab with fade animation */}
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* 12-column responsive grid with 24px gaps */}
              <div className="grid grid-cols-12 gap-6 mb-10">
                {/* Balance visualization - 50% width on desktop, 220-240px height */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="col-span-12 lg:col-span-6"
                >
                  <div className="mb-4">
                    <h2 className="mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>Resumen</h2>
                    <span className="text-sm opacity-60" style={{ color: '#597370' }}>tu balance fluye</span>
                  </div>
                  <FlowingBalanceChart 
                    income={getTotalIncome() / 1000} 
                    expenses={getTotalExpenses() / 1000} 
                  />
                </motion.section>

                {/* Recent transactions - 50% width on desktop, 16px spacing */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="col-span-12 lg:col-span-6"
                >
                  <div className="mb-4">
                    <h2 className="mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>Movimientos</h2>
                    <span className="text-sm opacity-60" style={{ color: '#597370' }}>recientes</span>
                  </div>
                  <div className="space-y-4">
                    {mockTransactions.map((transaction, index) => (
                      <TransactionCard key={transaction.id} transaction={transaction} index={index} />
                    ))}
                  </div>
                </motion.section>
              </div>

              {/* Calm message - 40px breathing space */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-center py-10"
              >
                <p className="text-sm italic opacity-50">
                  "El dinero fluye con calma y propósito"
                </p>
                <p className="text-xs opacity-40 mt-2">
                  Organiza tu economía con serenidad
                </p>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <BudgetSection />
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-12 gap-4 md:gap-6 mb-8">
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="col-span-12 md:col-span-12 lg:col-span-8 lg:col-start-3"
                >
                  <div className="mb-3">
                    <h2 className="text-lg mb-0.5">Categorías</h2>
                    <span className="text-xs opacity-60" style={{ color: '#597370' }}>distribución</span>
                  </div>
                  <CategoryWheel />
                </motion.section>
              </div>
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-12 gap-4 md:gap-6 mb-8">
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-12"
                  >
                    <div className="mb-3 flex items-baseline justify-between">
                      <div>
                        <h2 className="text-lg mb-0.5">Metas</h2>
                        <span className="text-xs opacity-60" style={{ color: '#597370' }}>tus objetivos</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsGoalModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#C78C60] to-[#B57A50] text-white text-sm shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Nueva meta</span>
                      </motion.button>
                    </div>
                    <GoalRipple />
                  </motion.section>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Floating Action Button (Home screen only) */}
      {activeTab === 'home' && (
        <FloatingActionButton onClick={() => setIsMovementModalOpen(true)} />
      )}

      {/* Modals */}
      <AddGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onAdd={handleAddGoal}
      />
      <AddMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        onAdd={handleAddMovement}
      />
    </div>
  );
}

export default function App() {
  return (
    <BudgetProvider>
      <ResponsiveWrapper enablePreview={true}>
        <AppContent />
      </ResponsiveWrapper>
    </BudgetProvider>
  );
}
