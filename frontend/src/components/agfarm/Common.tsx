import React from 'react';
import { Advice } from '../../services/dataLoader';

export const AgCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`bg-card rounded-[20px] p-6 border border-black/5 shadow-agfarm ${className}`}>
      {children}
    </div>
  );
};

export const AgBadge: React.FC<{ advice: Advice | string; className?: string }> = ({
  advice,
  className = '',
}) => {
  const isSell = advice.toLowerCase().includes('sell');
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-black tracking-wide ${
        isSell
          ? 'bg-emerald-100 text-[#0A7A3B] border border-emerald-300'
          : 'bg-amber-100 text-[#D97706] border border-amber-300'
      } ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${isSell ? 'bg-[#0A7A3B]' : 'bg-[#D97706]'}`} />
      {advice}
    </span>
  );
};

export const KpiCard: React.FC<{
  label: string;
  value: string | number;
  delta?: string;
  unit?: string;
  subtext?: string;
}> = ({ label, value, delta, unit, subtext }) => {
  const isPositive = delta?.startsWith('+');
  return (
    <div className="bg-card rounded-[20px] p-5 border border-black/5 shadow-agfarm flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-ink-600">{label}</span>
        {delta && (
          <span
            className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
          {value}
          {unit && <span className="text-sm font-normal text-ink-600 ml-1">{unit}</span>}
        </div>
        {subtext && <p className="text-xs text-ink-600 mt-1">{subtext}</p>}
      </div>
    </div>
  );
};

export const Callout: React.FC<{
  kind: 'success' | 'info' | 'warning';
  title?: string;
  children: React.ReactNode;
}> = ({ kind, title, children }) => {
  const styles = {
    success: 'bg-[#E5F4E4] border-[#0A7A3B]/20 text-[#0A4D2E]',
    info: 'bg-[#E7F1FB] border-[#1D4ED8]/20 text-[#1E3A8A]',
    warning: 'bg-[#FEF3C7] border-[#D97706]/20 text-[#92400E]',
  };

  const icons = {
    success: '🏆',
    info: '🌱',
    warning: '⚠️',
  };

  return (
    <div className={`rounded-[20px] p-5 border ${styles[kind]} flex items-start gap-3.5 shadow-agfarm-sm`}>
      <span className="text-xl leading-none">{icons[kind]}</span>
      <div className="text-sm font-medium leading-relaxed">
        {title && <strong className="block font-bold mb-1 text-base">{title}</strong>}
        {children}
      </div>
    </div>
  );
};
