import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/forecast', label: 'Price Forecast' },
    { to: '/market-comparison', label: 'Market Comparison' },
    { to: '/models', label: 'Model Performance' },
    { to: '/seasonal', label: 'Seasonal Patterns' },
    { to: '/recommendation', label: 'Recommendation' },
  ];

  return (
    <header className="sticky top-0 z-50 px-3.5 sm:px-8 py-3 bg-surface/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 text-brand-900 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-100 flex items-center justify-center text-base sm:text-lg shadow-sm group-hover:scale-105 transition-transform">
            🌾
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-brand-900 leading-none">
              Smart <span className="font-serif italic font-normal text-brand-700">Mandi</span>
            </span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider block text-ink-600 mt-0.5">Telangana Advisory</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-card/90 px-3 py-1.5 rounded-full border border-black/5 shadow-agfarm-sm">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'text-ink-600 hover:text-brand-900 hover:bg-brand-100/50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/recommendation"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-900 hover:bg-brand-700 text-white text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <span>Get Advice</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-xl bg-card border border-black/5 text-ink-900 hover:bg-surface active:scale-95 transition-all"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden mt-2.5 p-3.5 bg-card rounded-[20px] border border-black/5 shadow-agfarm space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'text-ink-700 hover:bg-brand-100/50 active:bg-brand-100/80'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-black/5 mt-2">
            <Link
              to="/recommendation"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl bg-brand-900 hover:bg-brand-700 text-white text-sm font-bold shadow-md active:scale-95 transition-all"
            >
              <span>Get Sell/Wait Advice</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
