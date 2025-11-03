# ῥέω — Unified Data Flow Architecture

## Overview
The Balance card in Inicio and the Presupuesto section now share a single, unified data source through the BudgetContext. This ensures perfect synchronization between all financial displays.

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                  BudgetProvider                     │
│              (context/BudgetContext.tsx)            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  STATE:                                             │
│  ├─ selectedMonth: number (10 = November)          │
│  ├─ selectedYear: number (2025)                    │
│  ├─ incomes: IncomeEntry[]                         │
│  │   ├─ Paola: 200,000                             │
│  │   └─ Jorge: 240,000                             │
│  └─ expenses: BudgetItem[]                         │
│      ├─ Alquiler: 150,000                          │
│      ├─ Servicios: 28,000                          │
│      ├─ Internet: 15,000                           │
│      ├─ Agua: 0                                    │
│      └─ Mantenimiento: 12,000                      │
│                                                     │
│  COMPUTED VALUES:                                   │
│  ├─ getTotalIncome() → 440,000                     │
│  ├─ getTotalExpenses() → 205,000                   │
│  ├─ getBalance() → 235,000                         │
│  ├─ getPaolaTotal() → 200,000                      │
│  ├─ getJorgeTotal() → 240,000                      │
│  └─ getMonthName() → "noviembre"                   │
│                                                     │
│  ACTIONS:                                           │
│  ├─ setSelectedMonth(month)                        │
│  ├─ setSelectedYear(year)                          │
│  └─ toggleRecibido(id)                             │
│                                                     │
└─────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
┌───────────────────┐           ┌──────────────────┐
│   INICIO Screen   │           │ PRESUPUESTO Tab  │
└───────────────────┘           └──────────────────┘
        ↓                               ↓
┌───────────────────┐           ┌──────────────────┐
│ FlowingBalance    │           │ BudgetSection    │
│ Chart Component   │           │ Component        │
├───────────────────┤           ├──────────────────┤
│                   │           │                  │
│ Uses:             │           │ Uses:            │
│ ├─ getTotalIncome │           │ ├─ incomes[]    │
│ ├─ getTotalExpenses           │ ├─ getPaolaTotal│
│ ├─ getMonthName   │           │ ├─ getJorgeTotal│
│ └─ Display:       │           │ ├─ expenses[]   │
│    ├─ 440k income │           │ └─ toggleRecibido
│    ├─ 205k expenses           │                  │
│    └─ 235k balance│           │ Child Components:│
│                   │           │ ├─ IncomeCard   │
│                   │           │ ├─ MonthlyChart │
│                   │           │ ├─ CasitaBudget │
│                   │           │ └─ EvolutionChart
│                   │           │                  │
└───────────────────┘           └──────────────────┘
```

---

## 📊 Data Synchronization Points

### 1. Income Totals
**Source**: `BudgetContext.incomes[]`

**Inicio Display**:
```tsx
<FlowingBalanceChart 
  income={getTotalIncome() / 1000}  // 440k → displayed
  expenses={getTotalExpenses() / 1000}  // 205k → displayed
/>
```

**Presupuesto Display**:
```tsx
{incomes.map(income => (
  <IncomeCard income={income} />
))}
// Paola: 200,000
// Jorge: 240,000
// Total: 440,000
```

### 2. Expense Totals
**Source**: `BudgetContext.expenses[]`

**Inicio Display**:
```tsx
// Balance card shows total expenses: 205k
Balance = 440k - 205k = 235k
```

**Presupuesto Display**:
```tsx
<CasitaBudget />
// Uses expenses from context
// Displays all 5 expense items
// Total pagado: 205,000
```

### 3. Month Selection
**Source**: `BudgetContext.selectedMonth`

**Both screens**:
- Inicio: "Balance noviembre"
- Presupuesto: "Ingresos del mes — noviembre"
- Synced via `getMonthName()`

### 4. Person Distribution
**Source**: Calculated from `incomes[]`

**Presupuesto Display**:
```tsx
<MonthlyChart 
  paolaTotal={getPaolaTotal()}  // 200,000
  jorgeTotal={getJorgeTotal()}  // 240,000
/>
// Shows donut chart: 45% Paola, 55% Jorge
```

---

## 🔗 Component Dependencies

### App.tsx
```tsx
<BudgetProvider>
  <AppContent />
</BudgetProvider>
```

### AppContent (Inicio Tab)
```tsx
const { getTotalIncome, getTotalExpenses } = useBudget();

<FlowingBalanceChart 
  income={getTotalIncome() / 1000}
  expenses={getTotalExpenses() / 1000}
/>
```

### BudgetSection (Presupuesto Tab)
```tsx
const { 
  selectedMonth,
  incomes,
  getPaolaTotal,
  getJorgeTotal,
  toggleRecibido 
} = useBudget();

<IncomeCard onToggleRecibido={toggleRecibido} />
<MonthlyChart paolaTotal={getPaolaTotal()} />
```

### CasitaBudget
```tsx
const { expenses } = useBudget();

