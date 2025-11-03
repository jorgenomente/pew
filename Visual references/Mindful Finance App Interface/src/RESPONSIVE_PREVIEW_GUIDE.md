# ῥέω — Responsive Preview System

## Overview
A comprehensive responsive preview system that allows developers and designers to view the app simultaneously at three key breakpoints: 1440px (Desktop), 1024px (Tablet), and 375px (Mobile).

---

## 🎯 Features

### Multi-Breakpoint View
- **Desktop (1440px)**: Full 12-column grid layout
- **Tablet (1024px)**: 8-column responsive grid
- **Mobile (375px)**: Single-column mobile layout

### Interactive Controls
- **All Devices View**: See all three breakpoints side by side
- **Single Device View**: Focus on one breakpoint at a time
- **Keyboard Shortcut**: `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
- **Visual Toggle**: Floating button in bottom-right corner

### Visual Indicators
- Device icons and labels
- Current breakpoint width display
- Scale percentage indicator
- Grid column information
- macOS-style window controls

---

## 📱 Breakpoint Specifications

### Desktop (1440px)
```
Width:     1440px
Scale:     85% (full view) / 28% (multi view)
Grid:      12 columns
Container: max-width 1280px
Padding:   48px (px-12)
Font:      16px base
```

**Layout:**
- Two-column cards (50/50 split)
- Full chart visibility
- Expanded navigation
- All features visible

### Tablet (1024px)
```
Width:     1024px
Scale:     85% (full view) / 28% (multi view)
Grid:      8 columns (fluid)
Container: max-width 1024px
Padding:   32px (px-8)
Font:      15px base
```

**Layout:**
- Responsive card sizing
- Stacked charts on smaller tablets
- Compact navigation
- Touch-optimized interactions

### Mobile (375px)
```
Width:     375px
Scale:     85% (full view) / 28% (multi view)
Grid:      4 columns (single stack)
Container: 100% width
Padding:   24px (px-6)
Font:      14px base
```

**Layout:**
- Single column stack
- Compressed charts
- Bottom navigation only
- Touch-first design

---

## 🚀 Usage

### Activation Methods

**Method 1: Floating Button**
1. Look for the circular button in bottom-right corner
2. Icon: `Maximize2` (expand arrows)
3. Appears 2 seconds after page load
4. Click to open responsive preview

**Method 2: Keyboard Shortcut**
- Windows: `Ctrl + Shift + P`
- Mac: `Cmd + Shift + P`
- Instantly toggles preview mode

**Method 3: Programmatic**
```tsx
import { ResponsiveWrapper } from './components/ResponsiveWrapper';

<ResponsiveWrapper enablePreview={true}>
  <YourApp />
</ResponsiveWrapper>
```

### View Modes

**All Devices (Default)**
```
┌──────────┬──────────┬──────────┐
│ Desktop  │  Tablet  │  Mobile  │
│ 1440px   │  1024px  │  375px   │
│          │          │          │
│  [App]   │  [App]   │  [App]   │
└──────────┴──────────┴──────────┘
```

**Single Device**
Click any device button to focus:
```
┌─────────────────────────────────┐
│         Desktop Preview         │
│            1440px               │
│                                 │
│            [App]                │
│                                 │
└─────────────────────────────────┘
```

---

## 🎨 Visual Design

### Preview Panel Structure
```
┌───────────────────────────────────┐
│ 🖥️ Desktop          1440px    ●●● │  ← Header
├───────────────────────────────────┤
│                                   │
│                                   │
│         Scaled App View           │  ← Content
│                                   │
│                                   │
├───────────────────────────────────┤
│ Escala: 85%    Grid: 12 columnas │  ← Footer
└───────────────────────────────────┘
```

### Color Scheme

**Background:**
- Base: `#0F3C3B` (petroleum green)
- Overlay: `white/10` with backdrop-blur

**Panel:**
- Header: `white/10` backdrop-blur
- Content: `white/5` backdrop-blur
- Border: `white/20`

**Controls:**
- Active: `white` with dark text
- Inactive: `white/60` text
- Hover: `white` text

### Window Controls
macOS-inspired dots:
- 🔴 Red: Close preview
- 🟡 Yellow: Minimize (visual only)
- 🟢 Green: Maximize (visual only)

---

## 🔧 Technical Implementation

### Component Architecture
```
ResponsiveWrapper
├── enablePreview prop
├── Keyboard listener (Ctrl+Shift+P)
├── Floating toggle button
└── ResponsivePreview
    ├── Header controls
    ├── Breakpoint selector
    └── PreviewPanel (x3)
        ├── Device info header
        ├── Scaled iframe container
        └── Scale/grid info footer
```

