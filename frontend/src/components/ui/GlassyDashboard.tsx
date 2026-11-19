import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  ShieldCheck,
  Building2,
  BarChart3,
  Sprout,
  Menu,
  X,
  Radio
} from 'lucide-react';

type GlassyDashboardProps = {
  children: React.ReactNode;
  workspaceName?: string;
};

export const GlassyDashboard: React.FC<GlassyDashboardProps> = ({
  children,
  workspaceName = 'Smart Mandi Telangana',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: Home, emoji: '🏠' },
    { to: '/forecast', label: 'Price Forecast', icon: TrendingUp, emoji: '📈' },
    { to: '/recommendation', label: 'Sell Recommendation', icon: ShieldCheck, emoji: '💡' },
    { to: '/market-comparison', label: 'Market Comparison', icon: Building2, emoji: '🏛️' },
    { to: '/model-performance', label: 'Model Performance', icon: BarChart3, emoji: '📊' },
    { to: '/seasonal-patterns', label: 'Seasonal Patterns', icon: Sprout, emoji: '🌾' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner Header */}
      <header className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border-b border-emerald-800/40 px-4 sm:px-6 py-3.5 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-2xl sm:text-3xl">🌾</span>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                {workspaceName}
              </h1>
              <p className="text-[11px] text-emerald-200/80 hidden sm:block">
                రైతు సేవా కేంద్రం • Daily Price Forecasting & Sell-Time Advisory
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-sm">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Telangana Mandi Live Feed</span>
              <span className="sm:hidden">Live</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Body with Left Sidebar (matches Streamlit sidebar structure) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <aside
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 bg-slate-900/90 border-r border-slate-800/80 p-4 shrink-0 transition-all z-40`}
        >
          <div className="mb-4 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Navigation Menu
            </p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span className="text-base">{item.emoji}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 space-y-1.5">
            <p className="font-semibold text-slate-200">📌 Telangana Mandis:</p>
            <p>• Hyderabad RCI</p>
            <p>• Warangal Gurramguda</p>
            <p>• Karimnagar BCCL</p>
            <p>• Nizamabad, Khammam, Adilabad</p>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-300">
            🌾 Smart Mandi Advisory System • Government of Telangana Market Yards Integration
          </p>
          <p className="text-[11px]">
            Advisory forecasts are ML model estimates based on historical arrivals, MSP, and time-series covariates.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GlassyDashboard;
