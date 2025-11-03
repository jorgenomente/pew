import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartProps {
  type: 'donut' | 'bar' | 'line';
}

const donutData = [
  { name: 'Ingresos', value: 6500 },
  { name: 'Gastos', value: 4200 }
];

const barData = [
  { month: 'Ene', income: 5500, expense: 3200 },
  { month: 'Feb', income: 6200, expense: 3800 },
  { month: 'Mar', income: 7100, expense: 4500 },
  { month: 'Abr', income: 6800, expense: 4200 }
];

const lineData = [
  { day: 'L', balance: 2300 },
  { day: 'M', balance: 3100 },
  { day: 'X', balance: 2800 },
  { day: 'J', balance: 3900 },
  { day: 'V', balance: 4200 },
  { day: 'S', balance: 3800 },
  { day: 'D', balance: 4100 }
];

export function UIChart({ type }: ChartProps) {
  if (type === 'donut') {
    return (
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              <Cell fill="var(--aqua)" />
              <Cell fill="var(--copper)" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  if (type === 'bar') {
    return (
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis dataKey="month" stroke="var(--petroleum)" style={{ fontSize: 'var(--text-caption)' }} />
            <YAxis stroke="var(--petroleum)" style={{ fontSize: 'var(--text-caption)' }} />
            <Tooltip />
            <Bar dataKey="income" fill="var(--aqua)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="var(--copper)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineData}>
          <XAxis dataKey="day" stroke="var(--petroleum)" style={{ fontSize: 'var(--text-caption)' }} />
          <YAxis stroke="var(--petroleum)" style={{ fontSize: 'var(--text-caption)' }} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="var(--aqua)" 
            strokeWidth={3}
            dot={{ fill: 'var(--aqua)', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
