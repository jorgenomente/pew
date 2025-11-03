import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowRight, Check, Circle } from 'lucide-react';
import { UIButton } from './components/UIButton';
import { UIInput } from './components/UIInput';
import { UICard } from './components/UICard';
import { UITag } from './components/UITag';
import { UIFab } from './components/UIFab';
import { UINavigation } from './components/UINavigation';
import { UIChart } from './components/UIChart';
import { UIModal } from './components/UIModal';
import { ColorSwatch } from './components/ColorSwatch';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div 
      className="min-h-screen pb-24 relative"
      style={{
        background: 'linear-gradient(135deg, var(--beige) 0%, var(--sand) 50%, #E8E2D6 100%)'
      }}
    >
      {/* Hero Section */}
      <section className="px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div 
            className="inline-block mb-4 text-[var(--aqua)]" 
            style={{ fontSize: '48px', lineHeight: 1 }}
          >
            ῥέω
          </div>
          <h1 className="text-[var(--petroleum)] mb-3">
            UI Kit + Design System
          </h1>
          <p className="text-[var(--petroleum)] opacity-70 italic mb-2">
            Finanzas que fluyen. Oeconomia fluens.
          </p>
          <p className="text-[var(--petroleum)] opacity-60 max-w-2xl mx-auto" style={{ fontSize: 'var(--text-body)' }}>
            A serene, balanced, and flowing design system reflecting clarity, proportion, and calm for mindful finance.
          </p>
        </div>
      </section>

      {/* Colors Section */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Circle size={8} fill="var(--aqua)" stroke="var(--aqua)" />
            <h2 className="text-[var(--aqua)]">Colors</h2>
          </div>
          <p className="text-[var(--copper)] italic mb-8" style={{ fontSize: 'var(--text-caption)' }}>
            Base palette — calm, natural tones
          </p>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-white/70 backdrop-blur-md"
            style={{ 
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <ColorSwatch name="Beige" hex="#F4F1EB" varName="--beige" />
            <ColorSwatch name="Petroleum" hex="#2E4943" varName="--petroleum" />
            <ColorSwatch name="Aqua" hex="#9FD9C9" varName="--aqua" />
            <ColorSwatch name="Copper" hex="#C77D5B" varName="--copper" />
            <ColorSwatch name="Sand" hex="#D6CBBE" varName="--sand" />
            <ColorSwatch name="White" hex="#FFFFFF" varName="--white" />
          </div>

          <div className="mt-6 p-6 bg-[var(--petroleum)] text-white" style={{ borderRadius: 'var(--radius-input)' }}>
            <div className="mb-2">Semantic Tokens</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ fontSize: 'var(--text-caption)' }}>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} />
                <span>--income: aqua</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown size={16} />
                <span>--expense: copper</span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet size={16} />
                <span>--neutral: sand</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Circle size={8} fill="var(--aqua)" stroke="var(--aqua)" />
            <h2 className="text-[var(--aqua)]">Typography</h2>
          </div>
          <p className="text-[var(--copper)] italic mb-8" style={{ fontSize: 'var(--text-caption)' }}>
            Geometric Sans Humanist — clarity & proportion
          </p>

          <div 
            className="p-8 bg-white/70 backdrop-blur-md space-y-6"
            style={{ 
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div>
              <div className="text-[var(--petroleum)] opacity-50 mb-1" style={{ fontSize: 'var(--text-caption)' }}>
                H1 — 32px / 600 weight
              </div>
              <h1 className="text-[var(--petroleum)]">The journey of mindful finance</h1>
            </div>
            
            <div>
              <div className="text-[var(--petroleum)] opacity-50 mb-1" style={{ fontSize: 'var(--text-caption)' }}>
                H2 — 24px / 600 weight
              </div>
              <h2 className="text-[var(--petroleum)]">Balance through awareness</h2>
            </div>
            
            <div>
              <div className="text-[var(--petroleum)] opacity-50 mb-1" style={{ fontSize: 'var(--text-caption)' }}>
                H3 — 18px / 600 weight
              </div>
              <h3 className="text-[var(--petroleum)]">Flow with intention</h3>
            </div>
            
            <div>
              <div className="text-[var(--petroleum)] opacity-50 mb-1" style={{ fontSize: 'var(--text-caption)' }}>
                Body — 16px / 400 weight
              </div>
              <p className="text-[var(--petroleum)]">
                Money flows like water—guided, intentional, and balanced. Track your finances with serene clarity.
              </p>
            </div>
            
            <div>
              <div className="text-[var(--petroleum)] opacity-50 mb-1" style={{ fontSize: 'var(--text-caption)' }}>
                Caption — 14px / 400 weight
              </div>
              <p className="text-[var(--petroleum)]" style={{ fontSize: 'var(--text-caption)' }}>
                Supporting text and secondary information
              </p>
            </div>
            
            <div>
              <div className="text-[var(--petroleum)] opacity-50 mb-1" style={{ fontSize: 'var(--text-caption)' }}>
                Micro — 12px / 400 weight
              </div>
              <p className="text-[var(--petroleum)]" style={{ fontSize: 'var(--text-micro)' }}>
                Labels, tags, and minimal UI elements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Components Section */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Circle size={8} fill="var(--aqua)" stroke="var(--aqua)" />
            <h2 className="text-[var(--aqua)]">Components</h2>
          </div>
          <p className="text-[var(--copper)] italic mb-8" style={{ fontSize: 'var(--text-caption)' }}>
            Atoms to organisms — modular & extensible
          </p>

          {/* Buttons */}
          <div className="mb-12">
            <h3 className="text-[var(--petroleum)] mb-6">Buttons</h3>
            <div 
              className="p-8 bg-white/70 backdrop-blur-md"
              style={{ 
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div className="flex flex-wrap gap-4 mb-6">
                <UIButton variant="primary">Primary Button</UIButton>
                <UIButton variant="secondary">Secondary Button</UIButton>
                <UIButton variant="ghost">Ghost Button</UIButton>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[var(--sand)]">
                <div>
                  <div className="text-[var(--petroleum)] mb-2" style={{ fontSize: 'var(--text-caption)' }}>
                    Primary (Aqua)
                  </div>
                  <div className="text-[var(--petroleum)] opacity-60" style={{ fontSize: 'var(--text-micro)' }}>
                    Main actions, positive flow
                  </div>
                </div>
                <div>
                  <div className="text-[var(--petroleum)] mb-2" style={{ fontSize: 'var(--text-caption)' }}>
                    Secondary (Copper)
                  </div>
                  <div className="text-[var(--petroleum)] opacity-60" style={{ fontSize: 'var(--text-micro)' }}>
                    Expenses, important actions
                  </div>
                </div>
                <div>
                  <div className="text-[var(--petroleum)] mb-2" style={{ fontSize: 'var(--text-caption)' }}>
                    Ghost (Outline)
                  </div>
                  <div className="text-[var(--petroleum)] opacity-60" style={{ fontSize: 'var(--text-micro)' }}>
                    Tertiary, minimal emphasis
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="mb-12">
            <h3 className="text-[var(--petroleum)] mb-6">Inputs</h3>
            <div 
              className="p-8 bg-white/70 backdrop-blur-md"
              style={{ 
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[var(--petroleum)] mb-2" style={{ fontSize: 'var(--text-caption)' }}>
                    Filled Input
                  </label>
                  <UIInput variant="filled" placeholder="Enter amount..." />
                </div>
                <div>
                  <label className="block text-[var(--petroleum)] mb-2" style={{ fontSize: 'var(--text-caption)' }}>
                    Outlined Input
                  </label>
                  <UIInput variant="outlined" placeholder="Description..." />
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-12">
            <h3 className="text-[var(--petroleum)] mb-6">Cards</h3>
            <div 
              className="p-8 bg-white/70 backdrop-blur-md"
              style={{ 
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <UICard
                  size="M"
                  title="Balance"
                  value="$2,300"
                  subtitle="saldo disponible"
                  icon={<Wallet size={20} />}
                />
                <UICard
                  size="M"
                  title="Ingresos"
                  value="$6,500"
                  subtitle="este mes"
                  icon={<TrendingUp size={20} />}
                  variant="income"
                />
                <UICard
                  size="M"
                  title="Gastos"
                  value="$4,200"
                  subtitle="este mes"
                  icon={<TrendingDown size={20} />}
                  variant="expense"
                />
              </div>
              
              <div className="mt-6 text-[var(--petroleum)] opacity-60" style={{ fontSize: 'var(--text-caption)' }}>
                Hover to see lift interaction (2-3px translate + shadow)
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-12">
            <h3 className="text-[var(--petroleum)] mb-6">Tags / Badges</h3>
            <div 
              className="p-8 bg-white/70 backdrop-blur-md"
              style={{ 
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div className="flex flex-wrap gap-3">
                <UITag variant="paid">Pagado</UITag>
                <UITag variant="pending">Pendiente</UITag>
                <UITag variant="neutral">Categoría</UITag>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="mb-12">
            <h3 className="text-[var(--petroleum)] mb-6">Charts</h3>
            <div 
              className="p-8 bg-white/70 backdrop-blur-md"
              style={{ 
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-[var(--petroleum)] mb-4 text-center" style={{ fontSize: 'var(--text-caption)' }}>
                    Donut Chart
                  </div>
                  <UIChart type="donut" />
                </div>
                <div>
                  <div className="text-[var(--petroleum)] mb-4 text-center" style={{ fontSize: 'var(--text-caption)' }}>
                    Bar Chart
                  </div>
                  <UIChart type="bar" />
                </div>
                <div>
                  <div className="text-[var(--petroleum)] mb-4 text-center" style={{ fontSize: 'var(--text-caption)' }}>
                    Line Chart
                  </div>
                  <UIChart type="line" />
                </div>
              </div>
              <div className="mt-6 text-[var(--petroleum)] opacity-60 text-center" style={{ fontSize: 'var(--text-caption)' }}>
                Aqua = Income / Positive • Copper = Expense / Negative
              </div>
            </div>
          </div>

          {/* Modal */}
          <div className="mb-12">
            <h3 className="text-[var(--petroleum)] mb-6">Modal / Dialog</h3>
            <div 
              className="p-8 bg-white/70 backdrop-blur-md"
              style={{ 
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <UIButton variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Modal
              </UIButton>
              <div className="mt-4 text-[var(--petroleum)] opacity-60" style={{ fontSize: 'var(--text-caption)' }}>
                Blurred background with fade-up animation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid & Layout */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Circle size={8} fill="var(--aqua)" stroke="var(--aqua)" />
            <h2 className="text-[var(--aqua)]">Grid & Spacing</h2>
          </div>
          <p className="text-[var(--copper)] italic mb-8" style={{ fontSize: 'var(--text-caption)' }}>
            8px system — rhythm & harmony
          </p>

          <div 
            className="p-8 bg-white/70 backdrop-blur-md"
            style={{ 
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-[var(--petroleum)] mb-4">Spacing Scale</h4>
                <div className="space-y-3">
                  {[
                    { name: '--space-1', value: '8px' },
                    { name: '--space-2', value: '16px' },
                    { name: '--space-3', value: '24px' },
                    { name: '--space-4', value: '32px' },
                    { name: '--space-6', value: '48px' },
                    { name: '--space-8', value: '64px' }
                  ].map((space, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div 
                        className="h-2 bg-[var(--aqua)]"
                        style={{ width: space.value }}
                      />
                      <code className="text-[var(--petroleum)]" style={{ fontSize: 'var(--text-caption)' }}>
                        {space.name}: {space.value}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-[var(--petroleum)] mb-4">Border Radius</h4>
                <div className="space-y-4">
                  <div>
                    <div className="bg-[var(--aqua)] h-16" style={{ borderRadius: 'var(--radius-card)' }} />
                    <div className="mt-2 text-[var(--petroleum)]" style={{ fontSize: 'var(--text-caption)' }}>
                      Cards: 24px
                    </div>
                  </div>
                  <div>
                    <div className="bg-[var(--copper)] h-12" style={{ borderRadius: 'var(--radius-input)' }} />
                    <div className="mt-2 text-[var(--petroleum)]" style={{ fontSize: 'var(--text-caption)' }}>
                      Inputs: 12px
                    </div>
                  </div>
                  <div>
                    <div className="bg-[var(--sand)] h-8 inline-block px-4" style={{ borderRadius: 'var(--radius-tag)' }} />
                    <div className="mt-2 text-[var(--petroleum)]" style={{ fontSize: 'var(--text-caption)' }}>
                      Tags: 8px
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motion & Interaction */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Circle size={8} fill="var(--aqua)" stroke="var(--aqua)" />
            <h2 className="text-[var(--aqua)]">Motion & Interaction</h2>
          </div>
          <p className="text-[var(--copper)] italic mb-8" style={{ fontSize: 'var(--text-caption)' }}>
            Breathing animations — soft & intentional
          </p>

          <div 
            className="p-8 bg-white/70 backdrop-blur-md"
            style={{ 
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div 
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[var(--aqua)] to-[#B8E6D5] rounded-2xl flex items-center justify-center text-white"
                  style={{ 
                    animation: 'breath 3s var(--ease-breath) infinite',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <Check size={32} />
                </div>
                <div className="text-[var(--petroleum)]" style={{ fontSize: 'var(--text-caption)' }}>
                  Breathing Pulse
                </div>
                <code className="text-[var(--copper)]" style={{ fontSize: 'var(--text-micro)' }}>
                  3s ease-breath
                </code>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-20 h-20 mx-auto mb-4 bg-[var(--copper)] rounded-2xl flex items-center justify-center text-white animate-fade-up"
                  style={{ boxShadow: 'var(--shadow-md)' }}
                >
                  <ArrowRight size={32} />
                </div>
                <div className="text-[var(--petroleum)]" style={{ fontSize: 'var(--text-caption)' }}>
                  Fade Up
                </div>
                <code className="text-[var(--copper)]" style={{ fontSize: 'var(--text-micro)' }}>
                  400ms ease-soft
                </code>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-20 h-20 mx-auto mb-4 bg-[var(--petroleum)] rounded-2xl flex items-center justify-center text-white cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-200"
                  onMouseEnter={() => setHoveredButton('hover')}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={{ boxShadow: 'var(--shadow-md)' }}
                >
                  <Wallet size={32} />
                </div>
                <div className="text-[var(--petroleum)]" style={{ fontSize: 'var(--text-caption)' }}>
                  Hover Lift
                </div>
                <code className="text-[var(--copper)]" style={{ fontSize: 'var(--text-micro)' }}>
                  200ms scale(1.1)
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Identity */}
      <section className="px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <div 
            className="text-[var(--petroleum)] mb-4"
            style={{ fontSize: '64px', lineHeight: 1, fontWeight: 300 }}
          >
            ῥέω
          </div>
          <div className="text-[var(--petroleum)] mb-3">
            Finanzas que fluyen
          </div>
          <div className="text-[var(--copper)] italic mb-8" style={{ fontSize: 'var(--text-caption)' }}>
            Oeconomia fluens
          </div>
          
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-12">
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-3 bg-[var(--aqua)] rounded-full flex items-center justify-center"
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                <div className="w-8 h-8 border-2 border-white rounded-full" style={{ animation: 'breath 2s ease-in-out infinite' }} />
              </div>
              <div className="text-[var(--petroleum)]" style={{ fontSize: 'var(--text-caption)' }}>
                Aqua = Flow
              </div>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-3 bg-[var(--copper)] rounded-full flex items-center justify-center"
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                <div className="w-8 h-8 border-2 border-white rounded" />
              </div>
              <div className="text-[var(--petroleum)]" style={{ fontSize: 'var(--text-caption)' }}>
                Copper = Structure
              </div>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-3 bg-[var(--petroleum)] rounded-full flex items-center justify-center"
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                <div className="w-6 h-0.5 bg-white" />
              </div>
              <div className="text-[var(--petroleum)]" style={{ fontSize: 'var(--text-caption)' }}>
                Petroleum = Balance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="px-6 py-12 text-center border-t border-[var(--sand)]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[var(--petroleum)] opacity-60 mb-4" style={{ fontSize: 'var(--text-caption)' }}>
            This design system is built with atoms → molecules → organisms architecture.
            <br />
            Clean, extensible, and ready for light/dark themes.
          </p>
          <div className="flex justify-center gap-3">
            <UITag variant="neutral">v1.0.0</UITag>
            <UITag variant="paid">Production Ready</UITag>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <UIFab onClick={() => console.log('FAB clicked')} />

      {/* Navigation */}
      <UINavigation />

      {/* Modal Example */}
      <UIModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Transacción"
      >
        <div className="space-y-4">
          <UIInput variant="outlined" placeholder="Monto" type="number" />
          <UIInput variant="outlined" placeholder="Descripción" />
          <div className="flex gap-3 pt-4">
            <UIButton variant="primary" onClick={() => setIsModalOpen(false)}>
              Guardar
            </UIButton>
            <UIButton variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </UIButton>
          </div>
        </div>
      </UIModal>
    </div>
  );
}
