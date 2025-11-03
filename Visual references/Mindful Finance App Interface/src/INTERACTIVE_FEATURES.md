# ῥέω — Interactive Features Documentation

*"Tu economía se adapta y respira contigo."*

---

## 🎯 Overview

Extended the Presupuesto and Ingresos interfaces with inline editing, interactive payment status, and enhanced visualizations while maintaining ῥέω's calm, organic aesthetic.

---

## ✏️ 1. Editable Text Fields

### InlineEditableText Component

A reusable component for editing labels inline with organic animations and feedback.

**Features:**
- Double-click or pencil icon to activate
- Soft glow effect based on type (aqua/copper/neutral)
- Organic cursor pulse animation
- Smooth fade-in checkmark on save
- Maintains alignment when toggling modes

### Editable Fields

| Field | Location | Trigger | Type | Color |
|-------|----------|---------|------|-------|
| Person Name | IncomeCard | Double-click / Edit icon | income/expense | Aqua/Copper |
| Budget Name | CasitaBudget header | Double-click / Edit icon | neutral | Petroleum |
| Expense Category | CasitaBudget items | Double-click / Edit icon | expense | Copper |

### Visual States

**Read Mode:**
```tsx
┌─────────────────────────────────┐
│ Paola              [✎]          │  ← Hover shows pencil
└─────────────────────────────────┘
```

**Edit Mode:**
```tsx
┌─────────────────────────────────┐
│ [Paola____]        [✔]          │  ← Input with glow
│  └─ Soft aqua glow pulsing      │
└─────────────────────────────────┘
```

**Save Confirmation:**
```tsx
┌─────────────────────────────────┐
│ Paola              ✔            │  ← Checkmark fades in
└─────────────────────────────────┘
```

### Implementation

```tsx
<InlineEditableText
  value="Paola"
  onSave={(newName) => updatePersonName(id, newName)}
  style={{ fontSize: '16px', fontWeight: 600, color: '#C78C60' }}
  type="expense"  // 'income' | 'expense' | 'neutral'
  placeholder="Nombre"
/>
```

### Animations

**Edit Activation:**
- Duration: 200ms
- Easing: easeOut
- Effect: Fade in with scale

**Glow Pulse:**
- Duration: 1.5s
- Repeat: Infinite
- Opacity: 0.3 → 0.6 → 0.3

**Save Checkmark:**
- Duration: 300ms entrance
- Delay: 500ms hold
- Duration: 300ms exit
- Total: 800ms cycle

### Color Mapping

```tsx
const glowColor = {
  income: '#7ED4C1',   // Aqua
  expense: '#C78C60',  // Copper
  neutral: '#0F3C3B',  // Petroleum
}
```

---

## 💸 2. Interactive Payment Status

### Toggle Mechanism

Each expense card in Presupuesto Casita includes a circular payment toggle.

**States:**
1. **Pending (Default)**
   - Icon: `Circle` outline
   - Color: Muted copper (`#C78C6080`)
   - Background: White/60
   - Label: "Pendiente"

2. **Paid (Active)**
   - Icon: `CheckCircle2` filled
   - Color: White
   - Background: Copper → Aqua gradient
   - Label: "Pagado"
   - Effect: Wave ripple animation

### Visual Feedback

**On Toggle:**
```
1. Click/tap button
2. Icon rotates and scales
   - Pending → Paid: rotate(0 → 360)
   - Paid → Pending: rotate(360 → 0)
3. Background animates gradient
4. Wave ripple emanates from center
5. Label updates with fade transition
6. Progress bar updates
7. Totals recalculate
```

**Wave Ripple Animation:**
```tsx
initial={{ scale: 0, opacity: 0.6 }}
animate={{ scale: 3, opacity: 0 }}
transition={{ duration: 1, ease: "easeOut" }}
style={{
  background: 'radial-gradient(circle, rgba(126, 212, 193, 0.4), transparent 70%)'
}}
```

### Button Placement

```
┌─────────────────────────────────────┐
│ [Edit ✎]  [Payment ○]               │  ← Top-right corner
│                                     │
│ 🏠 Alquiler                         │
│ $150,000 estimado                   │
│                                     │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░ Progress           │
│                        [Pagado]     │  ← Status label
└─────────────────────────────────────┘
```

### Data Updates

**Context Method:**
```tsx
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
```

