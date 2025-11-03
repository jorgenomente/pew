# ῥέω — Responsive 12-Column Grid System

## Overview
The ῥέω finance app now uses a responsive 12-column grid system across all major sections, ensuring optimal layouts across mobile, tablet, and desktop devices.

## Breakpoints
- **Mobile**: `col-span-12` (default, < 768px)
- **Tablet**: `md:col-span-X` (≥ 768px)
- **Desktop**: `lg:col-span-X` (≥ 1024px)

---

## Layout Structure

### 1. Home Screen (`activeTab === 'home'`)

```
┌─────────────────────────────────────────┐
│  Mobile (12 cols)                       │
│  ┌───────────────────────────────────┐  │
│  │ Resumen (12)                      │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Movimientos (12)                  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Desktop (12 cols)                      │
│  ┌──────────────────┐  ┌─────────────┐  │
│  │ Resumen (7)      │  │ Movimientos │  │
│  │                  │  │ (5)         │  │
│  └──────────────────┘  └─────────────┘  │
└─────────────────────────────────────────┘
```

### 2. Presupuesto Section (`activeTab === 'budget'`)

```
┌─────────────────────────────────────────┐
│  Mobile (12 cols)                       │
│  ┌───────────────────────────────────┐  │
│  │ Ingresos del mes (12)             │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Resumen mensual (12)              │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Evolución (12)                    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Presupuesto Casita (12)           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Tablet (12 cols)                       │
│  ┌──────────┐  ┌──────────┐             │
│  │ Ingresos │  │ Resumen  │             │
│  │ (6)      │  │ (6)      │             │
│  └──────────┘  └──────────┘             │
│  ┌───────────────────────────────────┐  │
│  │ Evolución (12)                    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Presupuesto Casita (12)           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Desktop (12 cols)                      │
│  ┌──────────────────┐  ┌─────────────┐  │
│  │ Ingresos (7)     │  │ Resumen (5) │  │
│  └──────────────────┘  └─────────────┘  │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ Evolución   │  │ Presupuesto      │  │
│  │ (5)         │  │ Casita (7)       │  │
│  └─────────────┘  └──────────────────┘  │
└─────────────────────────────────────────┘
```

### 3. Budget History

```
┌─────────────────────────────────────────┐
│  Mobile (12 cols)                       │
│  ┌───────────────────────────────────┐  │
│  │ Oct 2025 (12)                     │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Sep 2025 (12)                     │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Ago 2025 (12)                     │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Jul 2025 (12)                     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Tablet (12 cols)                       │
│  ┌──────────┐  ┌──────────┐             │
│  │ Oct 2025 │  │ Sep 2025 │             │
│  │ (6)      │  │ (6)      │             │
│  └──────────┘  └──────────┘             │
│  ┌──────────┐  ┌──────────┐             │
│  │ Ago 2025 │  │ Jul 2025 │             │
│  │ (6)      │  │ (6)      │             │
│  └──────────┘  └──────────┘             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Desktop (12 cols)                      │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐         │
│  │Oct │  │Sep │  │Ago │  │Jul │         │
│  │(3) │  │(3) │  │(3) │  │(3) │         │
│  └────┘  └────┘  └────┘  └────┘         │
└─────────────────────────────────────────┘
```

### 4. Categorías Section

```
┌─────────────────────────────────────────┐
│  Mobile & Tablet (12 cols)              │
│  ┌───────────────────────────────────┐  │
│  │ CategoryWheel (12)                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Desktop (12 cols) — Centered           │
│  ┌─┐  ┌─────────────────────┐  ┌─┐     │
│  │ │  │ CategoryWheel (8)   │  │ │     │
│  │ │  │ Starts at col 3     │  │ │     │
│  └─┘  └─────────────────────┘  └─┘     │
└─────────────────────────────────────────┘
```

### 5. Metas Section

```
┌─────────────────────────────────────────┐
│  All Devices (12 cols)                  │
│  ┌───────────────────────────────────┐  │
│  │ GoalRipple (12)                   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Responsive Components

### Cards & Typography
All cards now include responsive sizing:
- Padding: `p-4 sm:p-6`
- Text: `text-sm sm:text-base`
- Icons: `w-4 h-4 sm:w-5 sm:h-5`
- Gaps: `gap-2 sm:gap-3`

### Charts
- **MonthlyChart**: Donut size `w-40 h-40 sm:w-48 sm:h-48`
- **EvolutionChart**: Height `h-40 sm:h-48`, bar height `120px`
- **FlowingBalanceChart**: Height `h-40 sm:h-48`

### Buttons
- Size: `w-9 h-9 sm:w-10 sm:h-10`
- Text visibility: `<span className="hidden sm:inline">Text</span>`

---

## Implementation Notes

1. **Grid Container**: All main sections use `grid grid-cols-12`
2. **Gap Spacing**: `gap-4 md:gap-6` for consistent spacing
3. **Responsive Classes**: Follow mobile-first approach
4. **Truncation**: Long text uses `truncate` class with `min-w-0`
5. **Flex Shrink**: Critical elements use `flex-shrink-0`

---

## Benefits

✅ **Flexible layouts** that adapt to any screen size
✅ **Consistent spacing** across all devices
✅ **Optimal content density** for each viewport
✅ **Improved readability** on mobile devices
✅ **Better use of space** on large screens
✅ **Maintained aesthetic** — calm, organic flow preserved

---

*"Tu flujo financiero, mes a mes. Claridad, calma y continuidad."*
