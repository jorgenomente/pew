# ῥέω — Breakpoint Reference Guide

Quick reference for ῥέω's responsive design system.

---

## 📐 Breakpoint Matrix

| Breakpoint | Width | Font Base | Grid | Container | Padding | Usage |
|------------|-------|-----------|------|-----------|---------|-------|
| **Mobile** | 375px | 14px | 4 col | 100% | 24px | Phones, portrait |
| **Tablet** | 1024px | 15px | 8 col | 1024px | 32px | iPad, landscape phones |
| **Desktop** | 1440px | 16px | 12 col | 1280px | 48px | Laptops, monitors |

---

## 🎯 Layout Patterns

### Inicio Screen

```
┌─────────── DESKTOP (1440px) ───────────┐
│  Resumen [50%]    │  Movimientos [50%] │
│  232px height     │  Card list         │
└────────────────────────────────────────┘

┌─────────── TABLET (1024px) ────────────┐
│  Resumen [50%]    │  Movimientos [50%] │
│  Compressed       │  Compressed        │
└────────────────────────────────────────┘

┌─────────── MOBILE (375px) ─────────────┐
│  Resumen [100%]                        │
├────────────────────────────────────────┤
│  Movimientos [100%]                    │
│  Stacked cards                         │
└────────────────────────────────────────┘
```

### Presupuesto Screen

```
┌──────────── DESKTOP (1440px) ────────────┐
│  Left [50%]        │  Right [50%]        │
│  ├─ Ingresos       │  ├─ Evolución       │
│  └─ Resumen        │  └─ Casita          │
└───────────────────────────────────────────┘

┌──────────── TABLET (1024px) ─────────────┐
│  Left [50%]        │  Right [50%]        │
│  Same structure, fluid sizing            │
└───────────────────────────────────────────┘

┌──────────── MOBILE (375px) ──────────────┐
│  Ingresos [100%]                         │
├──────────────────────────────────────────┤
│  Resumen [100%]                          │
├──────────────────────────────────────────┤
│  Evolución [100%]                        │
├──────────────────────────────────────────┤
│  Casita [100%]                           │
└──────────────────────────────────────────┘
```

---

## 📏 Component Sizes

### Cards (All Breakpoints)
```
Border Radius:  24px (rounded-3xl)
Padding:        24px (p-6)
Shadow:         shadow-lg
Min Height:     88-232px (varies by type)
```

### Typography Scale

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| H1 | 32px | 30px | 28px |
| H2 (Section) | 18px | 17px | 16px |
| H3 (Card) | 16px | 16px | 15px |
| Body | 16px | 15px | 14px |
| Small | 14px | 13px | 12px |
| Values | 24-32px | 22-28px | 20-24px |

### Spacing

| Purpose | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Section Gap | 40px | 32px | 24px |
| Card Gap | 24px | 20px | 16px |
| Element Gap | 16px | 12px | 12px |
| Micro Gap | 8px | 8px | 8px |

---

## 🎨 Visual Examples

### FlowingBalanceChart

**Desktop (1440px):**
- Width: 50% (col-span-6)
- Height: 232px
- Wave animation: Full detail
- Labels: Both visible

**Tablet (1024px):**
- Width: 50% (col-span-6)
- Height: 232px
- Wave animation: Simplified
- Labels: Both visible

**Mobile (375px):**
- Width: 100% (col-span-12)
- Height: 200px
- Wave animation: Basic
- Labels: Stacked or hidden

### IncomeCard

**Desktop:**
```
┌─────────────────────────────────┐
│ 👤 Paola    1 Nov    [Edit] ✎  │
│ Salario mensual                 │
│ $200,000        45% del total   │
│                            ✓    │
└─────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────────┐
│ 👤 Paola    1 Nov  ✎   │
│ Salario mensual         │
│ $200,000                │
│ 45% del total      ✓   │
└─────────────────────────┘
```

---

## 🔧 CSS Media Queries

```css
/* Mobile First */
.card {
  padding: 24px;
  width: 100%;
}

/* Tablet */
@media (min-width: 769px) {
  .card {
    padding: 24px;
    width: calc(50% - 12px);
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .card {
    padding: 24px;
    width: calc(50% - 12px);
  }
}
```

---

## 📱 Touch Targets (Mobile)

```
Minimum Size:  44px × 44px
Recommended:   48px × 48px
Button Padding: 16px
Icon Size:     20-24px
Gap:           12px minimum
```

---

## 🎯 Grid System

### Desktop (12 columns)
```
[1][2][3][4][5][6][7][8][9][10][11][12]
└─────── 6 ──────┘└─────── 6 ──────┘
     50%                 50%
```

### Tablet (8 columns, fluid)
```
[1][2][3][4][5][6][7][8]
└──── 4 ────┘└─── 4 ───┘
    50%          50%
```

### Mobile (Single column)
```
[────────────────]
    100% width
```

---

## ✅ Testing Checklist

For each breakpoint, verify:

**Layout:**
- [ ] No horizontal overflow
- [ ] Proper card stacking
- [ ] Correct column spans
- [ ] Spacing consistency

**Typography:**
- [ ] Readable font sizes
- [ ] Proper line heights
- [ ] No text clipping
- [ ] Correct hierarchy

**Interactions:**
- [ ] Buttons clickable/tappable
- [ ] Modals properly sized
- [ ] Forms usable
- [ ] Navigation accessible

**Performance:**
- [ ] Fast load times
- [ ] Smooth animations
- [ ] No jank on scroll
- [ ] Images optimized

---

## 🚀 Quick Commands

**Open Responsive Preview:**
- Keyboard: `Ctrl+Shift+P` / `Cmd+Shift+P`
- Button: Bottom-right floating button
- Toggle after 2 seconds

**View Modes:**
- All: See all 3 breakpoints
- Single: Focus on one device
- Normal: Exit preview mode

---

## 📊 Common Patterns

### Two-Column to Single
```tsx
className="col-span-12 lg:col-span-6"
```

### Three-Column to Single
```tsx
className="col-span-12 md:col-span-6 lg:col-span-4"
```

### Hide on Mobile
```tsx
className="hidden md:block"
```

### Show Only on Mobile
```tsx
className="block md:hidden"
```

### Responsive Text Size
```tsx
style={{ fontSize: '18px' }} // Explicit
className="text-lg"           // Responsive
```

---

## 🎨 Color Consistency

All breakpoints maintain:
- Same color palette
- Same gradients
- Same opacity values
- Same shadow depths

**Colors:**
- Aqua: `#7ED4C1`
- Copper: `#C78C60`
- Petroleum: `#0F3C3B`
- Sand: `#E9E5DA`

---

*Quick reference for ῥέω's responsive behavior across all devices.*
