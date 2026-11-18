import React from 'react';

type GlassyDashboardProps = {
  children: React.ReactNode;
  workspaceName?: string;
  initialTheme?: 'light' | 'dark';
};

export const GlassyDashboard: React.FC<GlassyDashboardProps> = ({
  children,
  workspaceName = 'Smart Mandi Telangana',
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🌾</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{workspaceName}</h1>
              <p className="text-xs text-emerald-100">రైతు సేవా కేంద్రం • Daily Price Forecasting & Sell-Time Advisory</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 px-3 py-1.5 rounded-full font-medium">
              ● Live 2020–2026 Mandi Data
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-slate-700">🌾 Smart Mandi Advisory System • Government of Telangana Market Yards Integration</p>
          <p className="mt-1">Advisory prices are model estimates based on historical arrivals, MSP, and time-series ML models.</p>
        </div>
      </footer>
    </div>
  );
};

export default GlassyDashboard;
