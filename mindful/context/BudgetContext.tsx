"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import { useSupabase } from '@/components/supabase-provider';
import type { IconComponent, MovementFormData, Persona, VariableExpenseFormData } from '../types';
import { DEFAULT_PERSONAS } from '../types';
import {
  CurrencyCode,
  CurrencyFormatConfig,
  DEFAULT_CURRENCY_CODE,
  getCurrencyConfig,
  useCurrencyFormatter,
  parseAmount,
} from '../lib/currency';

const DEFAULT_PERSONA_HUES = [210, 20, 150, 310, 115, 45];
const STORAGE_BASE_KEY = 'mindful-budget-state-v1';
const ACTIVE_BUDGET_KEY_BASE = 'mindful-active-budget';
const REMOTE_SAVE_DEBOUNCE = 750;

const storageKeyForBudget = (budgetId: string | null) =>
  budgetId ? `${STORAGE_BASE_KEY}:${budgetId}` : STORAGE_BASE_KEY;

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
  fechaPago?: string;
}

export interface VariableExpense {
  id: string;
  concepto: string;
  monto: number;
  categoria?: string;
  fecha?: string;
  nota?: string;
}

export type BudgetRole = 'owner' | 'editor' | 'viewer';
type InviteStatus = 'pending' | 'accepted' | 'revoked';

interface BudgetSummary {
  id: string;
  name: string | null;
  role: BudgetRole;
  ownerId: string;
}

type BudgetRelation = {
  id: string;
  name: string | null;
  owner_id: string;
};

type MembershipRow = {
  budget_id: string;
  role: BudgetRole | string | null;
};

interface BudgetMemberSummary {
  userId: string;
  email: string | null;
  role: BudgetRole;
  createdAt: string;
  isCurrentUser: boolean;
}

interface BudgetInviteSummary {
  id: string;
  budgetId: string;
  budgetName: string | null;
  email: string;
  role: BudgetRole;
  status: InviteStatus;
  token: string | null;
  invitedBy: string;
  createdAt: string;
  acceptedAt: string | null;
}

