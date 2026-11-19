import React, { useState, useMemo } from 'react';
import { COMMODITIES, getMonthlyPattern, getYearlyTrend } from '../data/staticData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Sprout, Sun, CloudRain } from 'lucide-react';

export const SeasonalPatternsPage: React.FC = () => {
  const [commodity, setCommodity] = useState<string>('Cotton');

  const monthlyData = useMemo(() => {
    return getMonthlyPattern(commodity);
  }, [commodity]);

  const yearlyData = useMemo(() => {
    return getYearlyTrend(commodity);
  }, [commodity]);

  // Kharif: Jun-Nov (months 6-11)
  const kharifMonths = monthlyData.filter((m) => m.month >= 6 && m.month <= 11);
  const rabiMonths = monthlyData.filter((m) => m.month < 6 || m.month === 12);

  const kharifAvg = Math.round(
    kharifMonths.reduce((acc, curr) => acc + curr.avgPrice, 0) / kharifMonths.length
  );
  const rabiAvg = Math.round(
    rabiMonths.reduce((acc, curr) => acc + curr.avgPrice, 0) / rabiMonths.length
  );

  const premium = Number((((kharifAvg - rabiAvg) / rabiAvg) * 100).toFixed(1));

  return (
    <div className="space-y-8">
      {/* Header & Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            🌾 Seasonal Patterns & Multi-Year Trends
          </h1>
          <p className="text-xs text-slate-400">
            Intra-annual seasonality curves (Kharif vs Rabi) and 7-year secular price inflation trends
          </p>
        </div>

        <div className="w-full sm:w-64 pt-2">
          <label className="block text-xs font-medium text-slate-400 mb-1">Select Crop</label>
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
          >
            {COMMODITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Monthly Seasonal Curve */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">
            Seasonal Monthly Price Patterns — {commodity}
          </h2>
          <p className="text-xs text-slate-400">
            Historical average mandi realization across all 12 calendar months (₹/quintal)
          </p>
        </div>

        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="monthName" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['dataMin - 400', 'dataMax + 400']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="avgPrice"
                name="Average Price (₹)"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 5, fill: '#38bdf8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Kharif vs Rabi Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          Kharif vs Rabi Season Comparison
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-sky-500/10 text-sky-400">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Kharif Season Avg (Monsoon)</span>
              <p className="text-2xl font-bold text-white mt-1">₹{kharifAvg.toLocaleString()}</p>
              <span className="text-[11px] text-slate-400">June – November harvest window</span>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Rabi Season Avg (Winter/Spring)</span>
              <p className="text-2xl font-bold text-white mt-1">₹{rabiAvg.toLocaleString()}</p>
              <span className="text-[11px] text-slate-400">December – May market window</span>
            </div>
          </div>
        </div>

        {/* Premium Banner */}
        <div className="bg-sky-950/60 border border-sky-500/40 rounded-xl p-3 text-sky-200 text-xs font-semibold flex items-center gap-2">
          <span>🌱</span>
          <span>
            Kharif Premium: {premium >= 0 ? `+${premium}%` : `${premium}%`} compared to Rabi season for {commodity}
          </span>
        </div>
      </div>

      {/* 7-Year Multi-Year Trend Chart (2020-2026) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">
            7-Year Price Trends (2020–2026) — {commodity}
          </h2>
          <p className="text-xs text-slate-400">
            Multi-year steady growth trajectory reflecting MSP support and inflation adjustments
          </p>
        </div>

        <div className="h-[260px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yearlyData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['dataMin - 500', 'dataMax + 500']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="avgPrice"
                name="Average Price (₹)"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SeasonalPatternsPage;