**Automatic Updates:**
- ✅ Individual expense `pagado` amount
- ✅ Card progress bar percentage
- ✅ Summary totals (Pagado/Pendiente)
- ✅ General balance in Inicio
- ✅ All synchronized via BudgetContext

### Animations

**Toggle Button:**
```tsx
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.9 }}
transition={{ duration: 0.3 }}
```

**Icon Transition:**
```tsx
initial={{ scale: 0, rotate: -180 }}
animate={{ scale: 1, rotate: 0 }}
exit={{ scale: 0, rotate: 180 }}
transition={{ duration: 0.3 }}
```

**Progress Bar Breathing:**
```tsx
animate={{ 
  width: `${percentage}%`,
  opacity: [1, 0.8, 1],
}}
transition={{ 
  width: { duration: 0.8, ease: "easeOut" },
  opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
}}
```

---

## 📊 3. Enhanced Evolution Chart

### Overview

Updated `EvolutionChart` to show 6 months (Jun → Nov) with twin bars, tooltips, and breathing animations.

### Data Structure

```tsx
interface MonthData {
  mes: string;
  ingresos: number;
  gastos: number;
  balance: number;
}

const data: MonthData[] = [
  { mes: 'Jun', ingresos: 400000, gastos: 195000, balance: 205000 },
  { mes: 'Jul', ingresos: 410000, gastos: 210000, balance: 200000 },
  // ... 6 months total
];
```

### Visual Design

**Twin Bar Layout:**
```
┌─────────────────────────────────────┐
│  ╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗│
│  ║▓▓▓║ ║▓▓▓║ ║▓▓▓║ ║▓▓▓║ ║▓▓▓║ ║▓▓▓║│
│  ║▓▓▓║ ║▓▓▓║ ║▓▓▓║ ║▓▓▓║ ║▓▓▓║ ║▓▓▓║│
│  ║▓▒▒║ ║▓▒▒║ ║▓▒▒║ ║▓▒▒║ ║▓▒▒║ ║▓▒▒║│
│  ╚╤═╤╝ ╚╤═╤╝ ╚╤═╤╝ ╚╤═╤╝ ╚╤═╤╝ ╚╤═╤╝│
│   │ │   │ │   │ │   │ │   │ │   │ │ │
│  Jun   Jul   Ago   Sep   Oct   Nov  │
└─────────────────────────────────────┘
   ▓ = Ingresos (Aqua)
   ▒ = Gastos (Copper)
```

### Hover Tooltips

**Tooltip Appearance:**
```
        ┌──────────────────┐
        │  Nov 2025        │
        │  ━━━━━━━━━━━━━  │
        │  ● Ingresos 440k │
        │  ● Gastos   205k │
        │  ━━━━━━━━━━━━━  │
        │  Balance    235k │
        └────────┬─────────┘
                 │
        ╔═══╗ ╔═══╗
        ║▓▓▓║ ║▒▒▒║  ← Bars breathing
        ╚═══╝ ╚═══╝
```

**Tooltip Styling:**
```tsx
rounded-2xl 
bg-white/95 
backdrop-blur-md 
border border-white/40 
shadow-xl 
p-3
```

**Content:**
- Month and year
- Ingresos with aqua indicator
- Gastos with copper indicator
- Balance (colored by sign)
- Arrow pointing to bars

### Animations

**Bar Entrance:**
```tsx
initial={{ height: 0 }}
animate={{ height: `${percentage}%` }}
transition={{ 
  duration: 0.7, 
  delay: index * 0.06, 
  ease: "easeOut" 
}}
```

**Breathing on Hover:**
```tsx
animate={{ 
  scale: isHovered ? [1, 1.05, 1] : 1 
}}
transition={{ 
  duration: 0.4, 
  repeat: isHovered ? Infinity : 0, 
  ease: "easeInOut" 
}}
```

**Tooltip Entrance:**
```tsx
initial={{ opacity: 0, y: 10, scale: 0.9 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 10, scale: 0.9 }}
transition={{ duration: 0.2 }}
```

### Gridlines

**Soft Y-Axis:**
- 5 horizontal lines
- Color: `#0F3C3B`
- Opacity: 10%
- No harsh edges
- Pointer-events: none

### Summary Footer

```
┌─────────────────────────────────────┐
│ ▓ Ingresos  ▒ Gastos                │
│ Promedio combinado        $XXXk     │
└─────────────────────────────────────┘
```