interface BudgetContextType {
  selectedMonth: number;
  selectedYear: number;
  budgets: BudgetSummary[];
  activeBudgetId: string | null;
  activeBudgetRole: BudgetRole | null;
  members: BudgetMemberSummary[];
  outgoingInvites: BudgetInviteSummary[];
  incomingInvites: BudgetInviteSummary[];
  isLoadingBudgets: boolean;
  isBudgetAdmin: boolean;
  incomes: IncomeEntry[];
  expenses: BudgetItem[];
  variableExpenses: VariableExpense[];
  budgetName: string;
  personaOptions: Persona[];
  personas: Persona[];
  currencyCode: CurrencyCode;
  currencyConfig: CurrencyFormatConfig;
  setActiveBudget: (budgetId: string) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  setBudgetName: (name: string) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getPersonaTotals: () => { persona: Persona; total: number }[];
  toggleRecibido: (id: string) => void;
  addMovement: (movement: MovementFormData) => void;
  inviteToBudget: (email: string, role: BudgetRole) => Promise<BudgetInviteSummary | null>;
  revokeInvite: (inviteId: string) => Promise<void>;
  acceptInvite: (token: string) => Promise<string | null>;
  refreshMembership: () => Promise<void>;
  renamePersona: (oldName: Persona, newName: Persona) => void;
  resetBudget: () => void;
  updatePersonName: (id: string, newName: Persona) => void;
  updateIncome: (id: string, updates: Partial<Omit<IncomeEntry, 'id'>>) => void;
  updateBudgetItem: (item: BudgetItem & { nota?: string }) => void;
  removeIncome: (id: string) => void;
  removeBudgetItem: (id: string) => void;
  removeVariableExpense: (id: string) => void;
  personaThemes: Record<string, number>;
  setPersonaTheme: (persona: Persona, hue: number) => void;
  updateExpenseName: (id: string, newName: string) => void;
  toggleExpensePaid: (id: string) => void;
  updateExpensePaymentDate: (id: string, fecha: string | null) => void;
  getMonthName: () => string;
  expenseCategories: string[];
  registerExpenseCategory: (categoria: string) => void;
  addVariableExpense: (expense: VariableExpenseFormData) => void;
  updateVariableExpense: (expense: VariableExpense) => void;
  updateMemberRole: (userId: string, role: BudgetRole) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
  setCurrencyCode: (code: CurrencyCode) => void;
  formatCurrency: (value: number, options?: { withSymbol?: boolean }) => string;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const getMonthKey = (year: number, month: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}`;

const generateUuid = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const fallbackRandomValues = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(fallbackRandomValues);
  } else {
    for (let i = 0; i < fallbackRandomValues.length; i += 1) {
      fallbackRandomValues[i] = Math.floor(Math.random() * 256);
    }
  }

  fallbackRandomValues[6] = (fallbackRandomValues[6] & 0x0f) | 0x40;
  fallbackRandomValues[8] = (fallbackRandomValues[8] & 0x3f) | 0x80;

  const hex = Array.from(fallbackRandomValues, (byte) => byte.toString(16).padStart(2, '0'));
  return (
    `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-` +
    `${hex[4]}${hex[5]}-` +
    `${hex[6]}${hex[7]}-` +
    `${hex[8]}${hex[9]}-` +
    `${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`
  );
};

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

const normalizeCategoryName = (name: string) => name.trim();

const uniqueCategoryList = (names: string[]) => {
  const seen = new Set<string>();
  const result: string[] = [];

  names.forEach((name) => {
    if (typeof name !== 'string') {
      return;
    }

    const trimmed = normalizeCategoryName(name);
    if (!trimmed) {
      return;
    }

    const key = trimmed.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
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

interface BudgetStateSnapshot {
  selectedMonth: number;
  selectedYear: number;
  budgetName: string;
  personas: Persona[];
  incomesByMonth: Record<string, IncomeEntry[]>;
  expenses: BudgetItem[];
  variableExpensesByMonth: Record<string, VariableExpense[]>;
  templateIncomes: IncomeEntry[];
  personaThemes: Record<string, number>;
  expenseCategories: string[];
  currencyCode: CurrencyCode;
}

type RemoteSyncStatus = 'idle' | 'loading' | 'ready';

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
  const fechaPagoRaw = record.fechaPago;

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
    fechaPago: typeof fechaPagoRaw === 'string' ? fechaPagoRaw : undefined,
  };
};

const parseVariableExpense = (item: unknown): VariableExpense => {
  const record = isRecord(item) ? item : {};
  const monto = Number(record.monto);
  const idRaw = record.id;
  const conceptoRaw = record.concepto;
  const categoriaRaw = record.categoria;
  const fechaRaw = record.fecha;
  const notaRaw = record.nota;

  return {
    id: typeof idRaw === 'string' && idRaw ? idRaw : createId(),
    concepto: typeof conceptoRaw === 'string' && conceptoRaw ? conceptoRaw : 'Gasto',
    monto: Number.isFinite(monto) ? monto : 0,
    categoria: typeof categoriaRaw === 'string' ? categoriaRaw : undefined,
    fecha: typeof fechaRaw === 'string' ? fechaRaw : undefined,
    nota: typeof notaRaw === 'string' ? notaRaw : undefined,
  };
};

const sanitizeBudgetState = (raw: unknown): BudgetStateSnapshot | null => {
  if (!isRecord(raw)) {
    return null;
  }

  const now = new Date();
  const selectedMonth =
    typeof raw.selectedMonth === 'number' && raw.selectedMonth >= 0 && raw.selectedMonth <= 11
      ? raw.selectedMonth
      : now.getMonth();

  const selectedYear =
    typeof raw.selectedYear === 'number' && raw.selectedYear > 1900
      ? raw.selectedYear
      : now.getFullYear();

  const budgetName = typeof raw.budgetName === 'string' ? raw.budgetName : '';

  const personasRaw = Array.isArray(raw.personas) ? (raw.personas as Persona[]) : [];
  const basePersonas = uniquePersonaList([...personasRaw]);

  const templateRaw = Array.isArray(raw.templateIncomes) ? raw.templateIncomes : [];
  const templateIncomes = recalculateIncomePercentages(
    templateRaw.map(parseIncomeEntry),
  ).map(cloneForTemplate);

  const incomesByMonth = Object.entries(raw.incomesByMonth ?? {}).reduce<Record<string, IncomeEntry[]>>(
    (acc, [key, value]) => {
      if (!Array.isArray(value)) {
        return acc;
      }
      const normalized = recalculateIncomePercentages(value.map(parseIncomeEntry));
      acc[key] = normalized;
      return acc;
    },
    {},
  );

  const expenses = Array.isArray(raw.expenses)
    ? (raw.expenses as unknown[]).map(parseBudgetItem)
    : [];

  const variableExpensesByMonth = isRecord(raw.variableExpensesByMonth)
    ? Object.entries(raw.variableExpensesByMonth).reduce<Record<string, VariableExpense[]>>(
        (acc, [key, value]) => {
          if (!Array.isArray(value)) {
            return acc;
          }
          acc[key] = (value as unknown[]).map(parseVariableExpense);
          return acc;
        },
        {},
      )
    : {};

  const storedCategoriesRaw = Array.isArray(raw.expenseCategories)
    ? (raw.expenseCategories as string[])
    : [];
  const storedCategories = uniqueCategoryList(storedCategoriesRaw);
  const derivedFromExpenses = uniqueCategoryList(
    expenses
      .map((expense) => expense.categoria ?? '')
      .filter((categoria) => typeof categoria === 'string'),
  );
  const derivedFromVariableExpenses = uniqueCategoryList(
    Object.values(variableExpensesByMonth)
      .flatMap((list) => list.map((expense) => expense.categoria ?? ''))
      .filter((categoria) => typeof categoria === 'string'),
  );
  const expenseCategories = uniqueCategoryList([
    ...storedCategories,
    ...derivedFromExpenses,
    ...derivedFromVariableExpenses,
  ]);

  const incomePersonaNames: Persona[] = [];
  Object.values(incomesByMonth).forEach((monthIncomes) => {
    monthIncomes.forEach((income) => {
      incomePersonaNames.push(income.persona);
    });
  });
  const personas = uniquePersonaList([...basePersonas, ...incomePersonaNames]);

  const themesRaw = isRecord(raw.personaThemes) ? raw.personaThemes : {};
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

  const personaThemes = personas.reduce<Record<string, number>>((acc, personaName, index) => {
    const key = normalizePersonaName(personaName);
    if (!key) {
      return acc;
    }
    if (parsedThemes[key] !== undefined) {
      acc[key] = parsedThemes[key];
      return acc;
    }
    const defaultHue = DEFAULT_PERSONA_HUES[index % DEFAULT_PERSONA_HUES.length];
    acc[key] = normalizeHue(defaultHue);
    return acc;
  }, { ...parsedThemes });

  const currencyCodeRaw =
    typeof raw.currencyCode === 'string' ? raw.currencyCode : DEFAULT_CURRENCY_CODE;
  const currencyCode = getCurrencyConfig(currencyCodeRaw).code;

  return {
    selectedMonth,
    selectedYear,
    budgetName,
    personas,
    incomesByMonth,
    expenses,
    variableExpensesByMonth,
    templateIncomes,
    personaThemes,
    expenseCategories,
    currencyCode,
  };
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
  const { supabase, session } = useSupabase();
  const userId = session?.user?.id ?? null;
  const userEmail = (session?.user?.email as string | undefined) ?? null;
  const [budgets, setBudgets] = useState<BudgetSummary[]>([]);
  const [isLoadingBudgets, setIsLoadingBudgets] = useState(true);
  const [activeBudgetId, setActiveBudgetIdState] = useState<string | null>(null);
  const [activeBudgetRole, setActiveBudgetRole] = useState<BudgetRole | null>(null);
  const [members, setMembers] = useState<BudgetMemberSummary[]>([]);
  const [outgoingInvites, setOutgoingInvites] = useState<BudgetInviteSummary[]>([]);
  const [incomingInvites, setIncomingInvites] = useState<BudgetInviteSummary[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [budgetName, setBudgetName] = useState('');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personaThemes, setPersonaThemes] = useState<Record<string, number>>({});
  const [incomesByMonth, setIncomesByMonth] = useState<Record<string, IncomeEntry[]>>({});
  const [expenses, setExpenses] = useState<BudgetItem[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [variableExpensesByMonth, setVariableExpensesByMonth] = useState<Record<string, VariableExpense[]>>({});
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>(DEFAULT_CURRENCY_CODE);
  const [templateIncomes, setTemplateIncomes] = useState<IncomeEntry[]>([]);
  const templateIncomesRef = useRef<IncomeEntry[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [remoteSyncStatus, setRemoteSyncStatus] = useState<RemoteSyncStatus>('idle');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const budgetNameSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedBudgetRef = useRef<string | null>(null);
  const lastSyncedSnapshotRef = useRef<string | null>(null);
  const activeBudgetStorageKey = useMemo(() => {
    if (!userId) {
      return null;
    }
    return `${ACTIVE_BUDGET_KEY_BASE}-${userId}`;
  }, [userId]);
  const isBudgetAdmin = activeBudgetRole === 'owner';

  const currencyConfig = useMemo(
    () => getCurrencyConfig(currencyCode),
    [currencyCode],
  );
  const { format: baseCurrencyFormatter } = useCurrencyFormatter(currencyConfig);

  const formatCurrency = useCallback(
    (value: number, options?: { withSymbol?: boolean }) =>
      baseCurrencyFormatter(value, options?.withSymbol ?? true),
    [baseCurrencyFormatter],
  );

  const handleSetCurrencyCode = useCallback((code: CurrencyCode) => {
    const nextConfig = getCurrencyConfig(code);
    setCurrencyCodeState(nextConfig.code);
  }, []);

  const syncTemplate = useCallback((entries: IncomeEntry[]) => {
    templateIncomesRef.current = entries;
    setTemplateIncomes(entries);
  }, []);

  const initializeEmptyState = useCallback(() => {
    const now = new Date();
    setSelectedMonth(now.getMonth());
    setSelectedYear(now.getFullYear());
    setBudgetName('');
    setPersonas([]);
    setPersonaThemes({});
    syncTemplate([]);
    setIncomesByMonth({});
    setExpenses([]);
    setVariableExpensesByMonth({});
    setExpenseCategories([]);
    setCurrencyCodeState(DEFAULT_CURRENCY_CODE);
  }, [setCurrencyCodeState, syncTemplate]);

  const currentMonthKey = getMonthKey(selectedYear, selectedMonth);
  const incomes = incomesByMonth[currentMonthKey] ?? [];
  const variableExpenses = variableExpensesByMonth[currentMonthKey] ?? [];

  const applyPersistedState = useCallback((snapshot: BudgetStateSnapshot) => {
    setSelectedMonth(snapshot.selectedMonth);
    setSelectedYear(snapshot.selectedYear);
    setBudgetName(snapshot.budgetName);
    setPersonas(snapshot.personas);
    setPersonaThemes(snapshot.personaThemes);
    syncTemplate(snapshot.templateIncomes);
    setIncomesByMonth(snapshot.incomesByMonth);
    setExpenses(snapshot.expenses);
    setVariableExpensesByMonth(snapshot.variableExpensesByMonth);
    setExpenseCategories(snapshot.expenseCategories);
    setCurrencyCodeState(snapshot.currencyCode);
  }, [setCurrencyCodeState, syncTemplate]);

  const createSnapshot = useCallback((): BudgetStateSnapshot => {
    const incomesSnapshot = Object.entries(incomesByMonth).reduce<Record<string, IncomeEntry[]>>(
      (acc, [key, value]) => {
        acc[key] = value.map((income) => ({ ...income }));
        return acc;
      },
      {},
    );

    const variableSnapshot = Object.entries(variableExpensesByMonth).reduce<Record<string, VariableExpense[]>>(
      (acc, [key, value]) => {
        acc[key] = value.map((expense) => ({ ...expense }));
        return acc;
      },
      {},
    );

    return {
      selectedMonth,
      selectedYear,
      budgetName,
      personas: [...personas],
      incomesByMonth: incomesSnapshot,
      expenses: expenses.map((expense) => ({ ...expense })),
      variableExpensesByMonth: variableSnapshot,
      templateIncomes: templateIncomes.map((income) => ({ ...income })),
      personaThemes: { ...personaThemes },
      expenseCategories: [...expenseCategories],
      currencyCode,
    };
  }, [selectedMonth, selectedYear, budgetName, personas, incomesByMonth, expenses, variableExpensesByMonth, templateIncomes, personaThemes, expenseCategories, currencyCode]);

  const fetchBudgets = useCallback(async (preferredActiveId?: string) => {
    if (!userId) {
      setBudgets([]);
      setActiveBudgetIdState(null);
      setActiveBudgetRole(null);
      setIsLoadingBudgets(false);
      return;
    }

    setIsLoadingBudgets(true);

    const runMembershipQuery = () =>
      supabase
        .from('budget_members')
        .select('budget_id, role')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

    const { data, error } = await runMembershipQuery();

    if (error) {
      console.error('No se pudieron cargar tus presupuestos compartidos:', error?.message ?? error);
      setIsLoadingBudgets(false);
      return;
    }

    let memberships = (data ?? []) as MembershipRow[];

    if (memberships.length === 0) {
      const defaultBudgetName = 'Mi presupuesto mindful';
      const nextBudgetId = generateUuid();

      const { error: createBudgetError } = await supabase
        .from('budgets')
        .insert({ id: nextBudgetId, owner_id: userId, name: defaultBudgetName });

      if (createBudgetError) {
        console.error('No se pudo crear el presupuesto inicial:', createBudgetError);
        setIsLoadingBudgets(false);
        return;
      }

      const { error: membershipError } = await supabase.from('budget_members').insert({
        budget_id: nextBudgetId,
        user_id: userId,
        email: userEmail,
        role: 'owner',
      });

      if (membershipError) {
        console.error('No se pudo asociar tu cuenta al presupuesto inicial:', membershipError);
        setIsLoadingBudgets(false);
        return;
      }

      const { data: retryData, error: retryError } = await runMembershipQuery();
      if (retryError) {
        console.error('No se pudieron cargar tus presupuestos compartidos:', retryError?.message ?? retryError);
        setIsLoadingBudgets(false);
        return;
      }
      memberships = (retryData ?? []) as MembershipRow[];
    }

    const budgetIds = memberships
      .map((membership) => membership.budget_id)
      .filter((id): id is string => typeof id === 'string' && id.length > 0);

    let budgetsById: Record<string, BudgetRelation> = {};

    if (budgetIds.length > 0) {
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select('id, name, owner_id')
        .in('id', budgetIds);

      if (budgetsError) {
        console.error(
          'No se pudieron cargar los detalles de tus presupuestos compartidos:',
          budgetsError?.message ?? budgetsError,
        );
        setIsLoadingBudgets(false);
        return;
      }

      budgetsById = (budgetsData ?? []).reduce<Record<string, BudgetRelation>>((acc, budget) => {
        acc[budget.id] = budget;
        return acc;
      }, {});
    }

    const mappedBudgets: BudgetSummary[] = memberships.map((membership) => {
      const budgetData = budgetsById[membership.budget_id];
      const resolvedRole: BudgetRole =
        membership.role === 'owner' || membership.role === 'editor' ? membership.role : 'editor';
      return {
        id: budgetData?.id ?? membership.budget_id,
        name: budgetData?.name ?? null,
        role: resolvedRole,
        ownerId: budgetData?.owner_id ?? userId,
      };
    });

    setBudgets(mappedBudgets);

    let resolvedActiveId = preferredActiveId ?? activeBudgetId;

    if (resolvedActiveId && !mappedBudgets.some((budget) => budget.id === resolvedActiveId)) {
      resolvedActiveId = null;
    }

    if (!resolvedActiveId && typeof window !== 'undefined' && activeBudgetStorageKey) {
      const stored = window.localStorage.getItem(activeBudgetStorageKey);
      if (stored && mappedBudgets.some((budget) => budget.id === stored)) {
        resolvedActiveId = stored;
      }
    }

    if (!resolvedActiveId) {
      resolvedActiveId = mappedBudgets[0]?.id ?? null;
    }

    setActiveBudgetIdState(resolvedActiveId);
    const resolvedRole = mappedBudgets.find((budget) => budget.id === resolvedActiveId)?.role ?? null;
    setActiveBudgetRole(resolvedRole);

    if (resolvedActiveId && activeBudgetStorageKey && typeof window !== 'undefined') {
      window.localStorage.setItem(activeBudgetStorageKey, resolvedActiveId);
    }

    setIsLoadingBudgets(false);
  }, [activeBudgetId, activeBudgetStorageKey, supabase, userEmail, userId]);

  const setActiveBudget = useCallback(
    (budgetId: string) => {
      if (!budgetId || !budgets.some((budget) => budget.id === budgetId)) {
        return;
      }

      setActiveBudgetIdState((prev) => (prev === budgetId ? prev : budgetId));

      if (activeBudgetStorageKey && typeof window !== 'undefined') {
        window.localStorage.setItem(activeBudgetStorageKey, budgetId);
      }
    },
    [activeBudgetStorageKey, budgets],
  );

  const refreshBudgetMembers = useCallback(
    async (budgetId: string) => {
      const { data, error } = await supabase
        .from('budget_members')
        .select('user_id, email, role, created_at')
        .eq('budget_id', budgetId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('No se pudieron obtener los miembros del presupuesto:', error);
        setMembers([]);
        return;
      }

      const mapped: BudgetMemberSummary[] = (data ?? []).map((member) => ({
        userId: member.user_id,
        email: member.email,
        role: (member.role as BudgetRole) ?? 'editor',
        createdAt: member.created_at,
        isCurrentUser: member.user_id === userId,
      }));

      setMembers(mapped);
    },
    [supabase, userId],
  );

  const refreshOutgoingInvites = useCallback(
    async (budgetId: string) => {
      const { data, error } = await supabase
        .from('budget_invites')
        .select('id, budget_id, budget_name, email, role, status, token, invited_by, created_at, accepted_at')
        .eq('budget_id', budgetId)
        .order('created_at', { ascending: true });

      if (error) {
        if (error.code !== '42501') {
          console.error('No se pudieron obtener las invitaciones del presupuesto:', error);
        }
        setOutgoingInvites([]);
        return;
      }

      const mapped: BudgetInviteSummary[] = (data ?? []).map((invite) => ({
        id: invite.id,
        budgetId: invite.budget_id,
        budgetName: invite.budget_name,
        email: invite.email,
        role: (invite.role as BudgetRole) ?? 'editor',
        status: (invite.status as InviteStatus) ?? 'pending',
        token: invite.token,
        invitedBy: invite.invited_by,
        createdAt: invite.created_at,
        acceptedAt: invite.accepted_at,
      }));

      setOutgoingInvites(mapped);
    },
    [supabase],
  );

  const refreshIncomingInvites = useCallback(async () => {
    const { data, error } = await supabase
      .from('budget_invites')
      .select('id, budget_id, budget_name, email, role, status, token, invited_by, created_at, accepted_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('No se pudieron obtener tus invitaciones pendientes:', error);
      setIncomingInvites([]);
      return;
    }

    const mapped: BudgetInviteSummary[] = (data ?? [])
      .filter((invite) => !userEmail || invite.email?.toLowerCase() === userEmail.toLowerCase())
      .map((invite) => ({
        id: invite.id,
        budgetId: invite.budget_id,
        budgetName: invite.budget_name,
        email: invite.email,
        role: (invite.role as BudgetRole) ?? 'editor',
        status: (invite.status as InviteStatus) ?? 'pending',
        token: invite.token,
        invitedBy: invite.invited_by,
        createdAt: invite.created_at,
        acceptedAt: invite.accepted_at,
      }));

    setIncomingInvites(mapped);
  }, [supabase, userEmail]);

  const refreshMembership = useCallback(async () => {
    if (!activeBudgetId) {
      setMembers([]);
      setOutgoingInvites([]);
      return;
    }

    await Promise.all([
      refreshBudgetMembers(activeBudgetId),
      activeBudgetRole === 'owner' ? refreshOutgoingInvites(activeBudgetId) : Promise.resolve(),
    ]);

    await refreshIncomingInvites();
  }, [activeBudgetId, activeBudgetRole, refreshBudgetMembers, refreshOutgoingInvites, refreshIncomingInvites]);

  useEffect(() => {
    void fetchBudgets();
  }, [fetchBudgets]);

  useEffect(() => {
    if (session?.user) {
      void refreshIncomingInvites();
    } else {
      setIncomingInvites([]);
    }
  }, [refreshIncomingInvites, session]);

  useEffect(() => {
    if (!activeBudgetId || !hasHydrated) {
      return;
    }

    setBudgets((prev) =>
      prev.map((budget) =>
        budget.id === activeBudgetId
          ? {
              ...budget,
              name: budgetName || budget.name,
            }
          : budget,
      ),
    );
  }, [activeBudgetId, budgetName, hasHydrated]);

  useEffect(() => {
    if (!activeBudgetId || !isBudgetAdmin || !hasHydrated) {
      return;
    }

    if (budgetNameSaveTimeoutRef.current) {
      clearTimeout(budgetNameSaveTimeoutRef.current);
    }

    const trimmedName = budgetName.trim();

    budgetNameSaveTimeoutRef.current = setTimeout(() => {
      budgetNameSaveTimeoutRef.current = null;
      void supabase
        .from('budgets')
        .update({ name: trimmedName || null })
        .eq('id', activeBudgetId);
    }, 1200);

    return () => {
      if (budgetNameSaveTimeoutRef.current) {
        clearTimeout(budgetNameSaveTimeoutRef.current);
        budgetNameSaveTimeoutRef.current = null;
      }
    };
  }, [activeBudgetId, budgetName, hasHydrated, isBudgetAdmin, supabase]);

  useEffect(() => {
    if (!activeBudgetId) {
      setMembers([]);
      setOutgoingInvites([]);
      return;
    }
    void refreshMembership();
  }, [activeBudgetId, refreshMembership]);
  useEffect(() => {
    if (isLoadingBudgets) {
      return;
    }

    if (!activeBudgetId) {
      initializeEmptyState();
      setHasHydrated(false);
      hydratedBudgetRef.current = null;
      lastSyncedSnapshotRef.current = null;
      setRemoteSyncStatus('idle');
      return;
    }

    initializeEmptyState();
    setHasHydrated(false);
    hydratedBudgetRef.current = activeBudgetId;
    lastSyncedSnapshotRef.current = null;
    setRemoteSyncStatus('idle');

    if (typeof window === 'undefined') {
      setHasHydrated(true);
      return;
    }

    try {
      const raw = window.localStorage.getItem(storageKeyForBudget(activeBudgetId));
      if (!raw) {
        setHasHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw);
      const sanitized = sanitizeBudgetState(parsed);

      if (sanitized) {
        applyPersistedState(sanitized);
      }
    } catch (error) {
      console.error('No se pudo cargar el presupuesto local:', error);
    } finally {
      setHasHydrated(true);
    }
  }, [activeBudgetId, applyPersistedState, initializeEmptyState, isLoadingBudgets]);

  useEffect(() => {
    if (!hasHydrated || !activeBudgetId) {
      lastSyncedSnapshotRef.current = null;
      setRemoteSyncStatus('idle');
      return;
    }

    let cancelled = false;
    setRemoteSyncStatus('loading');

    const fetchRemoteState = async () => {
      const { data, error } = await supabase
        .from('budget_states')
        .select('state')
        .eq('budget_id', activeBudgetId)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      if (error) {
        console.error('No se pudo obtener el presupuesto remoto:', error);
        setRemoteSyncStatus('ready');
        return;
      }

      if (data?.state) {
        const sanitized = sanitizeBudgetState(data.state);
        if (sanitized) {
          applyPersistedState(sanitized);
          lastSyncedSnapshotRef.current = JSON.stringify(sanitized);
        }
      } else {
        lastSyncedSnapshotRef.current = null;
      }

      setRemoteSyncStatus('ready');
    };

    fetchRemoteState();

    return () => {
      cancelled = true;
    };
  }, [activeBudgetId, applyPersistedState, hasHydrated, supabase]);

  useEffect(() => {
    if (!activeBudgetId || !hasHydrated || remoteSyncStatus !== 'ready') {
      return;
    }

    const snapshot = createSnapshot();
    const snapshotString = JSON.stringify(snapshot);

    if (snapshotString === lastSyncedSnapshotRef.current) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null;

      void (async () => {
        const { error } = await supabase
          .from('budget_states')
          .upsert({
            budget_id: activeBudgetId,
            state: snapshot,
          });

        if (error) {
          console.error('No se pudo guardar el presupuesto remoto:', error);
          return;
        }

        lastSyncedSnapshotRef.current = snapshotString;
      })();
    }, REMOTE_SAVE_DEBOUNCE);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [activeBudgetId, createSnapshot, hasHydrated, remoteSyncStatus, supabase]);

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined' || !activeBudgetId) {
      return;
    }

    try {
      const snapshot = createSnapshot();
      window.localStorage.setItem(storageKeyForBudget(activeBudgetId), JSON.stringify(snapshot));
    } catch (error) {
      console.error('No se pudo guardar el presupuesto local:', error);
    }
  }, [activeBudgetId, createSnapshot, hasHydrated]);

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

  const registerExpenseCategory = (categoria: string) => {
    const trimmed = normalizeCategoryName(categoria);
    if (!trimmed) {
      return;
    }

    setExpenseCategories((prev) => {
      const exists = prev.some((existing) => existing.toLowerCase() === trimmed.toLowerCase());
      if (exists) {
        return prev;
      }
      return [...prev, trimmed];
    });
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
    initializeEmptyState();
    lastSyncedSnapshotRef.current = null;

    if (typeof window !== 'undefined' && activeBudgetId) {
      try {
        window.localStorage.removeItem(storageKeyForBudget(activeBudgetId));
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
    const monto = parseAmount(movement.monto);

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

    const descripcion = movement.descripcion?.trim?.() ?? '';
    const concepto = descripcion || movement.categoria || 'Gasto';
    const nota = movement.nota?.trim?.() ?? '';

    if (movement.categoria) {
      registerExpenseCategory(movement.categoria);
    }

    setExpenses((prevExpenses) => [
      ...prevExpenses,
      {
        id: createId(),
        concepto,
        montoEstimado: monto,
        pagado: movement.recibido ? monto : 0,
        isPagado: movement.recibido,
        categoria: movement.categoria,
        nota: nota ? nota : undefined,
        fechaPago: movement.fecha ? movement.fecha : undefined,
      },
    ]);
  };

  const addVariableExpense = (expense: VariableExpenseFormData) => {
    const monto = parseAmount(expense.monto);
    const categoria = expense.categoria?.trim();
    const concepto = expense.concepto?.trim() || 'Gasto';
    const fecha = expense.fecha?.trim();
    const nota = expense.nota?.trim();

    if (categoria) {
      registerExpenseCategory(categoria);
    }

    const entry: VariableExpense = {
      id: createId(),
      concepto,
      monto,
      categoria: categoria || undefined,
      fecha: fecha || undefined,
      nota: nota || undefined,
    };

    setVariableExpensesByMonth((prev) => {
      const current = prev[currentMonthKey] ?? [];
      return {
        ...prev,
        [currentMonthKey]: [...current, entry],
      };
    });
  };

  const updateVariableExpense = (updatedExpense: VariableExpense) => {
    if (updatedExpense.categoria) {
      registerExpenseCategory(updatedExpense.categoria);
    }

    setVariableExpensesByMonth((prev) => {
      const current = prev[currentMonthKey] ?? [];
      const next = current.map((expense) =>
        expense.id === updatedExpense.id ? { ...updatedExpense } : expense,
      );
      return {
        ...prev,
        [currentMonthKey]: next,
      };
    });
  };

  const removeVariableExpense = (id: string) => {
    setVariableExpensesByMonth((prev) => {
      const current = prev[currentMonthKey] ?? [];
      const next = current.filter((expense) => expense.id !== id);
      if (next.length === 0) {
        const rest = { ...prev };
        delete rest[currentMonthKey];
        return rest;
      }
      return {
        ...prev,
        [currentMonthKey]: next,
      };
    });
  };

  const inviteToBudget = useCallback(
    async (email: string, role: BudgetRole) => {
      if (!activeBudgetId || activeBudgetRole !== 'owner') {
        return null;
      }

      const normalizedEmail = email.trim();
      if (!normalizedEmail) {
        return null;
      }

      const allowedRoles: BudgetRole[] = ['editor', 'viewer'];
      const inviteRole: BudgetRole = allowedRoles.includes(role) ? role : 'viewer';

      const { data, error } = await supabase.rpc('create_budget_invite', {
        p_budget_id: activeBudgetId,
        p_email: normalizedEmail,
        p_role: inviteRole,
      });

      if (error) {
        console.error('No se pudo enviar la invitación al presupuesto:', error);
        throw error;
      }

      if (!data) {
        return null;
      }

      const invite: BudgetInviteSummary = {
        id: data.id,
        budgetId: data.budget_id,
        budgetName: data.budget_name,
        email: data.email,
        role: (data.role as BudgetRole) ?? 'editor',
        status: (data.status as InviteStatus) ?? 'pending',
        token: data.token,
        invitedBy: data.invited_by,
        createdAt: data.created_at,
        acceptedAt: data.accepted_at,
      };

      await refreshOutgoingInvites(activeBudgetId);
      await refreshIncomingInvites();

      if (invite.token) {
        try {
          const response = await fetch('/api/budget-invite-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: invite.email,
              inviteToken: invite.token,
              budgetName: invite.budgetName,
              role: invite.role,
              invitedByEmail: userEmail,
            }),
          });

          if (!response.ok) {
            const message = await response.text();
            console.error('No se pudo enviar el correo de invitación:', message);
          }
        } catch (emailError) {
          console.error('No se pudo enviar el correo de invitación:', emailError);
        }
      }

      return invite;
    },
    [activeBudgetId, activeBudgetRole, refreshIncomingInvites, refreshOutgoingInvites, supabase, userEmail],
  );

  const updateMemberRole = useCallback(
    async (memberId: string, role: BudgetRole) => {
      if (!activeBudgetId || activeBudgetRole !== 'owner') {
        throw new Error('No tenés permisos para actualizar roles.');
      }
      const allowedRoles: BudgetRole[] = ['editor', 'viewer'];
      if (!allowedRoles.includes(role)) {
        throw new Error('Rol no válido.');
      }
      if (!memberId || memberId === userId) {
        throw new Error('No podés cambiar tu propio rol.');
      }

      const { error } = await supabase
        .from('budget_members')
        .update({ role })
        .eq('budget_id', activeBudgetId)
        .eq('user_id', memberId);

      if (error) {
        console.error('No se pudo actualizar el rol del miembro:', error);
        throw error;
      }

      await refreshBudgetMembers(activeBudgetId);
    },
    [activeBudgetId, activeBudgetRole, refreshBudgetMembers, supabase, userId],
  );

  const removeMember = useCallback(
    async (memberId: string) => {
      if (!activeBudgetId || activeBudgetRole !== 'owner') {
        throw new Error('No tenés permisos para quitar personas.');
      }
      if (!memberId || memberId === userId) {
        throw new Error('No podés quitar tu propia cuenta.');
      }

      const { error } = await supabase
        .from('budget_members')
        .delete()
        .eq('budget_id', activeBudgetId)
        .eq('user_id', memberId);

      if (error) {
        console.error('No se pudo quitar al miembro del presupuesto:', error);
        throw error;
      }

      await refreshBudgetMembers(activeBudgetId);
    },
    [activeBudgetId, activeBudgetRole, refreshBudgetMembers, supabase, userId],
  );

  const revokeInvite = useCallback(
    async (inviteId: string) => {
      if (!activeBudgetId || activeBudgetRole !== 'owner') {
        return;
      }
      const trimmedId = inviteId.trim();
      if (!trimmedId) {
        return;
      }

      const { error } = await supabase.rpc('revoke_budget_invite', {
        p_invite_id: trimmedId,
      });

      if (error) {
        console.error('No se pudo revocar la invitación:', error);
        throw error;
      }

      await refreshOutgoingInvites(activeBudgetId);
    },
    [activeBudgetId, activeBudgetRole, refreshOutgoingInvites, supabase],
  );

  const acceptInvite = useCallback(
    async (token: string) => {
      const normalizedToken = token.trim();
      if (!normalizedToken) {
        return null;
      }

      const { data, error } = await supabase.rpc('accept_budget_invite', {
        p_token: normalizedToken,
      });

      if (error) {
        console.error('No se pudo aceptar la invitación al presupuesto:', error);
        throw error;
      }

      const budgetIdAccepted = typeof data === 'string' ? data : null;

      await refreshIncomingInvites();
      await fetchBudgets(budgetIdAccepted ?? undefined);

      if (budgetIdAccepted) {
        await refreshBudgetMembers(budgetIdAccepted);
      }

      return budgetIdAccepted;
    },
    [fetchBudgets, refreshBudgetMembers, refreshIncomingInvites, supabase],
  );

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

        if (updatedItem.categoria) {
          registerExpenseCategory(updatedItem.categoria);
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

  const updateExpensePaymentDate = (id: string, fecha: string | null) => {
    const normalized = fecha?.trim() ?? '';
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              fechaPago: normalized ? normalized : undefined,
            }
          : expense,
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
          const todayIso = new Date().toISOString().slice(0, 10);
          return {
            ...expense,
            isPagado: newIsPagado,
            pagado: newIsPagado ? expense.montoEstimado : 0,
            fechaPago: newIsPagado
              ? expense.fechaPago && expense.fechaPago.trim()
                ? expense.fechaPago
                : todayIso
              : expense.fechaPago,
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
        budgets,
        activeBudgetId,
        activeBudgetRole,
        members,
        outgoingInvites,
        incomingInvites,
        isLoadingBudgets,
        isBudgetAdmin,
        incomes,
        expenses,
        variableExpenses,
        budgetName,
        personaOptions,
        personas,
        currencyCode,
        currencyConfig,
        setActiveBudget,
        setSelectedMonth,
        setSelectedYear,
        setBudgetName,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
        getPersonaTotals,
        formatCurrency,
        toggleRecibido,
        addMovement,
        addVariableExpense,
        inviteToBudget,
        updateMemberRole,
        removeMember,
        revokeInvite,
        acceptInvite,
        refreshMembership,
        renamePersona,
        resetBudget,
        updatePersonName,
        updateIncome,
        updateBudgetItem,
        removeIncome,
        removeBudgetItem,
        updateVariableExpense,
        removeVariableExpense,
        personaThemes,
        setPersonaTheme: setPersonaThemeValue,
        updateExpenseName,
        toggleExpensePaid,
        updateExpensePaymentDate,
        getMonthName,
        expenseCategories,
        registerExpenseCategory,
        setCurrencyCode: handleSetCurrencyCode,
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
