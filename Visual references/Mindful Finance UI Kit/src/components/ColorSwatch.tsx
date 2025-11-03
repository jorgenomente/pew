import React from 'react';

interface ColorSwatchProps {
  name: string;
  hex: string;
  varName: string;
}

export function ColorSwatch({ name, hex, varName }: ColorSwatchProps) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-16 h-16 rounded-xl shadow-[var(--shadow-sm)] border border-[var(--sand)]"
        style={{ backgroundColor: hex }}
      />
      <div>
        <div className="text-[var(--petroleum)]">{name}</div>
        <div className="text-[var(--petroleum)] opacity-60" style={{ fontSize: 'var(--text-caption)' }}>
          {hex}
        </div>
        <code 
          className="text-[var(--copper)] bg-[var(--beige)] px-2 py-0.5 rounded inline-block mt-1"
          style={{ fontSize: 'var(--text-micro)' }}
        >
          var({varName})
        </code>
      </div>
    </div>
  );
}
