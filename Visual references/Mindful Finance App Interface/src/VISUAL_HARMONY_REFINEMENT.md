# ῥέω — Visual Harmony Refinement

## Overview
Complete rebalancing of Inicio and Presupuesto layouts to restore visual harmony, consistent spacing, and proportional alignment across all cards and sections while maintaining ῥέω's organic, serene aesthetic.

---

## 🎯 Layout System

### 12-Column Grid
- **Max width**: 1280px
- **Horizontal gutters**: 24px (gap-6)
- **Vertical spacing**: 40px (space-y-10)
- **Container padding**: 
  - Mobile: 24px (px-6)
  - Tablet: 32px (px-8)
  - Desktop: 48px (px-12)

### Consistent Card Properties
All cards now share:
- **Border radius**: 24px (rounded-3xl)
- **Internal padding**: 24px (p-6)
- **Shadow depth**: shadow-lg
- **Backdrop blur**: backdrop-blur-md
- **Border**: border-white/30

---

## 🏠 Inicio (Home) Screen Refinements

### Layout Structure
```
┌────────────────────────────────────────┐
│  Header (ῥέω — finanzas que fluyen)   │
├──────────────────┬─────────────────────┤
│  Resumen         │  Movimientos        │
│  (50% width)     │  (50% width)        │
│  232px height    │  Card list          │
└──────────────────┴─────────────────────┘
│  Calm message (40px breathing space)  │
└────────────────────────────────────────┘
```

### Resumen Card (FlowingBalanceChart)
**Dimensions:**
- Height: `232px` (29 × 8 = balanced 220-240px range)
- Width: 50% (col-span-6 on lg)
- Padding: 24px

**Typography:**
- Title: 18px, semi-bold (600)
- Subtitle: 14px, medium opacity
- Main value: 32px, bold (700), aqua/copper
- Labels: 14px

**Features:**
- Dynamic month name: "Balance noviembre"
- Animated wave gradients
- Floating income/expense labels
- Breathing pulse animation

### Movimientos Card
**Spacing:**
- Vertical gap: 16px (space-y-4)
- Card min-height: 88px (11 × 8)

