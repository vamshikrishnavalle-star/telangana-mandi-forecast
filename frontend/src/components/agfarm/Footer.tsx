import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-4 border-t border-black/5 bg-surface py-6 px-4 sm:px-8 text-center text-sm text-ink-600">
      <div className="max-w-[1240px] mx-auto space-y-3.5">
        <div className="flex items-center justify-center gap-2 text-brand-900 font-bold text-base">
          <span>🌾 Smart Mandi Advisory</span>
          <span>•</span>
          <span>Telangana State Agricultural Marketing Department</span>
        </div>
        <p className="max-w-2xl mx-auto text-ink-600 text-xs sm:text-sm leading-relaxed">
          <strong>Advisory Disclaimer:</strong> Prices and forecasts are algorithmic estimates based on historical mandi arrivals, 
          minimum support prices (MSP), and machine learning time-series models. Market conditions may change rapidly due to weather and regional arrivals.
        </p>
        <p className="text-xs text-ink-600">
          Validated against 76,710 records across Telangana market yards (2020–2026). Data updated as of November 19, 2026.
        </p>
      </div>
    </footer>
  );
};
