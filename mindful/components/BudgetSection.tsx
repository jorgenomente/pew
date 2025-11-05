import { motion } from 'framer-motion';
import { IncomeCard } from './IncomeCard';
import { MonthlyChart } from './MonthlyChart';
import { EvolutionChart } from './EvolutionChart';
import { CasitaBudget } from './CasitaBudget';
import { AddMovementModal } from './AddMovementModal';
import { AddCasitaItemModal } from './AddCasitaItemModal';
import { EditItemModal } from './EditItemModal';
import { AddVariableExpenseModal } from './AddVariableExpenseModal';
import { InlineEditableText } from './InlineEditableText';
import { MonthSelector } from './MonthSelector';
import { BudgetHistory } from './BudgetHistory';
import { FixedExpensesSection } from './FixedExpensesSection';
import { VariableExpensesSection } from './VariableExpensesSection';
import { Plus, Download, Waves, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CasitaItemFormData, MovementFormData, VariableExpenseFormData } from '../types';
import { DEFAULT_PERSONAS } from '../types';
import { useBudget, IncomeEntry, BudgetItem } from '../context/BudgetContext';

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
    addMovement,
    updateIncome,
    updateBudgetItem,
    removeIncome,
    removeBudgetItem,
    personaThemes,
    setPersonaTheme: assignPersonaTheme,
    getPersonaTotals,
    personas,
    renamePersona,
    resetBudget,
    expenses,
    variableExpenses,
    toggleExpensePaid,
    updateExpensePaymentDate,
    addVariableExpense,
    removeVariableExpense,
  } = useBudget();
  
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isCasitaModalOpen, setIsCasitaModalOpen] = useState(false);
  const [isVariableExpenseModalOpen, setIsVariableExpenseModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<IncomeEntry | BudgetItem | null>(null);
  const [editType, setEditType] = useState<'income' | 'casita'>('income');
  const [personaForModal, setPersonaForModal] = useState<string | null>(null);
  const [movementModalMode, setMovementModalMode] = useState<'income' | 'expense'>('income');

  const normalizePersona = (name?: string | null) =>
    name?.trim() || '';

  const personaGroups = useMemo(() => {
    const grouped = new Map<string, IncomeEntry[]>();

    incomes.forEach((income) => {
      const personaKey = normalizePersona(income.persona) || DEFAULT_PERSONAS[0];
      const current = grouped.get(personaKey) ?? [];
      current.push(income);
      grouped.set(personaKey, current);
    });

    return Array.from(grouped.entries())
      .map(([personaName, entries]) => {
        const sorted = [...entries].sort((a, b) => b.monto - a.monto);
        const total = sorted.reduce((acc, entry) => acc + entry.monto, 0);
        return {
          persona: personaName,
          entries: sorted,
          total,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [incomes]);

  const personasConIngresos = new Set(personaGroups.map((group) => group.persona));

  const personasSinIngresos = personas
    .map((persona) => persona.trim())
    .filter((persona) => persona && !personasConIngresos.has(persona));

  const openIncomeModal = (persona?: string) => {
    setMovementModalMode('income');
    setPersonaForModal(persona ?? null);
    setIsMovementModalOpen(true);
  };

  const openExpenseModal = () => {
    setMovementModalMode('expense');
    setPersonaForModal(null);
    setIsMovementModalOpen(true);
  };

  const openVariableExpenseModal = () => {
    setIsVariableExpenseModalOpen(true);
  };

  const handleAddMovement = (movement: MovementFormData) => {
    addMovement(movement);
  };

  const handleAddVariableExpense = (expense: VariableExpenseFormData) => {
    addVariableExpense(expense);
  };

  const handleRemoveVariableExpense = (id: string) => {
    removeVariableExpense(id);
  };

  const handleAddCasitaItem = (item: CasitaItemFormData) => {
    console.log('New casita item:', item);
  };

  const handleEditIncome = (income: IncomeEntry) => {
    setEditItem(income);
    setEditType('income');
  };

  const handleEditCasitaItem = (item: BudgetItem) => {
    setEditItem(item);
    setEditType('casita');
  };

  const handleUpdateItem = (updatedItem: IncomeEntry | (BudgetItem & { nota?: string })) => {
    if ('fuente' in updatedItem) {
      updateIncome(updatedItem.id, {
        fuente: updatedItem.fuente,
        monto: updatedItem.monto,
        fecha: updatedItem.fecha,
      });
    } else {
      updateBudgetItem(updatedItem);
    }

    setEditItem(null);
  };

  const handleRemoveItem = (item: IncomeEntry | (BudgetItem & { nota?: string })) => {
    if ('fuente' in item) {
      removeIncome(item.id);
    } else {
      removeBudgetItem(item.id);
    }
    setEditItem(null);
  };

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const handleExport = () => {
    console.log('Exporting budget summary...');
  };

  const handleResetBudget = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('¿Querés reiniciar el presupuesto y borrar todos los datos locales?');
      if (!confirmed) {
        return;
      }
    }
    resetBudget();
    setIsMovementModalOpen(false);
    setIsCasitaModalOpen(false);
    setEditItem(null);
    setPersonaForModal(null);
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
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetBudget}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-white/40 text-sm text-[#0F3C3B] shadow-sm"
                title="Reiniciar presupuesto"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar
              </motion.button>
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
                  onClick={() => openIncomeModal()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#7ED4C1] to-[#5FCFBA] text-white text-sm shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Agregar</span>
                </motion.button>
              </div>
              
              {personaGroups.length > 0 && (
                <div className="space-y-4">
                  {personaGroups.map((group, index) => {
                    const personaKey = normalizePersona(group.persona);
                    const personaHue = personaThemes[personaKey];
                    return (
                      <IncomeCard
                        key={group.persona}
                        persona={group.persona}
                        entries={group.entries}
                        index={index}
                        personaHue={personaHue}
                        onToggleRecibido={toggleRecibido}
                        onRenamePersona={renamePersona}
                        onUpdatePersonaColor={assignPersonaTheme}
                        onEdit={handleEditIncome}
                        onAddPersonaIncome={openIncomeModal}
                      />
                    );
                  })}
                </div>
              )}

              {personasSinIngresos.length > 0 && (
                <div className={`${incomes.length > 0 ? 'mt-6' : ''} space-y-4`}>
                  {personasSinIngresos.map((persona) => (
                    <motion.div
                      key={persona}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-3xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border border-white/30 p-6"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <InlineEditableText
                            value={persona}
                            onSave={(newName) => renamePersona(persona, newName)}
                            style={{ fontSize: '16px', fontWeight: 600 }}
                            type="neutral"
                            placeholder="Nombre de la persona"
                          />
                          <p className="text-xs opacity-60" style={{ color: '#597370' }}>
                            Configurá el ingreso mensual estimado
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openIncomeModal(persona)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#7ED4C1] to-[#5FCFBA] text-white text-xs shadow-md"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar
                        </motion.button>
                      </div>
                      <div className="flex items-center gap-3 text-xs opacity-60" style={{ color: '#597370' }}>
                        <Waves className="w-4 h-4 opacity-40" />
                        <span>Sin ingresos cargados para esta persona este mes.</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {incomes.length === 0 && personasSinIngresos.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm border border-white/30 p-8 text-center"
                >
                  <Waves className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm opacity-60">Empezá agregando un ingreso y definiendo la persona.</p>
                </motion.div>
              )}
            </motion.section>

            <FixedExpensesSection
              expenses={expenses}
              monthLabel={meses[selectedMonth]}
              onAdd={openExpenseModal}
              onEdit={handleEditCasitaItem}
              onTogglePaid={toggleExpensePaid}
              onUpdatePaymentDate={updateExpensePaymentDate}
            />

            <VariableExpensesSection
              expenses={variableExpenses}
              monthLabel={meses[selectedMonth]}
              onAdd={openVariableExpenseModal}
              onRemove={handleRemoveVariableExpense}
            />

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
              <MonthlyChart personaTotals={getPersonaTotals()} />
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
            &quot;El flujo visual se equilibra con tu mes — claridad, proporción y calma.&quot;
          </p>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <AddMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => {
          setIsMovementModalOpen(false);
          setPersonaForModal(null);
          setMovementModalMode('income');
        }}
        onAdd={handleAddMovement}
        defaultPersona={movementModalMode === 'income' ? personaForModal ?? undefined : undefined}
        defaultTipo={movementModalMode === 'expense' ? 'expense' : 'income'}
        incomeOnly={movementModalMode === 'income'}
        expenseOnly={movementModalMode === 'expense'}
      />
      <AddVariableExpenseModal
        isOpen={isVariableExpenseModalOpen}
        onClose={() => setIsVariableExpenseModalOpen(false)}
        onAdd={handleAddVariableExpense}
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
        onDelete={handleRemoveItem}
        item={editItem}
        type={editType}
      />
    </>
  );
}
