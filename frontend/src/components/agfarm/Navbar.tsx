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
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-3 bg-surface/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 text-brand-900 group">
          <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
            🌾
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-brand-900">
              Smart <span className="font-serif italic font-normal text-brand-700">Mandi</span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider block text-ink-600">Telangana Advisory</span>
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
          className="lg:hidden p-2 rounded-full bg-card border border-black/5 text-ink-900"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden mt-2 p-4 bg-card rounded-[20px] border border-black/5 shadow-agfarm space-y-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-brand-900 text-white' : 'text-ink-600 hover:bg-brand-100/50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-2">
            <Link
              to="/recommendation"
              onClick={() => setOpen(false)}
              className="block w-full text-center py-2.5 rounded-full bg-brand-900 text-white text-xs font-bold shadow-md"
            >
              Get Sell/Wait Advice
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
