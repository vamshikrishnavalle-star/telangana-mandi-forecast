import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-black/5 bg-surface py-10 px-4 sm:px-8 text-center text-xs text-ink-600">
      <div className="max-w-[1240px] mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-brand-900 font-bold">
          <span>🌾 Smart Mandi Advisory</span>
          <span>•</span>
          <span>Telangana State Agricultural Marketing Department</span>
        </div>
        <p className="max-w-2xl mx-auto text-ink-400 text-[11px] leading-relaxed">
          <strong>Advisory Disclaimer:</strong> Prices and forecasts are algorithmic estimates based on historical mandi arrivals, 
          minimum support prices (MSP), and machine learning time-series models. Market conditions may change rapidly due to weather and regional arrivals.
        </p>
        <p className="text-[10px] text-ink-400">
          Validated against 76,710 records across Telangana market yards (2020–2026). Data updated as of November 19, 2026.
        </p>
      </div>
    </footer>
  );
};
