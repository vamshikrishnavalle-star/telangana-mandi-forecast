import React from 'react';
import { Advice } from '../../services/dataLoader';
import { Trophy, AlertTriangle, Info } from 'lucide-react';

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
  action?: React.ReactNode;
  className?: string;
}> = ({ kind, title, children, action, className = '' }) => {
  const styles = {
    success: {
      card: 'bg-[#E5F4E4] border-[#0A7A3B]/25 text-[#0A4D2E]',
      iconWrap: 'bg-[#0A7A3B]/15 text-[#0A7A3B]',
      title: 'text-[#0A4D2E]',
      body: 'text-[#0A4D2E]/90',
    },
    info: {
      card: 'bg-[#E7F1FB] border-[#1D4ED8]/25 text-[#1E3A8A]',
      iconWrap: 'bg-[#1D4ED8]/10 text-[#1D4ED8]',
      title: 'text-[#1E3A8A]',
      body: 'text-[#1E3A8A]/90',
    },
    warning: {
      card: 'bg-[#FEF3C7] border-[#D97706]/25 text-[#92400E]',
      iconWrap: 'bg-[#D97706]/15 text-[#D97706]',
      title: 'text-[#92400E]',
      body: 'text-[#92400E]/90',
    },
  };

  const getIcon = () => {
    switch (kind) {
      case 'success':
        return <Trophy className="w-5 h-5 text-[#0A7A3B]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#D97706]" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-[#1D4ED8]" />;
    }
  };

  const current = styles[kind];

  return (
    <div
      className={`rounded-[20px] px-6 py-4.5 border ${current.card} flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-agfarm-sm ${className}`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm ${current.iconWrap}`}>
          {getIcon()}
        </div>
        <div className="min-w-0">
          {title && (
            <h4 className={`text-base sm:text-lg font-bold leading-snug tracking-tight ${current.title}`}>
              {title}
            </h4>
          )}
          {children && (
            <div className={`text-sm sm:text-base font-medium leading-relaxed mt-0.5 ${current.body}`}>
              {children}
            </div>
          )}
        </div>
      </div>
      {action && <div className="shrink-0 sm:self-center pl-15 sm:pl-0">{action}</div>}
    </div>
  );
};
