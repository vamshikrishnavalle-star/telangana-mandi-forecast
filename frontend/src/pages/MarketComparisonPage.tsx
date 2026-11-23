import React, { useEffect, useState } from 'react';
import { loadSnapshot, Crop, YardSnapshot } from '../services/dataLoader';
import { AgCard, AgBadge, KpiCard, Callout } from '../components/agfarm/Common';
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
import { Building2, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const CROPS: Crop[] = ['Cotton', 'Chilli', 'Maize', 'Paddy', 'Turmeric'];

export const MarketComparisonPage: React.FC = () => {
  const [crop, setCrop] = useState<Crop>('Cotton');
  const [activeTab, setActiveTab] = useState<'today' | 'ranking'>('today');
  const [snapshots, setSnapshots] = useState<YardSnapshot[]>([]);

  useEffect(() => {
    loadSnapshot(crop).then(setSnapshots);
  }, [crop]);

  const sorted = [...snapshots].sort((a, b) => b.price - a.price);
  const highest = sorted[0] || { yard: 'Hyderabad RCI Market', price: 8903, advice: 'Sell Now' };
  const lowest = sorted[sorted.length - 1] || { yard: 'Nalgonda', price: 7607, advice: 'Sell Now' };
  const spread = highest.price - lowest.price;
  const spreadPct = lowest.price > 0 ? Number(((spread / lowest.price) * 100).toFixed(1)) : 0;

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-900 text-sm font-bold mb-2">
            <Building2 className="w-4 h-4" />
            <span>Statewide Terminal Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">
            Market Yard Comparison & <span className="font-serif italic font-normal text-brand-700">Arbitrage Spreads</span>
          </h1>
          <p className="text-sm text-ink-600 mt-1.5">
            Real-time price spread across 10 Telangana mandis with actionable Sell/Wait guidance
          </p>
        </div>

        {/* Crop Select & View Tabs */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 bg-card p-2.5 sm:p-2 rounded-2xl sm:rounded-full border border-black/5 shadow-agfarm-sm w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-2 sm:px-3">
            <SlidersHorizontal className="w-4 h-4 text-brand-900" />
            <span className="text-sm font-bold text-ink-600">Crop:</span>
          </div>

          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value as Crop)}
            className="bg-surface text-ink-900 text-sm font-bold px-4 py-2 rounded-xl sm:rounded-full border border-black/5 focus:ring-2 focus:ring-brand-900 cursor-pointer w-full sm:w-auto"
          >
            {CROPS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="flex items-center justify-center gap-1 bg-surface p-1 rounded-xl sm:rounded-full border border-black/5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg sm:rounded-full text-sm font-bold transition-all text-center ${
                activeTab === 'today' ? 'bg-brand-900 text-white' : 'text-ink-600 hover:text-brand-900'
              }`}
            >
              Today's Comparison
            </button>
            <button
              onClick={() => setActiveTab('ranking')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg sm:rounded-full text-sm font-bold transition-all text-center ${
                activeTab === 'ranking' ? 'bg-brand-900 text-white' : 'text-ink-600 hover:text-brand-900'
              }`}
            >
              Ranking View
            </button>
          </div>
        </div>
      </div>

      {/* Best Price Callout Banner */}
      <Callout kind="success" title={`Best Price: ${highest.yard} at ₹${highest.price.toLocaleString()}/quintal (${highest.advice})`}>
        Offers ₹{spread.toLocaleString()} premium (+{spreadPct}%) over lowest reporting terminal ({lowest.yard}).
      </Callout>

      {/* Tab 1: Today's Comparison (Color Coded Bars + Detailed Table) */}
      {activeTab === 'today' ? (
        <>
          <AgCard className="space-y-4 !p-4 sm:!p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-ink-900">
                  {crop} Prices Across Market Yards
                </h2>
                <p className="text-xs sm:text-sm text-ink-600">Green = Sell Now, Amber = Wait (sorted descending)</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold text-ink-600">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0A7A3B]" /> Sell Now</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Wait</span>
              </div>
            </div>

            <div className="h-[280px] sm:h-[300px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sorted} margin={{ top: 10, right: 10, left: -10, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF3EE" />
                  <XAxis dataKey="yard" stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 10 }} interval={0} angle={-30} textAnchor="end" />
                  <YAxis stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 11 }} domain={['dataMin - 500', 'dataMax + 200']} />
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
                  <Bar dataKey="price" name="Modal Price (₹/q)" radius={[6, 6, 0, 0]}>
                    {sorted.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.advice === 'Wait' ? '#F59E0B' : '#0A7A3B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AgCard>

          {/* Detailed Comparison Table (10 Yards) */}
          <AgCard className="space-y-4">
            <h2 className="text-lg font-bold text-ink-900">Detailed Comparison Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface text-ink-700 uppercase font-bold text-xs tracking-wider border-b border-black/5">
                  <tr>
                    <th className="py-3.5 px-4">Market Yard</th>
                    <th className="py-3.5 px-4">Current Price (₹/q)</th>
                    <th className="py-3.5 px-4">7d Change (%)</th>
                    <th className="py-3.5 px-4">Arrivals (q)</th>
                    <th className="py-3.5 px-4 text-right">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-medium text-ink-900">
                  {sorted.map((row, idx) => (
                    <tr key={row.yard} className={`hover:bg-brand-100/30 transition-colors ${idx === 0 ? 'bg-brand-100/20 font-bold' : ''}`}>
                      <td className="py-4 px-4 font-bold flex items-center gap-2">
                        {idx === 0 && <span className="text-amber-500">🏆</span>}
                        <span>{row.yard}</span>
                      </td>
                      <td className="py-4 px-4 font-black text-brand-900 text-base">₹{row.price.toLocaleString()}</td>
                      <td className={`py-4 px-4 font-bold ${row.change7d >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {row.change7d >= 0 ? `+${row.change7d}%` : `${row.change7d}%`}
                      </td>
                      <td className="py-4 px-4 text-ink-700">{row.arrivals.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right">
                        <AgBadge advice={row.advice} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AgCard>
        </>
      ) : (
        /* Tab 2: Ranking Tab (Single-Hue Rule: Best in --brand-900, rest neutral) */
        <AgCard className="space-y-6">
          <h2 className="text-base font-bold text-ink-900">
            Market Yard Ranking by Average Realization — {crop}
          </h2>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sorted} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF3EE" />
                <XAxis dataKey="yard" stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 10 }} interval={0} angle={-25} textAnchor="end" />
                <YAxis stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 11 }} domain={['dataMin - 500', 'dataMax + 200']} />
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
                <Bar dataKey="price" radius={[6, 6, 0, 0]}>
                  {sorted.map((_, index) => (
                    <Cell key={`cell-rank-${index}`} fill={index === 0 ? '#0A4D2E' : '#B8C4BA'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-ink-700 uppercase font-bold text-xs tracking-wider border-b border-black/5">
                <tr>
                  <th className="py-3.5 px-4">Rank</th>
                  <th className="py-3.5 px-4">Market Yard</th>
                  <th className="py-3.5 px-4">Average Price (₹)</th>
                  <th className="py-3.5 px-4">Total Arrivals (q)</th>
                  <th className="py-3.5 px-4">Difference from Min (₹)</th>
                  <th className="py-3.5 px-4 text-right">Premium (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 font-medium text-ink-900">
                {sorted.map((r, idx) => {
                  const diff = r.price - lowest.price;
                  const prem = lowest.price > 0 ? ((diff / lowest.price) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={r.yard} className={idx === 0 ? 'bg-brand-100/30 font-bold' : ''}>
                      <td className="py-3.5 px-4 text-ink-600 font-bold">#{idx + 1}</td>
                      <td className="py-3.5 px-4 font-bold">{r.yard}</td>
                      <td className="py-3.5 px-4 text-brand-900 font-black text-base">₹{r.price.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-ink-700">{r.arrivals.toLocaleString()}</td>
                      <td className="py-3.5 px-4">{diff === 0 ? '—' : `+₹${diff.toLocaleString()}`}</td>
                      <td className="py-3.5 px-4 text-right font-black text-emerald-800">{diff === 0 ? '0.0%' : `+${prem}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AgCard>
      )}

      {/* Price Spread Analysis (3 KPIs) */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-brand-900" />
          Price Spread Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard label="Highest Price" value={`₹${highest.price.toLocaleString()}`} subtext={highest.yard} />
          <KpiCard label="Lowest Price" value={`₹${lowest.price.toLocaleString()}`} subtext={lowest.yard} />
          <KpiCard label="Price Spread" value={`₹${spread.toLocaleString()}`} delta={`+${spreadPct}%`} subtext="Regional trade arbitrage gap" />
        </div>
      </div>
    </div>
  );
};
export default MarketComparisonPage;
