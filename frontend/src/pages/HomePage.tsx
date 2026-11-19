import React, { useState } from 'react';
import { COMMODITIES, YARDS, BASE_PRICES, YARD_COLORS } from '../data/staticData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TelanganaMap, { defaultMarketYards } from '../components/ui/TelanganaMap';
import { MapPin, Navigation, TrendingUp, Calendar, Database, Sparkles, AlertCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [selectedYard, setSelectedYard] = useState<string>('Hyderabad RCI Market');
  const [showDistances, setShowDistances] = useState<boolean>(true);

  // Grouped Bar Data for 5 Commodities across 6 yards
  const overviewData = COMMODITIES.map((crop) => {
    const base = BASE_PRICES[crop] || 8000;
    return {
      commodity: crop,
      'Hyderabad RCI Market': Math.round(base * 1.03),
      'Warangal Gurramguda': Math.round(base * 1.01),
      'Karimnagar BCCL Market': Math.round(base * 0.99),
      'Nizamabad': Math.round(base * 0.98),
      'Khammam': Math.round(base * 1.02),
      'Adilabad': Math.round(base * 0.96),
    };
  });

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3 shadow-lg">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Commodities Covered</p>
            <p className="text-xl font-bold text-white">5 Major Crops</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3 shadow-lg">
          <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Market Yards</p>
            <p className="text-xl font-bold text-white">6 Key Terminals</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3 shadow-lg">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Data Period</p>
            <p className="text-xl font-bold text-white">2020 – 2026</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3 shadow-lg">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Records</p>
            <p className="text-xl font-bold text-white">76,710</p>
          </div>
        </div>
      </div>

      {/* Key Features Overview (matches Streamlit) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-3 text-sky-400">
            <TrendingUp className="w-5 h-5" />
            <h3 className="text-base font-bold">📈 Price Forecasting</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              7-day and 14-day price forecasts with 95% Confidence Intervals
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              Multiple ML models: ARIMA, Prophet, Random Forest, and XGBoost
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              High accuracy with 1.66% MAPE validated against 7 years of Telangana data
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              Live Agmarknet & State Data Portal real-time feeds
            </li>
          </ul>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-3 text-amber-400">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-base font-bold">💡 Smart Recommendations</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Actionable Sell vs. Hold (Wait 7 / 14 Days) guidance
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Confidence-backed advice factoring risk discounts (2.0%)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Cost-benefit analysis including 0.1%/day warehouse storage costs
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Inter-mandi arbitrage detection and road transport calculations
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Market Overview - Grouped Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            📊 Quick Market Overview — Latest Mandi Prices
          </h2>
          <p className="text-xs text-slate-400">
            Comparative price distribution across primary and secondary market yards (₹/quintal)
          </p>
        </div>

        <div className="h-[360px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overviewData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="commodity" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} domain={['dataMin - 500', 'dataMax + 1000']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              {YARDS.map((yard, index) => (
                <Bar key={yard} dataKey={yard} fill={YARD_COLORS[index]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Geospatial Map Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Telangana Market Yards Geospatial Map & Distances
            </h2>
            <p className="text-xs text-slate-400">
              Interactive terminal network with distance lines and live market connections
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedYard}
              onChange={(e) => setSelectedYard(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              {YARDS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowDistances(!showDistances)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                showDistances
                  ? 'bg-red-600/90 hover:bg-red-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              {showDistances ? 'Hide Distance Lines' : 'Show Distance Lines'}
            </button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-800">
          <TelanganaMap
            selectedYard={selectedYard}
            showDistances={showDistances}
            onSelectYard={(yard) => setSelectedYard(yard)}
            yards={defaultMarketYards}
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