### Scaling Logic
```tsx
const scale = isFullView ? 0.85 : 0.28;

<div style={{
  width: `${breakpoint.width}px`,
  transform: `scale(${scale})`,
  transformOrigin: 'top left',
  height: `calc(100% / ${scale})`,
}}>
  {children}
</div>
```

**Calculation:**
- Full view: 85% scale (comfortable viewing)
- Multi view: 28% scale (fit 3 panels)
- Transform origin: top-left (prevents jumping)
- Height compensation: `100% / scale` (proper scrolling)

### Responsive Breakpoints in Code

```css
/* Mobile */
@media (max-width: 768px) {
  html { font-size: 14px; }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  html { font-size: 15px; }
}

/* Desktop */
@media (min-width: 1025px) {
  html { font-size: 16px; }
}
```

---

## 📊 Layout Comparison

### Inicio Screen

**Desktop (1440px):**
```
┌─────────────────────┬─────────────────────┐
│ Resumen (50%)       │ Movimientos (50%)   │
│ FlowingBalance      │ TransactionCard x4  │
│ 232px height        │ Vertical scroll     │
└─────────────────────┴─────────────────────┘
```

**Tablet (1024px):**
```
┌─────────────────────┬─────────────────────┐
│ Resumen (50%)       │ Movimientos (50%)   │
│ Slightly compressed │ Slightly compressed │
└─────────────────────┴─────────────────────┘
```

**Mobile (375px):**
```
┌───────────────────────────────────────────┐
│ Resumen (100%)                            │
│ FlowingBalance                            │
├───────────────────────────────────────────┤
│ Movimientos (100%)                        │
│ TransactionCard (stacked)                 │
└───────────────────────────────────────────┘
```

### Presupuesto Screen

**Desktop (1440px):**
```
┌──────────────────────┬──────────────────────┐
│ LEFT COLUMN (50%)    │ RIGHT COLUMN (50%)   │
├──────────────────────┼──────────────────────┤
│ Ingresos del mes     │ Evolución mensual    │
│ IncomeCard x2        │ EvolutionChart       │
│                      │                      │
│ Resumen mensual      │ Presupuesto Casita   │
│ MonthlyChart         │ CasitaBudget         │
└──────────────────────┴──────────────────────┘
```

**Tablet (1024px):**
```
┌──────────────────────┬──────────────────────┐
│ LEFT (50%)           │ RIGHT (50%)          │
│ Compressed charts    │ Compressed charts    │
│ Same two-column      │ Smaller fonts        │
└──────────────────────┴──────────────────────┘
```

**Mobile (375px):**
```
┌───────────────────────────────────────────┐
│ Ingresos del mes                          │
│ IncomeCard (stacked)                      │
├───────────────────────────────────────────┤
│ Resumen mensual                           │
│ MonthlyChart (compressed)                 │
├───────────────────────────────────────────┤
│ Evolución mensual                         │
│ EvolutionChart (compressed)               │
├───────────────────────────────────────────┤
│ Presupuesto Casita                        │
│ CasitaBudget (single column)              │
└───────────────────────────────────────────┘
```

---

## 🎯 Testing Scenarios

### Visual Testing Checklist

**Layout Integrity:**
- [ ] Cards maintain aspect ratios at all breakpoints
- [ ] Text remains readable at all scales
- [ ] No horizontal overflow
- [ ] Proper spacing maintained

**Typography:**
- [ ] Desktop: 16px base, headers 18px
- [ ] Tablet: 15px base, headers 17px
- [ ] Mobile: 14px base, headers 16px
- [ ] Line heights consistent

**Grid Behavior:**
- [ ] Desktop: 12 columns, 50/50 splits
- [ ] Tablet: Fluid columns, proper gaps
- [ ] Mobile: Single column, full width

**Charts & Graphs:**
- [ ] MonthlyChart donut maintains proportion
- [ ] EvolutionChart bars scale correctly
- [ ] FlowingBalance waves animate smoothly
- [ ] All labels visible and non-overlapping

**Navigation:**
- [ ] BottomNavigation always accessible
- [ ] Icons properly sized for touch
- [ ] Active states clear at all sizes

**Interactions:**
- [ ] Buttons remain clickable
- [ ] Modals centered and sized properly
- [ ] Hover states work on desktop/tablet
- [ ] Touch targets 44px minimum on mobile

---

## 🔍 Debug Information

### Scale Indicators
Each preview panel shows:
- **Escala**: Current zoom percentage
- **Grid**: Number of columns active
- **Width**: Exact pixel width

### Useful Metrics

