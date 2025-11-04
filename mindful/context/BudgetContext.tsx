"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { IconComponent, MovementFormData, Persona } from '../types';
import { DEFAULT_PERSONAS } from '../types';

const DEFAULT_PERSONA_HUES = [210, 20, 150, 310, 115, 45];

export interface IncomeEntry {
  id: string;
  fecha: string;
  fuente: string;
  persona: Persona;
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
  icon?: IconComponent;
  categoria?: string;
  nota?: string;
}

interface BudgetContextType {
  selectedMonth: number;
  selectedYear: number;
  incomes: IncomeEntry[];
  expenses: BudgetItem[];
  budgetName: string;
  personaOptions: Persona[];
  personas: Persona[];
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  setBudgetName: (name: string) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getPersonaTotals: () => { persona: Persona; total: number }[];
  toggleRecibido: (id: string) => void;
  addMovement: (movement: MovementFormData) => void;
  renamePersona: (oldName: Persona, newName: Persona) => void;
  resetBudget: () => void;
  updatePersonName: (id: string, newName: Persona) => void;
  updateIncome: (id: string, updates: Partial<Omit<IncomeEntry, 'id'>>) => void;
  updateBudgetItem: (item: BudgetItem & { nota?: string }) => void;
  removeIncome: (id: string) => void;
  removeBudgetItem: (id: string) => void;
  personaThemes: Record<string, number>;
  setPersonaTheme: (persona: Persona, hue: number) => void;
  updateExpenseName: (id: string, newName: string) => void;
  toggleExpensePaid: (id: string) => void;
  getMonthName: () => string;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const STORAGE_KEY = 'mindful-budget-state-v1';

const getMonthKey = (year: number, month: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}`;

const recalculateIncomePercentages = (incomeList: IncomeEntry[]) => {
  const total = incomeList.reduce((sum, income) => sum + income.monto, 0);

  if (total === 0) {
    return incomeList.map((income) => ({ ...income, porcentaje: 0 }));
  }

  return incomeList.map((income) => ({
    ...income,
    porcentaje: Math.round((income.monto / total) * 1000) / 10,
  }));
};

const normalizePersonaName = (name: string) => name.trim();

const uniquePersonaList = (names: Persona[]) => {
  const seen = new Set<string>();
  const result: Persona[] = [];

  names.forEach((name) => {
    const trimmed = normalizePersonaName(name);
    if (!trimmed || seen.has(trimmed)) {
      return;
    }
    seen.add(trimmed);
    result.push(trimmed);
  });

  return result;
};

const normalizeHue = (value: number) => {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};

const suggestPersonaHue = (themes: Record<string, number>) => {
  const used = new Set(Object.values(themes).map(normalizeHue));
  const candidate = DEFAULT_PERSONA_HUES.find((hue) => !used.has(normalizeHue(hue)));
  if (candidate !== undefined) {
    return normalizeHue(candidate);
  }
  const fallbackHue = 26 + used.size * 24;
  return normalizeHue(fallbackHue);
};

const cloneForTemplate = (income: IncomeEntry): IncomeEntry => ({
  ...income,
  recibido: false,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const formatFecha = (fecha: string) => {
  if (!fecha) {
    return new Date().toLocaleDateString('es-AR');
  }

  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) {
    return fecha;
  }

  return parsed.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const syncMonthsWithTemplate = (
  months: Record<string, IncomeEntry[]>,
  template: IncomeEntry[],
) => {
  const templateMap = new Map(template.map((income) => [income.id, income]));

  return Object.entries(months).reduce<Record<string, IncomeEntry[]>>(
    (acc, [key, monthIncomes]) => {
      const existingMap = new Map(monthIncomes.map((income) => [income.id, income]));

      const aligned = template.map((income) => {
        const existing = existingMap.get(income.id);
        return {
          ...income,
          recibido: existing?.recibido ?? false,
        };
      });

      const extras = monthIncomes.filter((income) => !templateMap.has(income.id));
      acc[key] = recalculateIncomePercentages([...aligned, ...extras]);
      return acc;
    },
    {},
  );
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [budgetName, setBudgetName] = useState('');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personaThemes, setPersonaThemes] = useState<Record<string, number>>({});
  const [incomesByMonth, setIncomesByMonth] = useState<Record<string, IncomeEntry[]>>({});
  const [expenses, setExpenses] = useState<BudgetItem[]>([]);
  const [templateIncomes, setTemplateIncomes] = useState<IncomeEntry[]>([]);
  const templateIncomesRef = useRef<IncomeEntry[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  const syncTemplate = (entries: IncomeEntry[]) => {
    templateIncomesRef.current = entries;
    setTemplateIncomes(entries);
  };

  const currentMonthKey = getMonthKey(selectedYear, selectedMonth);
  const incomes = incomesByMonth[currentMonthKey] ?? [];

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const parseIncomeEntry = (entry: unknown): IncomeEntry => {
      const record = isRecord(entry) ? entry : {};
      const monto = Number(record.monto);
      const personaRaw = record.persona;
      const persona = typeof personaRaw === 'string' && personaRaw.trim().length > 0
        ? personaRaw
        : DEFAULT_PERSONAS[0];
      const fechaRaw = record.fecha;
      const fuenteRaw = record.fuente;
      const idRaw = record.id;
      const recibidoRaw = record.recibido;
      
      return {
        id: typeof idRaw === 'string' && idRaw ? idRaw : createId(),
        fecha: typeof fechaRaw === 'string' ? fechaRaw : '',
        fuente: typeof fuenteRaw === 'string' && fuenteRaw ? fuenteRaw : 'Ingreso',
        persona,
        monto: Number.isFinite(monto) ? monto : 0,
        porcentaje: 0,
        recibido: Boolean(recibidoRaw),
      };
    };

    const parseBudgetItem = (item: unknown): BudgetItem => {
      const record = isRecord(item) ? item : {};
      const montoEstimado = Number(record.montoEstimado);
      const pagado = Number(record.pagado);
      const idRaw = record.id;
      const conceptoRaw = record.concepto;
      const iconRaw = record.icon;
      const categoriaRaw = record.categoria;
      const notaRaw = record.nota;
      const isPagadoRaw = record.isPagado;

      return {
        id: typeof idRaw === 'string' && idRaw ? idRaw : createId(),
        concepto: typeof conceptoRaw === 'string' && conceptoRaw
          ? conceptoRaw
          : 'Gasto',
        montoEstimado: Number.isFinite(montoEstimado) ? montoEstimado : 0,
        pagado: Number.isFinite(pagado) ? pagado : 0,
        isPagado: Boolean(isPagadoRaw),
        icon: iconRaw as IconComponent | undefined,
        categoria: typeof categoriaRaw === 'string' ? categoriaRaw : undefined,
        nota: typeof notaRaw === 'string' ? notaRaw : undefined,
      };
    };

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHasHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw);

      if (typeof parsed?.selectedMonth === 'number' && parsed.selectedMonth >= 0 && parsed.selectedMonth <= 11) {
        setSelectedMonth(parsed.selectedMonth);
      }

      if (typeof parsed?.selectedYear === 'number' && parsed.selectedYear > 1900) {
        setSelectedYear(parsed.selectedYear);
      }

      if (typeof parsed?.budgetName === 'string') {
        setBudgetName(parsed.budgetName);
      }

      const personasRaw = Array.isArray(parsed?.personas) ? parsed.personas : [];
      const basePersonas = uniquePersonaList([...personasRaw]);

      const templateRaw = Array.isArray(parsed?.templateIncomes) ? parsed.templateIncomes : [];
      const normalizedTemplate = recalculateIncomePercentages(
        templateRaw.map(parseIncomeEntry),
      ).map(cloneForTemplate);
      syncTemplate(normalizedTemplate);

      const parsedIncomes = Object.entries(parsed?.incomesByMonth ?? {}).reduce<
        Record<string, IncomeEntry[]>
      >((acc, [key, value]) => {
        if (!Array.isArray(value)) {
          return acc;
        }
        const normalized = recalculateIncomePercentages(value.map(parseIncomeEntry));
        acc[key] = normalized;
        return acc;
      }, {});
      setIncomesByMonth(parsedIncomes);

      const parsedExpenses = Array.isArray(parsed?.expenses)
        ? parsed.expenses.map(parseBudgetItem)
        : [];
      setExpenses(parsedExpenses);

      const incomePersonaNames: Persona[] = [];
      Object.values(parsedIncomes).forEach((monthIncomes) => {
        monthIncomes.forEach((income) => {
          incomePersonaNames.push(income.persona);
        });
      });

      const allPersonas = uniquePersonaList([...basePersonas, ...incomePersonaNames]);
      setPersonas(allPersonas);

      const themesRaw = isRecord(parsed?.personaThemes) ? parsed.personaThemes : {};
      const parsedThemes = Object.entries(themesRaw).reduce<Record<string, number>>(
        (acc, [key, value]) => {
          if (typeof key !== 'string') {
            return acc;
          }
          const trimmed = normalizePersonaName(key);
          const numericValue = Number(value);
          if (!trimmed || Number.isNaN(numericValue)) {
            return acc;
          }
          acc[trimmed] = normalizeHue(numericValue);
          return acc;
        },
        {},
      );

      setPersonaThemes(() => {
        const next = { ...parsedThemes };
        allPersonas.forEach((personaName, index) => {
          const key = normalizePersonaName(personaName);
          if (!key) {
            return;
          }
          if (next[key] === undefined) {
            const defaultHue = DEFAULT_PERSONA_HUES[index % DEFAULT_PERSONA_HUES.length];
            next[key] = normalizeHue(defaultHue);
          }
        });
        return next;
      });
    } catch (error) {
      console.error('No se pudo cargar el presupuesto local:', error);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') {
      return;
    }

    try {
      const payload = {
        selectedMonth,
        selectedYear,
        budgetName,
        personas,
        incomesByMonth,
        expenses,
        templateIncomes,
        personaThemes,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error('No se pudo guardar el presupuesto local:', error);
    }
  }, [hasHydrated, selectedMonth, selectedYear, budgetName, personas, incomesByMonth, expenses, templateIncomes, personaThemes]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    setIncomesByMonth((prev) => {
      if (prev[currentMonthKey]) {
        return prev;
      }

      const template = templateIncomesRef.current;
      const initialIncomes = template.length > 0
        ? template.map((income) => ({ ...income }))
        : [];

      return {
        ...prev,
        [currentMonthKey]: recalculateIncomePercentages(initialIncomes),
      };
    });
  }, [currentMonthKey, hasHydrated]);

  const personaOptions = useMemo<Persona[]>(() => {
    const combined: Persona[] = [...personas];

    Object.values(incomesByMonth).forEach((monthIncomes) => {
      monthIncomes.forEach((income) => {
        combined.push(income.persona);
      });
    });

    return uniquePersonaList(combined);
  }, [personas, incomesByMonth]);

  const ensurePersonaTheme = (name: Persona) => {
    const trimmed = normalizePersonaName(name);
    if (!trimmed) {
      return;
    }
    setPersonaThemes((prev) => {
      if (prev[trimmed] !== undefined) {
        return prev;
      }
      const hue = suggestPersonaHue(prev);
      return {
        ...prev,
        [trimmed]: hue,
      };
    });
  };

  const reassignPersonaTheme = (fromName: Persona, toName: Persona) => {
    const fromKey = normalizePersonaName(fromName);
    const toKey = normalizePersonaName(toName);
    if (!toKey) {
      return;
    }

    setPersonaThemes((prev) => {
      const next = { ...prev };
      const existingHue = fromKey ? next[fromKey] : undefined;
      if (fromKey && fromKey !== toKey) {
        delete next[fromKey];
      }
      if (existingHue !== undefined) {
        next[toKey] = existingHue;
        return next;
      }
      if (next[toKey] === undefined) {
        next[toKey] = suggestPersonaHue(next);
      }
      return next;
    });
  };

  const setPersonaThemeValue = (persona: Persona, hue: number) => {
    const trimmed = normalizePersonaName(persona);
    if (!trimmed) {
      return;
    }
    setPersonaThemes((prev) => ({
      ...prev,
      [trimmed]: normalizeHue(hue),
    }));
  };

  const registerPersona = (name: Persona) => {
    const trimmed = normalizePersonaName(name);
    if (!trimmed) {
      return;
    }
    setPersonas((prev) => uniquePersonaList([...prev, trimmed]));
    ensurePersonaTheme(trimmed);
  };

  const renamePersona = (oldName: Persona, newName: Persona) => {
    const currentName = normalizePersonaName(oldName);
    const nextName = normalizePersonaName(newName);

    if (!nextName || currentName === nextName) {
      return;
    }

    setPersonas((prev) =>
      uniquePersonaList(
        prev.map((name) =>
          normalizePersonaName(name) === currentName ? nextName : name
        )
      )
    );

    setIncomesByMonth((prev) => {
      const updated = Object.entries(prev).reduce<Record<string, IncomeEntry[]>>(
        (acc, [key, monthIncomes]) => {
          const mapped = monthIncomes.map((income) =>
            normalizePersonaName(income.persona) === currentName
              ? { ...income, persona: nextName }
              : income
          );
          acc[key] = recalculateIncomePercentages(mapped);
          return acc;
        },
        {},
      );

      return updated;
    });

    reassignPersonaTheme(currentName, nextName);
    ensurePersonaTheme(nextName);

    const templateUpdated = recalculateIncomePercentages(
      templateIncomesRef.current.map((income) =>
        normalizePersonaName(income.persona) === currentName
          ? { ...income, persona: nextName }
          : income
      )
    );

    syncTemplate(templateUpdated.map(cloneForTemplate));
  };

  const updateCurrentMonthOnly = (updater: (entries: IncomeEntry[]) => IncomeEntry[]) => {
    setIncomesByMonth((prev) => {
      const current = prev[currentMonthKey] ?? [];
      const mutated = updater(current.map((income) => ({ ...income })));
      return {
        ...prev,
        [currentMonthKey]: recalculateIncomePercentages(mutated),
      };
    });
  };

  const updateTemplateAndSyncAll = (updater: (entries: IncomeEntry[]) => IncomeEntry[]) => {
    setIncomesByMonth((prev) => {
      const current = prev[currentMonthKey] ?? templateIncomesRef.current.map((income) => ({
        ...income,
        recibido: false,
      }));

      const mutated = updater(current.map((income) => ({ ...income })));
      const recalculatedCurrent = recalculateIncomePercentages(mutated);
      const newTemplate = recalculatedCurrent.map(cloneForTemplate);
      syncTemplate(newTemplate);

      const monthsToSync = {
        ...prev,
        [currentMonthKey]: recalculatedCurrent,
      };

      return syncMonthsWithTemplate(monthsToSync, newTemplate);
    });
  };

  const resetBudget = () => {
    const now = new Date();
    setSelectedMonth(now.getMonth());
    setSelectedYear(now.getFullYear());
    setBudgetName('');
    setPersonas([]);
    setPersonaThemes({});
    setIncomesByMonth({});
    setExpenses([]);
    syncTemplate([]);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('No se pudo limpiar el almacenamiento local:', error);
      }
    }
  };

  const getTotalIncome = () => {
    return incomes.reduce((sum, income) => sum + income.monto, 0);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.pagado, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getPersonaTotals = () => {
    if (incomes.length === 0) {
      return [];
    }

    const defaultPersona = personas[0] ?? DEFAULT_PERSONAS[0];

    const totals = incomes.reduce<Map<Persona, number>>((acc, income) => {
      const personaKey = income.persona?.trim() || defaultPersona;
      const currentTotal = acc.get(personaKey) ?? 0;
      acc.set(personaKey, currentTotal + income.monto);
      return acc;
    }, new Map());

    const personaOrder = incomes
      .map((income) => income.persona?.trim() || defaultPersona)
      .filter((persona, index, array) => persona && array.indexOf(persona) === index);

    return personaOrder.map((persona) => ({
      persona,
      total: totals.get(persona) ?? 0,
    }));
  };

  const toggleRecibido = (id: string) => {
    updateCurrentMonthOnly((entries) =>
      entries.map((income) =>
        income.id === id ? { ...income, recibido: !income.recibido } : income,
      ),
    );
  };

  const addMovement = (movement: MovementFormData) => {
    const monto = Number.parseFloat(movement.monto) || 0;

    if (movement.tipo === 'income') {
      const fallbackPersona = personas[0] ?? DEFAULT_PERSONAS[0];
      const persona = movement.persona?.trim() || fallbackPersona;

      registerPersona(persona);

      updateTemplateAndSyncAll((entries) => [
        ...entries,
        {
          id: createId(),
          fecha: formatFecha(movement.fecha),
          fuente: movement.descripcion?.trim() || movement.categoria || 'Ingreso',
          persona,
          monto,
          porcentaje: 0,
          recibido: movement.recibido,
        },
      ]);

      return;
    }

    const concepto = movement.categoria || movement.descripcion || 'Gasto';

    setExpenses((prevExpenses) => [
      ...prevExpenses,
      {
        id: createId(),
        concepto,
        montoEstimado: monto,
        pagado: movement.recibido ? monto : 0,
        isPagado: movement.recibido,
        categoria: movement.categoria,
        nota: movement.descripcion,
      },
    ]);
  };

  const updatePersonName = (id: string, newName: Persona) => {
    const trimmed = normalizePersonaName(newName);
    if (!trimmed) {
      return;
    }

    registerPersona(trimmed);

    let previousPersona: Persona | null = null;

    updateTemplateAndSyncAll((entries) =>
      entries.map((income) => {
        if (income.id === id) {
          previousPersona = income.persona;
          return { ...income, persona: trimmed };
        }
        return income;
      }),
    );

    if (previousPersona) {
      reassignPersonaTheme(previousPersona, trimmed);
    } else {
      ensurePersonaTheme(trimmed);
    }
  };

  const updateIncome = (id: string, updates: Partial<Omit<IncomeEntry, 'id'>>) => {
    updateTemplateAndSyncAll((entries) =>
      entries.map((income) =>
        income.id === id ? { ...income, ...updates } : income,
      ),
    );
  };

  const updateBudgetItem = (updatedItem: BudgetItem & { nota?: string }) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) => {
        if (expense.id !== updatedItem.id) {
          return expense;
        }

        const nextIsPagado =
          typeof updatedItem.isPagado === 'boolean'
            ? updatedItem.isPagado
            : updatedItem.pagado >= updatedItem.montoEstimado;

        return {
          ...expense,
          ...updatedItem,
          isPagado: nextIsPagado,
        };
      }),
    );
  };

  const updateExpenseName = (id: string, newName: string) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, concepto: newName } : expense,
      ),
    );
  };

  const removeIncome = (id: string) => {
    updateTemplateAndSyncAll((entries) =>
      entries.filter((income) => income.id !== id),
    );
  };

  const removeBudgetItem = (id: string) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
  };

  const toggleExpensePaid = (id: string) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) => {
        if (expense.id === id) {
          const newIsPagado = !expense.isPagado;
          return {
            ...expense,
            isPagado: newIsPagado,
            pagado: newIsPagado ? expense.montoEstimado : 0,
          };
        }
        return expense;
      }),
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
        personaOptions,
        personas,
        setSelectedMonth,
        setSelectedYear,
        setBudgetName,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
        getPersonaTotals,
        toggleRecibido,
        addMovement,
        renamePersona,
        resetBudget,
        updatePersonName,
        updateIncome,
        updateBudgetItem,
        removeIncome,
        removeBudgetItem,
        personaThemes,
        setPersonaTheme: setPersonaThemeValue,
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