{expenses.map(expense => (
  <ExpenseItem expense={expense} />
))}
```

### FlowingBalanceChart
```tsx
const { getMonthName } = useBudget();

<div>Balance {getMonthName()}</div>
```

---

## ✅ Unified Data Guarantees

### 1. Single Source of Truth
- All income data comes from `BudgetContext.incomes`
- All expense data comes from `BudgetContext.expenses`
- No duplicate state or diverging values

### 2. Automatic Synchronization
- When month changes → all displays update
- When income toggled → totals recalculate
- When navigating between tabs → same data shown

### 3. Consistent Calculations
- `getTotalIncome()`: Used by both Inicio and Presupuesto
- `getTotalExpenses()`: Shared calculation logic
- `getBalance()`: Single computation point

### 4. Type Safety
- `IncomeEntry` interface exported from context
- `BudgetItem` interface exported from context
- TypeScript ensures consistency

---

## 🎯 Real-World Data Flow Example

### User Action: View November Budget

**Step 1**: User navigates to Inicio
```
BudgetContext → selectedMonth = 10 (November)
              → getMonthName() = "noviembre"
              → getTotalIncome() = 440,000
              → getTotalExpenses() = 205,000
                ↓
FlowingBalanceChart displays:
  - "Balance noviembre"
  - Income: 440k
  - Expenses: 205k
  - Balance: 235k
```

**Step 2**: User switches to Presupuesto tab
```
BudgetContext → Same month (10)
              → Same incomes array
              → Same expenses array
                ↓
BudgetSection displays:
  - "Ingresos del mes — noviembre"
  - Paola: 200,000 ✓
  - Jorge: 240,000 ✓
  - Total: 440,000 (matches Inicio!)
  
  - "Presupuesto Casita"
  - Total pagado: 205,000 (matches Inicio!)
```

**Step 3**: User toggles "Recibido" on Jorge's income
```
BudgetContext → toggleRecibido("2")
              → Updates incomes array
              → No change to totals (visual only)
                ↓
Both screens remain synchronized:
  - Income total: 440,000
  - Visual indicator updated: ✓ → ○
```

---

## 🔧 Technical Implementation Details

### Context Provider Setup
```tsx
// App.tsx
export default function App() {
  return (
    <BudgetProvider>
      <AppContent />
    </BudgetProvider>
  );
}
```

### Hook Usage Pattern
```tsx
// Any component can access:
const {
  selectedMonth,      // Current month selection
  incomes,            // Array of income entries
  expenses,           // Array of expense items
  getTotalIncome,     // Computed total
  getPaolaTotal,      // Computed Paola total
  toggleRecibido,     // Action to toggle status
  getMonthName,       // Computed month name
} = useBudget();
```

### Data Transformations
```tsx
// Inicio uses values in thousands:
income={getTotalIncome() / 1000}  // 440 → "440k"

// Presupuesto uses full values:
monto={income.monto}  // 200000 → "$200,000"
```

---

## 📈 Benefits of Unified Data

### 1. Consistency
- ✅ No possibility of Inicio showing 440k while Presupuesto shows 435k
- ✅ Month name always matches between views
- ✅ Balance calculation identical everywhere

### 2. Maintainability
- ✅ Update data structure in one place (context)
- ✅ All components automatically benefit
- ✅ No need to sync multiple state sources

### 3. User Experience
- ✅ Seamless navigation between Inicio and Presupuesto
- ✅ User sees same numbers in both places
- ✅ Builds trust in the application

### 4. Developer Experience
- ✅ Clear data ownership (context)
- ✅ Type-safe access to data
- ✅ Easy to add new computed values

---

## 🎨 Visual Confirmation

### Inicio Screen
```
┌─────────────────────────────┐
│ FlowingBalanceChart         │
├─────────────────────────────┤
│ Balance noviembre           │
│        235k                 │
│                             │
│ ● Ingresos 440k            │
│ ● Gastos 205k              │
└─────────────────────────────┘
```

### Presupuesto Screen
```
┌─────────────────────────────┐
│ Ingresos del mes            │
│ noviembre                   │
├─────────────────────────────┤
│ Paola   200,000 ✓          │
│ Jorge   240,000 ✓          │
│ Total:  440,000            │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Presupuesto Casita          │
├─────────────────────────────┤
│ Total Pagado: 205,000      │
│ (matches Inicio expenses!)  │
└─────────────────────────────┘
```

**Numbers match perfectly!** ✨

---

## 🚀 Future Enhancements

The unified data structure makes it easy to add:

1. **Month History**
   - Store data per month
   - Switch months, see updated totals
   - Historical comparisons

2. **Real-time Updates**
   - Add new income → both views update
   - Mark expense paid → balance recalculates
   - Instant synchronization

3. **Data Persistence**
   - Save to localStorage
   - Sync with backend
   - Single point of persistence

4. **Analytics**
   - Calculate trends from unified data
   - Compare months easily
   - Generate reports

---

*"Un flujo de datos, una verdad financiera."*

— ῥέω unified architecture for perfect synchronization.
