import React from 'react';
import { Sparkles, MapPin, TrendingUp, BarChart2, ShieldCheck } from 'lucide-react';

type LayoutProps = {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview & Map', icon: MapPin },
    { id: 'advisory', label: 'Sell Advisory', icon: Sparkles },
    { id: 'arbitrage', label: 'Mandi Comparison', icon: TrendingUp },
    { id: 'models', label: 'Model Benchmarks', icon: BarChart2 },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div>{children}</div>
    </div>
  );
};

export default Layout;
