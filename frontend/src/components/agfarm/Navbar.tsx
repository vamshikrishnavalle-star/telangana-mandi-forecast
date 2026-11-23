import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/forecast', label: t('nav.forecast') },
    { to: '/market-comparison', label: t('nav.market_comparison') },
    { to: '/models', label: t('nav.model_performance') },
    { to: '/seasonal', label: t('nav.seasonal') },
    { to: '/recommendation', label: t('nav.recommendation') },
  ];

  return (
    <header className="sticky top-0 z-50 px-3.5 sm:px-8 py-3 bg-surface/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 text-brand-900 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-100 flex items-center justify-center text-base sm:text-lg shadow-sm group-hover:scale-105 transition-transform">
            🌾
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-brand-900 leading-none">
              {language === 'te' ? 'స్మార్ట్' : 'Smart'} <span className="font-serif italic font-normal text-brand-700">{language === 'te' ? 'మండి' : 'Mandi'}</span>
            </span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider block text-ink-600 mt-0.5">
              {t('brand.subtitle')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1.5 bg-card/90 px-3 py-1.5 rounded-full border border-black/5 shadow-agfarm-sm">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-sm font-bold transition-all ${
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

        {/* Right Controls: Language Toggle & CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle Button (Always visible on all screen sizes) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-card hover:bg-surface border border-black/10 text-xs sm:text-sm font-bold text-ink-900 shadow-sm active:scale-95 transition-all"
            title={language === 'en' ? 'తెలుగులోకి మార్చండి' : 'Switch to English'}
            aria-label="Toggle Language (English / Telugu)"
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-900" />
            <span className={language === 'en' ? 'text-brand-900 font-black' : 'text-ink-400'}>EN</span>
            <span className="text-ink-300">/</span>
            <span className={language === 'te' ? 'text-brand-900 font-black' : 'text-ink-400'}>తెలుగు</span>
          </button>

          {/* CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/recommendation"
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-brand-900 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95 shrink-0"
            >
              <span>{t('nav.get_advice')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="xl:hidden p-2 rounded-xl bg-card border border-black/5 text-ink-900 hover:bg-surface active:scale-95 transition-all"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="xl:hidden mt-2.5 p-3.5 bg-card rounded-[20px] border border-black/5 shadow-agfarm space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
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
          <div className="pt-2 border-t border-black/5 mt-2 flex flex-col gap-2">
            <Link
              to="/recommendation"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl bg-brand-900 hover:bg-brand-700 text-white text-sm font-bold shadow-md active:scale-95 transition-all"
            >
              <span>{t('nav.get_advice_full')}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
