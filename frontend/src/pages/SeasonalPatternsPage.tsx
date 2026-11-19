import React, { useEffect, useState } from 'react';
import { loadSeasonal, Crop, SeasonalData } from '../services/dataLoader';
import { AgCard, KpiCard, Callout } from '../components/agfarm/Common';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Sprout, SlidersHorizontal, Sun, CloudRain } from 'lucide-react';

const CROPS: Crop[] = ['Cotton', 'Chilli', 'Maize', 'Paddy', 'Turmeric'];

export const SeasonalPatternsPage: React.FC = () => {
  const [crop, setCrop] = useState<Crop>('Cotton');
  const [data, setData] = useState<SeasonalData | null>(null);

  useEffect(() => {
    loadSeasonal(crop).then(setData);
  }, [crop]);

  const discount = data?.discountPct || -8.3;
  const isDiscount = discount < 0;

  return (
    <div className="space-y-8">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-900 text-sm font-bold mb-2">
            <Sprout className="w-4 h-4" />
            <span>Agronomic Seasonality</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">
            Seasonal Patterns & <span className="font-serif italic font-normal text-brand-700">Multi-Year Cycles</span>
          </h1>
          <p className="text-sm text-ink-600 mt-1.5">
            Intra-annual seasonal cycles, Kharif vs. Rabi price comparisons, and 7-year multi-year inflation trend
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-card p-2 rounded-full border border-black/5 shadow-agfarm-sm">
          <div className="flex items-center gap-1.5 px-3">
            <SlidersHorizontal className="w-4 h-4 text-brand-900" />
            <span className="text-sm font-bold text-ink-700">Crop:</span>
          </div>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value as Crop)}
            className="bg-surface text-ink-900 text-sm font-bold px-4 py-2 rounded-full border border-black/5 focus:ring-2 focus:ring-brand-900 cursor-pointer"
          >
            {CROPS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Monthly Seasonal Line Chart */}
      <AgCard className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-ink-900">
            Seasonal Monthly Price Patterns — {crop}
          </h2>
          <p className="text-xs sm:text-sm text-ink-600">Average historical realization across all 12 calendar months (₹/quintal)</p>
        </div>

        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.monthly || []} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF3EE" />
              <XAxis dataKey="monthName" stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 12 }} />
              <YAxis stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 12 }} domain={['dataMin - 300', 'dataMax + 300']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 8px 24px rgba(16,24,20,0.06)',
                  color: '#111613',
                  fontSize: '13px',
                }}
              />
              <Line
                type="monotone"
                dataKey="avgPrice"
                name="Average Price (₹)"
                stroke="#1D4ED8"
                strokeWidth={3}
                dot={{ r: 5, fill: '#1D4ED8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </AgCard>

      {/* 2. Kharif vs Rabi Comparison & Corrected Wording */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-ink-900">Kharif vs Rabi Season Comparison</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card rounded-[20px] p-5 border border-black/5 shadow-agfarm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E7F1FB] flex items-center justify-center text-[#1D4ED8]">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-semibold text-ink-700">Kharif Season Avg (Monsoon)</span>
              <div className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight mt-0.5">
                ₹{data?.kharifAvg.toLocaleString() || 0}
                <span className="text-sm font-normal text-ink-600 ml-1">/q</span>
              </div>
              <p className="text-xs text-ink-600 mt-1">June to November peak arrivals</p>
            </div>
          </div>

          <div className="bg-card rounded-[20px] p-5 border border-black/5 shadow-agfarm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-semibold text-ink-700">Rabi Season Avg (Winter / Summer)</span>
              <div className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight mt-0.5">
                ₹{data?.rabiAvg.toLocaleString() || 0}
                <span className="text-sm font-normal text-ink-600 ml-1">/q</span>
              </div>
              <p className="text-xs text-ink-600 mt-1">December to May harvest market</p>
            </div>
          </div>
        </div>

        {/* Wording fix from DESIGN.md issue 8: "Kharif discount: X% below Rabi" */}
        <Callout kind="info" title="Seasonal Price Dynamic">
          {isDiscount
            ? `Kharif discount: ${Math.abs(discount)}% below Rabi season due to concentrated monsoon arrivals entering state market yards simultaneously.`
            : `Kharif premium: +${discount}% compared to Rabi season for ${crop}.`}
        </Callout>
      </div>

      {/* 3. 7-Year Multi-Year Price Trends (2020–2026) */}
      <AgCard className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-ink-900">
            Multi-Year Price Trend (2020–2026) — {crop}
          </h2>
          <p className="text-xs sm:text-sm text-ink-600">7-year annual modal realization across all Telangana yards (₹/quintal)</p>
        </div>

        <div className="h-[250px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.yearly || []} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF3EE" />
              <XAxis dataKey="year" stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 12 }} />
              <YAxis stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 12 }} domain={['dataMin - 500', 'dataMax + 500']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 8px 24px rgba(16,24,20,0.06)',
                  color: '#111613',
                  fontSize: '13px',
                }}
              />
              <Line
                type="monotone"
                dataKey="avg"
                name="Annual Average (₹)"
                stroke="#0A4D2E"
                strokeWidth={3}
                dot={{ r: 5, fill: '#0A4D2E' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </AgCard>
    </div>
  );
};
export default SeasonalPatternsPage;
