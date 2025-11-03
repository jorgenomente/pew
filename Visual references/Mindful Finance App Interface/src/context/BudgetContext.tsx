import { createContext, useContext, useState, ReactNode } from 'react';

export interface IncomeEntry {
  id: string;
  fecha: string;
  fuente: string;
  persona: 'Paola' | 'Jorge';
  monto: number;
  porcentaje: number;
  recibido: boolean;
}

export interface BudgetItem {
  id: string;
  concepto: string;
  montoEstimado: number;
  pagado: number;
  isPagado?: boolean;
  icon?: any;
}

interface BudgetContextType {
  selectedMonth: number;
  selectedYear: number;
  incomes: IncomeEntry[];
  expenses: BudgetItem[];
  budgetName: string;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  setBudgetName: (name: string) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getPaolaTotal: () => number;
  getJorgeTotal: () => number;
  toggleRecibido: (id: string) => void;
  updatePersonName: (id: string, newName: string) => void;
  updateExpenseName: (id: string, newName: string) => void;
  toggleExpensePaid: (id: string) => void;
  getMonthName: () => string;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [selectedMonth, setSelectedMonth] = useState(10); // November (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2025);
  const [budgetName, setBudgetName] = useState('Presupuesto Casita');
  
  // Mock data - in real app, this would be fetched based on selected month/year
  const [incomes, setIncomes] = useState<IncomeEntry[]>([
    {
      id: '1',
      fecha: '1 Nov',
      fuente: 'Salario mensual',
      persona: 'Paola',
      monto: 200000,
      porcentaje: 45,
      recibido: true,
    },
    {
      id: '2',
      fecha: '1 Nov',
      fuente: 'Salario mensual',
      persona: 'Jorge',
      monto: 240000,
      porcentaje: 55,
      recibido: true,
    },
  ]);

  const [expenses, setExpenses] = useState<BudgetItem[]>([
    { id: '1', concepto: 'Alquiler', montoEstimado: 150000, pagado: 150000, isPagado: true },
    { id: '2', concepto: 'Servicios', montoEstimado: 35000, pagado: 28000, isPagado: false },
    { id: '3', concepto: 'Internet', montoEstimado: 15000, pagado: 15000, isPagado: true },
    { id: '4', concepto: 'Agua', montoEstimado: 8000, pagado: 0, isPagado: false },
    { id: '5', concepto: 'Mantenimiento', montoEstimado: 20000, pagado: 12000, isPagado: false },
  ]);

  const getTotalIncome = () => {
    return incomes.reduce((sum, income) => sum + income.monto, 0);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.pagado, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getPaolaTotal = () => {
    return incomes
      .filter(i => i.persona === 'Paola')
      .reduce((sum, i) => sum + i.monto, 0);
  };

  const getJorgeTotal = () => {
    return incomes
      .filter(i => i.persona === 'Jorge')
      .reduce((sum, i) => sum + i.monto, 0);
  };

  const toggleRecibido = (id: string) => {
    setIncomes(prevIncomes =>
      prevIncomes.map(income =>
        income.id === id ? { ...income, recibido: !income.recibido } : income
      )
    );
  };

  const updatePersonName = (id: string, newName: string) => {
    setIncomes(prevIncomes =>
      prevIncomes.map(income =>
        income.id === id ? { ...income, persona: newName as 'Paola' | 'Jorge' } : income
      )
    );
  };

  const updateExpenseName = (id: string, newName: string) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === id ? { ...expense, concepto: newName } : expense
      )
    );
  };

  const toggleExpensePaid = (id: string) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense => {
        if (expense.id === id) {
          const newIsPagado = !expense.isPagado;
          return {
            ...expense,
            isPagado: newIsPagado,
            pagado: newIsPagado ? expense.montoEstimado : 0,
          };
        }
        return expense;
      })
    );
  };

  const getMonthName = () => {
    return meses[selectedMonth].toLowerCase();
  };

  return (
    <BudgetContext.Provider
      value={{
        selectedMonth,
        selectedYear,
        incomes,
        expenses,
        budgetName,
        setSelectedMonth,
        setSelectedYear,
        setBudgetName,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
        getPaolaTotal,
        getJorgeTotal,
        toggleRecibido,
        updatePersonName,
        updateExpenseName,
        toggleExpensePaid,
        getMonthName,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
