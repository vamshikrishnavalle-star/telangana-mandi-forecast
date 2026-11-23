import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadSnapshot, loadMeta, YardSnapshot, MetaData, Crop } from '../services/dataLoader';
import { AgBadge, AgCard } from '../components/agfarm/Common';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TelanganaMap, { defaultMarketYards } from '../components/ui/TelanganaMap';
import { ArrowUpRight, TrendingUp, ShieldCheck, MapPin, Navigation, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [cottonSnapshots, setCottonSnapshots] = useState<YardSnapshot[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop>('Cotton');
  const [activeSnapshots, setActiveSnapshots] = useState<YardSnapshot[]>([]);
  const [selectedYard, setSelectedYard] = useState<string>('Hyderabad RCI Market');
  const [showDistances, setShowDistances] = useState<boolean>(true);

  useEffect(() => {
    loadMeta().then(setMeta);
    loadSnapshot('Cotton').then(setCottonSnapshots);
  }, []);

  useEffect(() => {
    loadSnapshot(selectedCrop).then(setActiveSnapshots);
  }, [selectedCrop]);

  const bestYard = cottonSnapshots[0] || {
    yard: 'Hyderabad RCI Market',
    price: 8903,
    advice: 'Sell Now',
    change7d: -1.1,
  };

  return (
    <div className="space-y-12">
      {/* 1. AgFarm Hero Section */}
      <section className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden bg-brand-900 min-h-[440px] sm:min-h-[520px] flex items-center p-5 sm:p-10 lg:p-16 text-white shadow-2xl">
        {/* Background photo & overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/85 to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 max-w-2xl space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-950/70 backdrop-blur-md border border-emerald-500/30 text-xs sm:text-sm font-semibold text-emerald-200 shadow-sm">
            <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider">NEW</span>
            <span className="tracking-wider text-[11px] sm:text-xs font-bold">AI-POWERED AGRICULTURE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Driving the Future of Agriculture <br className="hidden sm:inline" />
            with <span className="font-serif italic font-normal text-emerald-200">Smart Innovation</span>
          </h1>

          <p className="text-sm sm:text-base text-brand-100/90 font-medium max-w-xl leading-relaxed">
            Data-backed 7-day and 14-day crop price forecasting and intelligent Sell/Wait decision support for Telangana farmers across 10 state market yards.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2 w-full sm:w-auto">
            <Link
              to="/forecast"
              className="px-6 py-3 rounded-full bg-white text-brand-900 hover:bg-brand-100 font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>View Forecast</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/market-comparison"
              className="px-6 py-3 rounded-full bg-transparent border-2 border-white/40 hover:border-white text-white font-bold text-sm transition-all active:scale-95 text-center"
            >
              Compare Mandis
            </Link>
          </div>

          {/* Mobile-only compact benchmark pill */}
          <div className="flex md:hidden items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold block">Best Benchmark ({bestYard.yard})</span>
              <div className="text-xl font-black text-white mt-0.5">
                ₹{bestYard.price.toLocaleString()}<span className="text-xs font-normal text-emerald-200 ml-1">/q</span>
              </div>
            </div>
            <AgBadge advice={bestYard.advice} className="!text-xs !py-0.5" />
          </div>
        </div>

        {/* AgFarm Glass Badge (Bottom Right, Desktop) */}
        <div className="hidden md:flex absolute bottom-8 right-8 z-20 glass-badge rounded-[24px] p-5 max-w-xs text-ink-900 flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-600 uppercase tracking-wider">Today's Best Benchmark</span>
            <AgBadge advice={bestYard.advice} />
          </div>
          <div>
            <span className="text-sm font-semibold text-ink-700 block">{bestYard.yard}</span>
            <div className="text-3xl font-black text-brand-900 tracking-tight mt-0.5">
              ₹{bestYard.price.toLocaleString()}
              <span className="text-sm font-medium text-ink-600 ml-1">/q</span>
            </div>
          </div>
          <p className="text-xs text-ink-600 pt-1.5 border-t border-black/5 font-medium">
            Cotton modal rate • Updated {meta?.asOf || '2026-11-19'}
          </p>
        </div>
      </section>

      {/* 2. Key Features Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgCard className="!p-0 overflow-hidden">
          <div className="bg-[#E7F1FB] border-b border-[#1D4ED8]/10 p-4 px-6 flex items-center gap-2.5 text-[#1D4ED8]">
            <TrendingUp className="w-5 h-5" />
            <h2 className="text-base font-bold tracking-tight">📈 Price Forecasting</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3.5 text-sm text-ink-700 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 shrink-0" />
                <span><strong>7-day and 14-day price forecasts</strong> computed with historical arrival patterns</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 shrink-0" />
                <span><strong>Multiple ML models:</strong> ARIMA, Random Forest, XGBoost, and Moving Average</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 shrink-0" />
                <span><strong>95% Confidence Intervals</strong> derived directly from validated test error bounds</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 shrink-0" />
                <span><strong>Real-time market data integration</strong> with Telangana AMC daily reports</span>
              </li>
            </ul>
          </div>
        </AgCard>

        <AgCard className="!p-0 overflow-hidden">
          <div className="bg-[#E5F4E4] border-b border-[#0A7A3B]/10 p-4 px-6 flex items-center gap-2.5 text-[#0A7A3B]">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-base font-bold tracking-tight">💡 Smart Recommendations</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3.5 text-sm text-ink-700 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 shrink-0" />
                <span><strong>Sell/Wait decision support</strong> with high/medium confidence indicators</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 shrink-0" />
                <span><strong>Cost-benefit analysis:</strong> 0.1%/day warehouse storage and 2% risk discount</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 shrink-0" />
                <span><strong>Arbitrage detection:</strong> identifies price premiums in neighboring mandis</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 shrink-0" />
                <span><strong>Net realization calculation</strong> factoring inter-district road transport costs</span>
              </li>
            </ul>
          </div>
        </AgCard>
      </section>

      {/* 3. Quick Market Overview */}
      <AgCard className="space-y-6 !p-4 sm:!p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-ink-900 tracking-tight">
              Quick Market Overview — Latest Prices with <span className="font-serif italic font-normal text-brand-700">Live Telemetry</span>
            </h2>
            <p className="text-xs sm:text-sm text-ink-600 mt-1">
              Comparative modal price (₹/quintal) across 10 Telangana market yards
            </p>
          </div>

          {/* Crop Selector Tabs - smooth horizontal scroll on mobile */}
          <div className="flex items-center gap-1.5 bg-surface p-1 rounded-full border border-black/5 overflow-x-auto max-w-full">
            {(['Cotton', 'Chilli', 'Maize', 'Paddy', 'Turmeric'] as Crop[]).map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  selectedCrop === crop
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'text-ink-600 hover:text-brand-900'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* Single Hue Bar Chart (AgFarm style) */}
        <div className="h-[280px] sm:h-[320px] w-full pt-2 sm:pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeSnapshots} margin={{ top: 10, right: 10, left: -10, bottom: 45 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF3EE" />
              <XAxis
                dataKey="yard"
                stroke="#8A948D"
                tick={{ fill: '#5B665F', fontSize: 10 }}
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <YAxis
                stroke="#8A948D"
                tick={{ fill: '#5B665F', fontSize: 11 }}
                domain={['dataMin - 500', 'dataMax + 300']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 8px 24px rgba(16,24,20,0.06)',
                  color: '#111613',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="price" fill="#0A4D2E" radius={[6, 6, 0, 0]} name="Modal Price (₹/q)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AgCard>

      {/* 4. Geospatial Telangana Map & Distances */}
      <AgCard className="space-y-5 !p-4 sm:!p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-ink-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-900" />
              <span>Telangana Market Yards & <span className="font-serif italic font-normal text-brand-700">Geospatial Haul</span></span>
            </h2>
            <p className="text-xs sm:text-sm text-ink-600 mt-1">
              Locate primary terminal yards and evaluate haul distances to calculate net arbitrage returns
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <select
              value={selectedYard}
              onChange={(e) => setSelectedYard(e.target.value)}
              className="bg-surface border border-black/10 text-ink-900 text-sm font-semibold rounded-full px-4 py-2 sm:py-2.5 focus:ring-2 focus:ring-brand-900 w-full sm:w-auto"
            >
              {defaultMarketYards.map((y) => (
                <option key={y.name} value={y.name}>
                  {y.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowDistances(!showDistances)}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                showDistances
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-surface text-ink-600 hover:bg-black/5'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{showDistances ? 'Hide Distance Lines' : 'Show Distance Lines'}</span>
            </button>
          </div>
        </div>

        <div className="rounded-[20px] overflow-hidden border border-black/5 shadow-inner">
          <TelanganaMap
            selectedYard={selectedYard}
            showDistances={showDistances}
            onSelectYard={(yard) => setSelectedYard(yard)}
            yards={defaultMarketYards}
          />
        </div>
      </AgCard>
    </div>
  );
};
export default HomePage;