**Typography:**
- Title: 16px, semi-bold (600)
- Category: 14px, muted (#597370)
- Amount: 18px, semi-bold (600)
- Date: 12px

**Features:**
- Fade ellipsis for long titles
- Color-coded amounts (aqua = income, copper = expense)
- Trend indicators
- Hover effects: scale 1.02, lift 2px

### Calm Message
- Top padding: 40px (py-10)
- Typography: 14px italic
- Opacity: 50% / 40%

---

## 💰 Presupuesto Screen Corrections

### Header Row
```
┌─────────────────────────────────────────┐
│ Presupuesto mensual    [Descargar 📥]  │
│ Visualizá tus ingresos y gastos        │
├─────────────────────────────────────────┤
│        Month Selector (timeline)        │
└─────────────────────────────────────────┘
```

**Alignment:**
- Export button on same row as title
- Month selector below (mb-6)
- Consistent 24px spacing

### Two-Column Layout
```
┌──────────────────────┬──────────────────────┐
│ LEFT (50%)           │ RIGHT (50%)          │
├──────────────────────┼──────────────────────┤
│ Ingresos del mes     │ Evolución mensual    │
│ (120px per card)     │ (360px height)       │
│                      │                      │
│ 40px gap             │ 40px gap             │
│                      │                      │
│ Resumen mensual      │ Presupuesto Casita   │
│ (360px height)       │ (104px per item)     │
└──────────────────────┴──────────────────────┘
```

**Vertical Spacing:**
- Between sections: 40px (space-y-10)
- Between cards: 16px (space-y-4)
- Section margins: 24px

### Typography Hierarchy

**Section Headers:**
```
Título principal
├─ Size: 18px
├─ Weight: 600 (semi-bold)
└─ Margin: 4px (mb-1)

Subtítulo
├─ Size: 14px
├─ Color: #597370
└─ Opacity: 60%
```

**Card Values:**
```
Main values
├─ Size: 24px
├─ Weight: 700 (bold)
├─ Color: #7ED4C1 / #C78C60
└─ Letter-spacing: -0.01em

Secondary values
├─ Size: 16-18px
├─ Weight: 600 (semi-bold)
└─ Context-dependent color
```

---

## 📊 Chart Refinements

### MonthlyChart (Donut)
**Dimensions:**
- Container: 360px min-height
- Chart: 192px diameter (48 × 4)
- Stroke width: 30px
- Center gap: proper proportion

**Legend:**
- Card padding: 16px (p-4)
- Font: 16px / 18px
- Icon size: 16px (w-4 h-4)
- Spacing: 12px (space-y-3)

### EvolutionChart (Bars)
**Dimensions:**
- Container: 360px min-height (matches MonthlyChart)
- Chart area: 192px height (h-48)
- Bar min-width: 12px
- Gap between bars: 6px (gap-1.5)

**Colors:**
- Paola: from-[#C78C60]/80 to-[#C78C60]/40
- Jorge: from-[#7ED4C1]/80 to-[#7ED4C1]/40
- Smooth gradients, 80% → 40% opacity

**Alignment:**
- Top edges align with MonthlyChart
- Bottom edges align perfectly
- Equal padding on all sides (24px)

---

## 🏡 Presupuesto Casita

### Header Card
- Height: Auto
- Padding: 24px (p-6)
- Icon: 44px (w-11 h-11)
- Grid: 3 columns, equal width

**Summary Boxes:**
- Padding: 16px (p-4)
- Border radius: 16px (rounded-2xl)
- Font: 16px, semi-bold

### Expense Items
**Dimensions:**
- Min-height: 104px (13 × 8)
- Padding: 24px (p-6)
- Icon container: 44px (w-11 h-11)

**Label Alignment:**
- Concept name: truncate with proper ellipsis
- Value alignment: flex-shrink-0
- No overflow issues
- Progress bar: 8px height

**Text Hierarchy:**
- Concept: 16px, semi-bold (600)
- Estimated: 12px, muted
- Paid: 16px, semi-bold (600), aqua
- Remaining: 12px, muted

---

## 📅 Historial de Presupuestos

### Card Dimensions
- Width: 180px max-width
- Height: Auto
- Padding: 24px (p-6)
- Spacing: 16px (gap-4)

### Grid Layout
```
Mobile:    2 columns (col-span-6)
Tablet:    3 columns (col-span-4)
Desktop:   4 columns (col-span-3)
```

### Hover Effects
```css
whileHover: {
  scale: 1.03,
  y: -3px,
  boxShadow: '0 8px 24px rgba(199, 140, 96, 0.25)',
  borderColor: 'rgba(199, 140, 96, 0.4)'
}
```

**Features:**
- Copper glow on hover
- Subtle upward float (3px)
- Smooth 300ms transition
- Enhanced shadow depth

### Divider
- Border-top: border-white/20
- Top padding: 40px (pt-10)
- Visual separation from Casita section

---

## 📱 Responsive Behavior

### Mobile (≤768px)
```css
html { font-size: 14px; }
```

**Layout:**
- Single column (col-span-12)
- Stacked cards
- Reduced padding (px-6)
- Hidden chart axes
- Compact spacing

### Tablet (769px - 1024px)
```css
html { font-size: 15px; }
```

**Layout:**
- 8-column grid (flexible)
- Fluid card resizing
- Medium padding (px-8)
- Proportional typography

### Desktop (>1024px)
```css
html { font-size: 16px; }
```

**Layout:**
- Full 12-column grid
- Max-width: 1280px
- Large padding (px-12)
- Full typography scale

---

## 🎨 Background & Gradients

### Main Background
```css
bg-gradient-to-br from-[#E9E5DA] via-[#E9E5DA] to-[#D5D9CE]
```

**Ambient Effects:**
- Aqua orb: top-right, breathing pulse
- Copper orb: bottom-left, delayed breathing
- Both: 96×96, blur-3xl, opacity cycle

### Card Gradients

**Primary Cards:**
```css
from-white/60 to-white/30
border-white/30
backdrop-blur-md
shadow-lg
```

**Chart Cards:**
```css
from-white/40 to-white/10
border-white/20
backdrop-blur-sm
shadow-lg
```

**Summary Cards:**
```css
from-white/50 to-white/20
border-white/30
backdrop-blur-md
```

---

## ⚡ Animation & Motion

### Transition System
```css
transition-property: color, background-color, border-color, 
                     transform, box-shadow;
transition-duration: 200ms;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

### Card Entrance
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3-0.4, delay: index * 0.06 }}
```

**Stagger Delay:**
- 60ms per card (0.06s)
- Reduced from 80ms for faster feel
- Smooth, calm entrance

### Hover States
```tsx
whileHover={{ scale: 1.02-1.03, y: -2 to -3 }}
whileTap={{ scale: 0.98 }}
```

### Tab Transitions
```tsx
<AnimatePresence mode="wait">
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.4 }}
</AnimatePresence>
```

**Effect:**
- Fade + slide when switching Inicio ↔ Presupuesto
- Smooth 400ms duration
- Wait mode prevents overlap

---

## 🎯 Visual Alignment Checks

### Vertical Alignment
✅ Chart top edges align across columns
✅ Chart bottom edges align across columns
✅ Text baselines consistent within cards
✅ Icons vertically centered with text

### Horizontal Alignment
✅ Section headers align left
✅ Action buttons align right
✅ Card edges align to grid columns
✅ Inner content respects padding

### Spacing Consistency
✅ All cards: 24px padding
✅ Section gaps: 40px
✅ Card lists: 16px spacing
✅ Typography: baseline grid maintained

### Typography Scale
✅ Headers: 18px
✅ Subheaders: 14-16px
✅ Body: 14-16px
✅ Small: 12px
✅ Values: 18-32px (context)

---

## 🌿 Aesthetic Consistency

### Color Application

**Ingresos (Income):**
- Primary: #7ED4C1 (aqua)
- Background: aqua/20 to aqua/30
- Indicators: aqua full opacity

**Gastos (Expenses):**
- Primary: #C78C60 (copper)
- Background: copper/20 to copper/30
- Indicators: copper full opacity

**Metadata:**
- Color: #597370 (petroleum)
- Opacity: 60%
- Used for: labels, dates, subtitles

**Neutral:**
- White overlays: /60, /40, /30, /20
- Borders: white/30, white/20
- Shadows: rgba with 25% opacity

### Corner Radius Hierarchy
```
Cards:        24px (rounded-3xl)
Inner boxes:  16px (rounded-2xl)
Buttons:      9999px (rounded-full)
Icons:        9999px (rounded-full)
Progress:     9999px (rounded-full)
```

### Shadow Depth
```
Cards:        shadow-lg
Buttons:      shadow-lg
Modals:       shadow-xl
History hover: custom copper glow
```

---

## 📏 Measurement Reference

### 8px Baseline Grid

| Element | Height | Calculation |
|---------|--------|-------------|
| FlowingBalance | 232px | 29 × 8 |
| TransactionCard | 88px | 11 × 8 |
| IncomeCard | 120px | 15 × 8 |
| CasitaBudget Item | 104px | 13 × 8 |
| MonthlyChart | 360px | 45 × 8 |
| EvolutionChart | 360px | 45 × 8 |
| Progress Bar | 8px | 1 × 8 |

### Spacing Scale
```
gap-3:  12px  (1.5 × 8)
gap-4:  16px  (2 × 8)
gap-6:  24px  (3 × 8)
space-y-10: 40px (5 × 8)
py-6:   24px  (3 × 8)
py-10:  40px  (5 × 8)
```

---

## ✨ Final Tagline

**Inicio:**
> "El dinero fluye con calma y propósito"

**Presupuesto:**
> "El flujo visual se equilibra con tu mes — claridad, proporción y calma."

---

## 🎯 Quality Checklist

### Layout
- [x] 12-column grid with 1280px max-width
- [x] 24px horizontal gutters
- [x] 40px vertical spacing between sections
- [x] Perfect 50/50 split on desktop

### Cards
- [x] All use 24px corner radius
- [x] All use 24px internal padding
- [x] Consistent shadow depth
- [x] Aligned top/bottom edges

### Typography
- [x] 18px section headers
- [x] 14px subtitles with #597370
- [x] 32px main balance value
- [x] Responsive scaling (14-16px)

### Charts
- [x] Equal padding on all sides
- [x] MonthlyChart = EvolutionChart height
- [x] Proportional donut and bars
- [x] Smooth color gradients

### Historial
- [x] 180px card width
- [x] 16px spacing
- [x] Copper glow on hover
- [x] 3px upward float
- [x] Divider line above section

### Responsive
- [x] Mobile: 14px font-size
- [x] Tablet: 15px font-size
- [x] Desktop: 16px font-size
- [x] Single/multi column switch

### Motion
- [x] 60ms stagger delay
- [x] 400ms tab transitions
- [x] Smooth hover effects
- [x] Breathing animations

### Alignment
- [x] Text baselines aligned
- [x] Icons vertically centered
- [x] No overflow issues
- [x] Proper truncation with fade

---

## 🚀 Result

**Perfect visual harmony restored:**
- Consistent spacing throughout
- Proportional card alignment
- Serene, organic aesthetic
- Professional polish
- Breathing, calm rhythm

*"El flujo visual se equilibra con tu mes — claridad, proporción y calma."*

— ῥέω refined layout system for complete visual harmony
