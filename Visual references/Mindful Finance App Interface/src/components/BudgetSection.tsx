import { motion } from 'motion/react';
import { IncomeCard } from './IncomeCard';
import { MonthlyChart } from './MonthlyChart';
import { EvolutionChart } from './EvolutionChart';
import { CasitaBudget } from './CasitaBudget';
import { AddMovementModal } from './AddMovementModal';
import { AddCasitaItemModal } from './AddCasitaItemModal';
import { EditItemModal } from './EditItemModal';
import { MonthSelector } from './MonthSelector';
import { BudgetHistory } from './BudgetHistory';
import { Plus, Download, Waves } from 'lucide-react';
import { useState } from 'react';
import { useBudget, IncomeEntry } from '../context/BudgetContext';

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function BudgetSection() {
  const { 
    selectedMonth, 
    selectedYear, 
    setSelectedMonth, 
    setSelectedYear, 
    incomes,
    toggleRecibido,
    updatePersonName,
    getPaolaTotal,
    getJorgeTotal,
  } = useBudget();
  
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isCasitaModalOpen, setIsCasitaModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editType, setEditType] = useState<'income' | 'casita'>('income');

  const handleAddMovement = (movement: any) => {
    console.log('New movement:', movement);
  };

  const handleAddCasitaItem = (item: any) => {
    console.log('New casita item:', item);
  };

  const handleEditIncome = (income: IncomeEntry) => {
    setEditItem(income);
    setEditType('income');
  };

  const handleEditCasitaItem = (item: any) => {
    setEditItem(item);
    setEditType('casita');
  };

  const handleUpdateItem = (updatedItem: any) => {
    console.log('Updated item:', updatedItem);
    setEditItem(null);
  };

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const handleExport = () => {
    console.log('Exporting budget summary...');
  };

  return (
    <>
      <motion.div
        key={`${selectedMonth}-${selectedYear}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="pb-6"
      >
        {/* Header with month selector and export button on same row */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>Presupuesto mensual</h2>
              <p className="text-sm opacity-60" style={{ color: '#597370' }}>Visualizá tus ingresos y gastos</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#C78C60] to-[#B57A50] text-white text-sm shadow-lg"
              title="Exportar presupuesto mensual"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Descargar</span>
            </motion.button>
          </div>

          {/* Month Selector */}
          <MonthSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={handleMonthChange}
          />
        </motion.div>

        {/* Two-column layout with 24px gaps and 40px vertical spacing */}
        <div className="grid grid-cols-12 gap-6 mb-10">
          {/* LEFT COLUMN - Ingresos + Resumen */}
          <div className="col-span-12 lg:col-span-6 space-y-10">
            {/* Ingresos del mes */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>Ingresos del mes</h3>
                  <span className="text-sm opacity-60" style={{ color: '#597370' }}>
                    {meses[selectedMonth].toLowerCase()}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMovementModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#7ED4C1] to-[#5FCFBA] text-white text-sm shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Agregar</span>
                </motion.button>
              </div>
              
              {incomes.length > 0 ? (
                <div className="space-y-4">
                  {incomes.map((income, index) => (
                    <IncomeCard
                      key={income.id}
                      income={income}
                      index={index}
                      onToggleRecibido={toggleRecibido}
                      onUpdatePersonName={updatePersonName}
                      onEdit={handleEditIncome}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm border border-white/30 p-8 text-center"
                >
                  <Waves className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm opacity-60">Sin ingresos este mes</p>
                </motion.div>
              )}
            </motion.section>

            {/* Resumen mensual */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="mb-4">
                <h3 className="mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>Resumen mensual</h3>
                <span className="text-sm opacity-60" style={{ color: '#597370' }}>distribución</span>
              </div>
              <MonthlyChart paolaTotal={getPaolaTotal()} jorgeTotal={getJorgeTotal()} />
            </motion.section>
          </div>

          {/* RIGHT COLUMN - Evolución + Casita */}
          <div className="col-span-12 lg:col-span-6 space-y-10">
            {/* Evolución */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <div className="mb-4">
                <h3 className="mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>Evolución</h3>
                <span className="text-sm opacity-60" style={{ color: '#597370' }}>tendencia</span>
              </div>
              <EvolutionChart />
            </motion.section>

            {/* Presupuesto Casita */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>Presupuesto Casita</h3>
                  <span className="text-sm opacity-60" style={{ color: '#597370' }}>gastos del hogar</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCasitaModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#C78C60] to-[#B57A50] text-white text-sm shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Agregar</span>
                </motion.button>
              </div>
              <CasitaBudget onEdit={handleEditCasitaItem} />
            </motion.section>
          </div>
        </div>

        {/* Budget History - with divider */}
        <div className="relative pt-10 mt-10 border-t border-white/20">
          <BudgetHistory onMonthSelect={handleMonthChange} />
        </div>

        {/* Footer message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-right pt-10"
        >
          <p className="text-sm italic opacity-50">
            "El flujo visual se equilibra con tu mes — claridad, proporción y calma."
          </p>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <AddMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        onAdd={handleAddMovement}
      />
      <AddCasitaItemModal
        isOpen={isCasitaModalOpen}
        onClose={() => setIsCasitaModalOpen(false)}
        onAdd={handleAddCasitaItem}
      />
      <EditItemModal
        isOpen={editItem !== null}
        onClose={() => setEditItem(null)}
        onUpdate={handleUpdateItem}
        item={editItem}
        type={editType}
      />
    </>
  );
}
