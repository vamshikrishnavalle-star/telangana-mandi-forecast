import React, { useState, useMemo } from 'react';
import { COMMODITIES, getMarketComparisonData } from '../data/staticData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Building2, Award, TrendingUp, ArrowUpDown } from 'lucide-react';

export const MarketComparisonPage: React.FC = () => {
  const [commodity, setCommodity] = useState<string>('Cotton');

  const comparisonData = useMemo(() => {
    return getMarketComparisonData(commodity);
  }, [commodity]);

  const highest = comparisonData[0];
  const lowest = comparisonData[comparisonData.length - 1];
  const spread = highest.avgPrice - lowest.avgPrice;
  const spreadPct = Number(((spread / lowest.avgPrice) * 100).toFixed(1));

  // Viridis-style bar colors for rankings
  const barColors = ['#440154', '#31688e', '#35b779', '#fde725', '#b5de2b', '#6ece58'];

  return (
    <div className="space-y-8">
      {/* Header & Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            🏛️ Market Yard Comparison
          </h1>
          <p className="text-xs text-slate-400">
            Cross-terminal price spread analysis and arbitrage opportunity detection
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

      {/* Best Price Callout */}
      <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 flex items-center gap-3 text-emerald-200">
        <Award className="w-6 h-6 text-emerald-400 shrink-0" />
        <div>
          <p className="text-sm font-bold">
            🏆 Best Price: {highest.marketYard} at ₹{highest.avgPrice.toLocaleString()}/quintal
          </p>
          <p className="text-xs text-emerald-300/80">
            Offers ₹{spread.toLocaleString()} premium (+{spreadPct}%) over {lowest.marketYard}
          </p>
        </div>
      </div>

      {/* Detailed Comparison Table (matches Streamlit) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white">
          Price Comparison across Mandis for {commodity}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-300 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Market Yard</th>
                <th className="py-3 px-4">Average Price (₹)</th>
                <th className="py-3 px-4">Total Arrivals (q)</th>
                <th className="py-3 px-4">Difference from Min (₹)</th>
                <th className="py-3 px-4">Premium (%)</th>
                <th className="py-3 px-4">7d Change (%)</th>
                <th className="py-3 px-4">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium text-slate-200">
              {comparisonData.map((row) => (
                <tr
                  key={row.marketYard}
                  className={`hover:bg-slate-800/60 transition-colors ${
                    row.rank === 1 ? 'bg-emerald-950/40 font-bold' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-slate-400">{row.rank}</td>
                  <td className="py-3 px-4 font-semibold text-white">{row.marketYard}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">₹{row.avgPrice.toLocaleString()}</td>
                  <td className="py-3 px-4">{row.totalArrivals.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {row.diffFromMin === 0 ? '—' : `+₹${row.diffFromMin.toLocaleString()}`}
                  </td>
                  <td className="py-3 px-4 text-emerald-300">
                    {row.premiumPct === 0 ? '0.0%' : `+${row.premiumPct}%`}
                  </td>
                  <td className={`py-3 px-4 ${row.change7d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {row.change7d >= 0 ? `+${row.change7d}%` : `${row.change7d}%`}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.recommendation === 'Wait'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {row.recommendation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar Chart: Price Comparison across Mandis */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white">
          {commodity} Prices Across Market Yards
        </h2>

        <div className="h-[300px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="marketYard"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                interval={0}
                angle={-25}
                textAnchor="end"
              />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['dataMin - 1000', 'dataMax + 500']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="avgPrice" name="Price (₹/quintal)" radius={[4, 4, 0, 0]}>
                {comparisonData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Spread Analysis (Streamlit 3 metrics) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-emerald-400" />
          📈 Price Spread Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">Highest Price</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">₹{highest.avgPrice.toLocaleString()}</p>
            <span className="text-[11px] text-slate-400">{highest.marketYard}</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">Lowest Price</span>
            <p className="text-2xl font-bold text-slate-300 mt-1">₹{lowest.avgPrice.toLocaleString()}</p>
            <span className="text-[11px] text-slate-400">{lowest.marketYard}</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">Price Spread</span>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              ₹{spread.toLocaleString()} <span className="text-xs font-semibold">({spreadPct}%)</span>
            </p>
            <span className="text-[11px] text-slate-400">Regional Arbitrage Opportunity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketComparisonPage;
