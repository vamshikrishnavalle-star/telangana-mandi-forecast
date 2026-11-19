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
  Radio,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

type GlassyDashboardProps = {
  children: React.ReactNode;
  workspaceName?: string;
};

export const GlassyDashboard: React.FC<GlassyDashboardProps> = ({
  children,
  workspaceName = 'Smart Mandi Telangana',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { to: '/', label: 'Home', icon: Home, emoji: '🏠' },
    { to: '/forecast', label: 'Price Forecast', icon: TrendingUp, emoji: '📈' },
    { to: '/recommendation', label: 'Sell Recommendation', icon: ShieldCheck, emoji: '💡' },
    { to: '/market-comparison', label: 'Market Comparison', icon: Building2, emoji: '🏛️' },
    { to: '/model-performance', label: 'Model Performance', icon: BarChart3, emoji: '📊' },
    { to: '/seasonal-patterns', label: 'Seasonal Patterns', icon: Sprout, emoji: '🌾' },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Banner Header */}
      <header className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border-b border-emerald-800/40 px-4 sm:px-6 py-3.5 sticky top-0 z-50 shadow-lg text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-200"
              aria-label="Toggle Navigation"
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
            {/* Live Indicator */}
            <span className="text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-sm">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Telangana Mandi Live Feed</span>
              <span className="sm:hidden">Live</span>
            </span>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 p-2 px-3 rounded-full text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-slate-700 transition-all shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-slate-200">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-sky-300" />
                  <span className="hidden sm:inline text-slate-200">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Left Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <aside
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 border-r p-4 shrink-0 transition-all z-40 ${
            theme === 'dark'
              ? 'bg-slate-900/90 border-slate-800/80'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
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
                      : theme === 'dark'
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <span className="text-base">{item.emoji}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className={`mt-8 p-3 rounded-xl border text-[11px] space-y-1.5 ${
            theme === 'dark'
              ? 'bg-slate-800/60 border-slate-700/60 text-slate-400'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            <p className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>
              📌 Telangana Mandis:
            </p>
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
      <footer className={`border-t py-6 text-center text-xs mt-auto transition-colors ${
        theme === 'dark'
          ? 'bg-slate-950 border-slate-900 text-slate-400'
          : 'bg-white border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className={`font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
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