**Desktop 1440px @ 28% scale:**
- Visible width: ~403px
- Visible height: ~224px per 800px container
- Text legibility: Good for headlines

**Tablet 1024px @ 28% scale:**
- Visible width: ~287px
- Visible height: ~224px per 800px container
- Text legibility: Readable

**Mobile 375px @ 28% scale:**
- Visible width: ~105px
- Visible height: ~224px per 800px container
- Text legibility: Layout preview only

**Full View @ 85% scale:**
- Much better readability
- Interactive testing possible
- Near-actual size

---

## 💡 Pro Tips

### Best Practices

**Development:**
1. Start with mobile-first design
2. Test each breakpoint individually
3. Use full view for interaction testing
4. Use multi view for layout comparison

**Design Review:**
1. Check visual hierarchy at all sizes
2. Verify color contrast at small scales
3. Ensure touch targets are adequate
4. Test with real content, not Lorem Ipsum

**Performance:**
1. Preview mode renders 3 instances in multi-view
2. Consider disabling in production builds
3. Use `enablePreview={false}` to disable completely

### Keyboard Workflow
```
1. Ctrl+Shift+P  → Open preview
2. Click "All"   → View all breakpoints
3. Click device  → Focus one breakpoint
4. Test feature  → Verify behavior
5. Click "X"     → Close preview
6. Repeat
```

---

## 🎨 Customization

### Disable Preview in Production
```tsx
<ResponsiveWrapper enablePreview={process.env.NODE_ENV === 'development'}>
  <App />
</ResponsiveWrapper>
```

### Custom Breakpoints
Edit `/components/ResponsivePreview.tsx`:
```tsx
const breakpoints: Breakpoint[] = [
  { name: 'desktop', width: 1920, icon: Monitor, label: '4K' },
  { name: 'laptop', width: 1440, icon: Monitor, label: 'Laptop' },
  { name: 'tablet', width: 1024, icon: Tablet, label: 'Tablet' },
  { name: 'mobile', width: 375, icon: Smartphone, label: 'Mobile' },
];
```

### Custom Scales
```tsx
const scale = isFullView ? 0.90 : 0.25; // Adjust as needed
```

---

## 📋 Component Files

### Created Files
```
/components/ResponsivePreview.tsx
  - Main preview component
  - Multi-panel layout
  - Breakpoint controls

/components/ResponsiveWrapper.tsx
  - App wrapper component
  - Keyboard listener
  - Toggle button

/components/BreakpointIndicator.tsx
  - On-screen breakpoint display
  - Shows current width
  - Auto-hides after 3 seconds
```

### Integration
```tsx
// App.tsx
import { ResponsiveWrapper } from './components/ResponsiveWrapper';

export default function App() {
  return (
    <BudgetProvider>
      <ResponsiveWrapper enablePreview={true}>
        <AppContent />
      </ResponsiveWrapper>
    </BudgetProvider>
  );
}
```

---

## 🎯 Use Cases

### Designer Review
- View all breakpoints simultaneously
- Compare proportions and spacing
- Identify inconsistencies quickly
- Share screenshots with team

### Developer Testing
- Test responsive behavior
- Debug layout issues
- Verify media query breakpoints
- Check cross-device consistency

### Client Presentation
- Demo responsive design
- Show mobile-first approach
- Highlight adaptive features
- Build confidence in quality

### QA Testing
- Systematic breakpoint testing
- Document layout bugs
- Verify ticket requirements
- Regression testing

---

## 🚀 Future Enhancements

### Potential Additions
- [ ] Screenshot/export functionality
- [ ] Rotation for landscape/portrait
- [ ] Custom device presets (iPhone, iPad, etc.)
- [ ] Network throttling simulation
- [ ] Touch event emulation
- [ ] Grid overlay visualization
- [ ] Spacing measurement tools
- [ ] Color contrast checker
- [ ] Accessibility scanner

### Planned Features
- URL sharing of specific breakpoint views
- Recording mode for demos
- Side-by-side comparison mode
- Historical layout snapshots

---

## ✨ Summary

The responsive preview system provides:
- **3 key breakpoints**: 1440px, 1024px, 375px
- **Flexible viewing**: All at once or focused
- **Easy activation**: Button or keyboard shortcut
- **Developer-friendly**: Clear indicators and metrics
- **Production-ready**: Can be disabled easily

Perfect for:
- ✅ Design reviews
- ✅ Development testing
- ✅ Client presentations
- ✅ QA verification
- ✅ Documentation screenshots

*"Visualiza tu flujo en todos los dispositivos — desde el escritorio hasta el bolsillo."*

— ῥέω responsive preview system for comprehensive device testing
