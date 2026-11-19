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
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-5 sm:py-6 bg-surface/95 backdrop-blur-md border-b border-black/8 shadow-sm transition-all">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3.5 text-brand-900 group">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-2xl shadow-sm border border-brand-900/10 group-hover:scale-105 transition-transform">
            🌾
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-900 leading-tight">
              Smart <span className="font-serif italic font-normal text-brand-700">Mandi</span>
            </span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.16em] block text-ink-600 mt-0.5">
              Telangana Advisory
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-2 bg-card/95 px-4 py-2 rounded-full border border-black/8 shadow-agfarm">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-5 py-2.5 rounded-full text-base font-bold transition-all ${
                  isActive
                    ? 'bg-brand-900 text-white shadow-md'
                    : 'text-ink-700 hover:text-brand-900 hover:bg-brand-100/60'
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
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-900 hover:bg-brand-700 text-white text-base font-extrabold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <span>Get Advice</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile / Tablet Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="xl:hidden p-3 rounded-2xl bg-card border border-black/8 text-ink-900 shadow-sm hover:bg-surface transition-colors"
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile / Tablet Drawer */}
      {open && (
        <div className="xl:hidden mt-3 p-5 bg-card rounded-[24px] border border-black/8 shadow-agfarm space-y-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-5 py-3 rounded-2xl text-base font-bold transition-all ${
                  isActive ? 'bg-brand-900 text-white shadow-sm' : 'text-ink-700 hover:bg-brand-100/50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-black/5">
            <Link
              to="/recommendation"
              onClick={() => setOpen(false)}
              className="block w-full text-center py-3.5 rounded-2xl bg-brand-900 hover:bg-brand-700 text-white text-base font-extrabold shadow-md transition-all"
            >
              Get Sell / Wait Advisory
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