---

## 🎨 Visual & Motion Integration

### Transition Timings

| Interaction | Duration | Easing | Repeat |
|-------------|----------|--------|--------|
| Edit activate | 200ms | easeOut | Once |
| Glow pulse | 1500ms | easeInOut | Infinite |
| Save confirm | 300ms | easeOut | Once |
| Toggle icon | 300ms | easeOut | Once |
| Wave ripple | 1000ms | easeOut | Once |
| Progress bar | 800ms | easeOut | Once |
| Bar entrance | 700ms | easeOut | Once |
| Breathing | 400ms | easeInOut | Infinite |
| Tooltip | 200ms | easeOut | Once |

### Color Consistency

All states maintain ῥέω's palette:

**Ingresos/Income:**
- Primary: `#7ED4C1` (aqua)
- Background: `rgba(126, 212, 193, 0.2)`
- Glow: `rgba(126, 212, 193, 0.4)`

**Gastos/Expenses:**
- Primary: `#C78C60` (copper)
- Background: `rgba(199, 140, 96, 0.2)`
- Glow: `rgba(199, 140, 96, 0.4)`

**Neutral:**
- Primary: `#0F3C3B` (petroleum)
- Background: `rgba(15, 60, 59, 0.1)`

**Gradients:**
- Paid status: `linear-gradient(135deg, #C78C60 0%, #7ED4C1 100%)`
- Progress full: `linear-gradient(90deg, #7ED4C1, #7ED4C1)`
- Progress partial: `linear-gradient(90deg, #C78C60, #7ED4C1)`

---

## 🔧 Context Integration

### Updated BudgetContext

**New Properties:**
```tsx
interface BudgetContextType {
  // ... existing
  budgetName: string;
  setBudgetName: (name: string) => void;
  updatePersonName: (id: string, newName: string) => void;
  updateExpenseName: (id: string, newName: string) => void;
  toggleExpensePaid: (id: string) => void;
}
```

**New BudgetItem Property:**
```tsx
interface BudgetItem {
  id: string;
  concepto: string;
  montoEstimado: number;
  pagado: number;
  isPagado?: boolean;  // ← NEW
  icon?: any;
}
```

### Data Flow

```
User Interaction
    ↓
Component Handler
    ↓
Context Method
    ↓
State Update
    ↓
Re-render All Connected Components
    ↓
Smooth Animations
```

**Example Flow:**
1. User clicks payment toggle
2. `toggleExpensePaid(id)` called
3. Context updates expense state
4. CasitaBudget re-renders with new data
5. Progress bar animates
6. Totals recalculate
7. FlowingBalanceChart updates
8. All transitions smooth (200-400ms)

---

## 🎯 User Interactions

### Editing Person Name

**Steps:**
1. Navigate to Presupuesto → Ingresos del mes
2. Hover over "Paola" or "Jorge"
3. See pencil icon appear
4. Double-click name OR click pencil
5. Input activates with aqua/copper glow
6. Type new name
7. Press Enter or click outside
8. Checkmark fades in
9. Name updates with smooth transition

**Keyboard:**
- `Enter`: Save changes
- `Escape`: Cancel and restore

### Editing Budget/Category Name

**Same pattern as person name:**
- Budget name: At top of Presupuesto Casita
- Category name: Each expense card

### Marking Expense as Paid

**Steps:**
1. Navigate to Presupuesto → Presupuesto Casita
2. Find expense card (e.g., "Agua")
3. Click circular button (top-right)
4. Icon rotates and changes: ○ → ✔
5. Wave ripple emanates
6. Background gradients to copper→aqua
7. Label changes: "Pendiente" → "Pagado"
8. Progress bar fills to 100%
9. Totals update instantly

**Toggle back:**
- Click again to mark as pending
- Reverse animations
- Totals recalculate

### Viewing Chart Evolution

**Steps:**
1. Navigate to Presupuesto → Evolución mensual
2. See 6 months of twin bars
3. Hover over any month
4. Bars start breathing (subtle pulse)
5. Tooltip appears with details
6. Move mouse away
7. Tooltip fades out
8. Bars stop breathing

---

## 📱 Responsive Behavior

### Mobile (375px)

**Editable Fields:**
- Touch to activate (no double-tap needed)
- Larger tap targets (44px minimum)
- Soft keyboard appears
- Full-width input if needed

**Payment Toggle:**
- Increased size: 48px × 48px
- Easier thumb access
- Same animations (slightly slower: 350ms)

**Chart:**
- Reduced bar width
- Tooltip adjusted for small screen
- Touch to show tooltip (not hover)

### Tablet (1024px)

**Editable Fields:**
- Hybrid touch/mouse support
- Pencil icon visible on hover
- Double-tap or click to edit

**Payment Toggle:**
- Standard size: 40px × 40px
- Hover states enabled

**Chart:**
- Full visualization
- Hover tooltips
- Smooth transitions

### Desktop (1440px)

**Editable Fields:**
- Full hover states
- Pencil icon on hover only
- Double-click to edit
- Keyboard shortcuts

**Payment Toggle:**
- Hover effects
- Cursor pointer
- Smooth animations

**Chart:**
- Full detail
- Interactive tooltips
- Breathing animations

---

## ✨ Accessibility

### Keyboard Navigation

**Editable Fields:**
- `Tab`: Navigate between fields
- `Enter`: Activate edit mode
- `Enter`: Save changes
- `Escape`: Cancel edit
- `Tab`: Exit and save

**Payment Toggle:**
- `Tab`: Focus button
- `Space` or `Enter`: Toggle status
- Visual focus indicator

**Chart:**
- `Tab`: Navigate months
- `Enter`: Show tooltip
- `Escape`: Hide tooltip

### Screen Readers

**Editable Fields:**
```html
<input 
  aria-label="Editar nombre de persona"
  placeholder="Escribir..."
/>
```

**Payment Toggle:**
```html
<button 
  aria-label="Marcar como pagado"
  aria-pressed={isPagado}
/>
```

**Chart:**
```html
<div 
  role="img"
  aria-label="Gráfico de evolución mensual"
/>
```

### Focus Indicators

- Visible 2px outline
- Color: Aqua for income, Copper for expense
- Offset: 2px
- Border-radius: Matches element

---

## 🎨 Design Principles

### Organic Interactions

**Everything breathes:**
- Edit mode: Pulsing glow
- Payment toggle: Wave ripple
- Chart bars: Breathing on hover
- Progress bars: Opacity pulse

**Soft, not sharp:**
- Rounded corners: 24px minimum
- Gradual color transitions
- Smooth shadows
- No harsh borders

**Calm timing:**
- Fast enough: ≥200ms
- Slow enough: ≤400ms
- Never jarring
- Always complete

### Minimal Contrast

**Read mode:**
- Labels at 100% opacity
- Icons at 0% (reveal on hover)

**Edit mode:**
- Input background: white/60
- Border: Colored at 40% opacity
- Glow: Colored at 40% opacity

**Feedback:**
- Checkmark: Full color
- Ripple: 40% → 0% opacity
- Breathing: 80% → 100% → 80%

---

## 🚀 Future Enhancements

### Potential Additions

- [ ] Drag-to-reorder expense categories
- [ ] Bulk edit mode (select multiple)
- [ ] Undo/redo for edits
- [ ] Edit history log
- [ ] Custom icons for categories
- [ ] Color picker for person names
- [ ] Chart date range selector
- [ ] Export chart as image
- [ ] Partial payment amounts (slider)
- [ ] Recurring expense templates
- [ ] Payment due dates
- [ ] Reminders for pending payments

### Planned Features

- Voice input for edits
- AI-suggested category names
- Smart payment predictions
- Collaborative editing
- Sync across devices

---

## 📋 Summary

**What's New:**

✅ **Inline Editing**
- Person names (Paola, Jorge)
- Budget name (Presupuesto Casita)
- Expense categories (Alquiler, etc.)
- Smooth animations and feedback

✅ **Payment Status**
- Toggle paid/pending per expense
- Wave ripple animation
- Auto-update totals
- Visual status indicators

✅ **Enhanced Chart**
- 6 months (Jun → Nov)
- Twin bars (income/expense)
- Interactive tooltips
- Breathing animations
- Soft gridlines

**Maintained:**

✅ Calm, organic aesthetic
✅ Soft color palette
✅ Breathing animations
✅ 200-400ms transitions
✅ Beige-petroleum gradient
✅ Unified data flow

*"Tu economía se adapta y respira contigo."*

— ῥέω interactive features for a living, breathing budget experience
