import React, { useEffect, useState } from 'react';
import { loadForecast, loadPriceHistory, Crop, ForecastResult, PricePoint } from '../services/dataLoader';
import { AgCard, KpiCard } from '../components/agfarm/Common';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, SlidersHorizontal } from 'lucide-react';

const CROPS: Crop[] = ['Cotton', 'Chilli', 'Maize', 'Paddy', 'Turmeric'];
const YARDS = [
  'Hyderabad RCI Market',
  'Warangal Gurramguda',
  'Karimnagar BCCL Market',
  'Nizamabad',
  'Khammam',
  'Adilabad',
  'Medak',
  'Suryapet',
  'Mahbubnagar',
  'Nalgonda'
];

export const ForecastPage: React.FC = () => {
  const [crop, setCrop] = useState<Crop>('Cotton');
  const [yard, setYard] = useState<string>('Hyderabad RCI Market');
  const [horizon, setHorizon] = useState<7 | 14>(7);

  const [history, setHistory] = useState<PricePoint[]>([]);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);

  useEffect(() => {
    loadPriceHistory(crop, yard).then(setHistory);
    loadForecast(crop, yard, horizon).then(setForecast);
  }, [crop, yard, horizon]);

  const lastObserved = history[history.length - 1];

  return (
    <div className="space-y-8">
      {/* 1. Header & Accessible Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-900 text-sm font-bold mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Time-Series Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">
            Price Forecast & <span className="font-serif italic font-normal text-brand-700">Predictive Intelligence</span>
          </h1>
          <p className="text-sm text-ink-600 mt-1.5">
            180-day modal price history combined with model-derived 95% Confidence Interval band
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 bg-card p-2.5 sm:p-2 rounded-2xl sm:rounded-full border border-black/5 shadow-agfarm-sm w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-2 sm:px-3">
            <SlidersHorizontal className="w-4 h-4 text-brand-900" />
            <span className="text-sm font-bold text-ink-600">Filters:</span>
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

          <select
            value={yard}
            onChange={(e) => setYard(e.target.value)}
            className="bg-surface text-ink-900 text-sm font-bold px-4 py-2 rounded-xl sm:rounded-full border border-black/5 focus:ring-2 focus:ring-brand-900 cursor-pointer w-full sm:w-auto"
          >
            {YARDS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <div className="flex items-center justify-center gap-1 bg-surface p-1 rounded-xl sm:rounded-full border border-black/5 w-full sm:w-auto">
            <button
              onClick={() => setHorizon(7)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg sm:rounded-full text-sm font-bold transition-all text-center ${
                horizon === 7 ? 'bg-brand-900 text-white' : 'text-ink-600 hover:text-brand-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setHorizon(14)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg sm:rounded-full text-sm font-bold transition-all text-center ${
                horizon === 14 ? 'bg-brand-900 text-white' : 'text-ink-600 hover:text-brand-900'
              }`}
            >
              14 Days
            </button>
          </div>
        </div>
      </div>

      {/* 2. 180-Day Price History Chart */}
      <AgCard className="space-y-4 !p-4 sm:!p-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-ink-900">
            Price History: {crop} at {yard} (Recent 180 Days)
          </h2>
          <p className="text-xs sm:text-sm text-ink-600">Modal price (solid blue) with daily Min and Max trade bands (dashed)</p>
        </div>

        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={history.slice(-90)} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF3EE" />
              <XAxis dataKey="date" stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 10 }} minTickGap={25} />
              <YAxis stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 11 }} domain={['dataMin - 300', 'dataMax + 300']} />
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
              <Legend wrapperStyle={{ paddingTop: '8px' }} />
              <Line type="monotone" dataKey="modal" name="Modal Price" stroke="#1D4ED8" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="max" name="Max Price" stroke="#16A34A" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="min" name="Min Price" stroke="#DC2626" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </AgCard>

      {/* 3. Forecast Chart & 95% Confidence Interval Band */}
      <AgCard className="space-y-4 !p-4 sm:!p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-ink-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              {horizon}-Day Price Forecast with 95% Confidence Interval Band
            </h2>
            <p className="text-xs sm:text-sm text-ink-600">
              Model: {forecast?.model || 'Random Forest'} • Validated test error interval
            </p>
          </div>
          <span className="text-xs sm:text-sm bg-brand-100 text-brand-900 font-bold px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-brand-900/10 self-start sm:self-auto">
            As of {forecast?.asOf || '2026-11-19'}
          </span>
        </div>

        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecast?.points || []} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF3EE" />
              <XAxis dataKey="date" stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 11 }} />
              <YAxis stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 11 }} domain={['dataMin - 200', 'dataMax + 200']} />
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
              <Legend wrapperStyle={{ paddingTop: '8px' }} />
              <Area type="monotone" dataKey="upper" name="Upper 95% Bound" stroke="transparent" fill="rgba(220, 38, 38, 0.12)" />
              <Area type="monotone" dataKey="lower" name="Lower 95% Bound" stroke="transparent" fill="rgba(220, 38, 38, 0.12)" />
              <Line type="monotone" dataKey="forecast" name="Forecast Price" stroke="#DC2626" strokeWidth={3} dot={{ r: 5, fill: '#DC2626' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </AgCard>

      {/* 4. 5 Summary KPI Cards (Exact match to doc spec) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <KpiCard
          label="Current Price"
          value={`₹${(lastObserved?.modal || forecast?.currentPrice || 0).toLocaleString()}`}
          unit="/q"
          subtext="Observed modal rate"
        />
        <KpiCard
          label={`${horizon}d Forecast Price`}
          value={`₹${(forecast?.forecastPrice || 0).toLocaleString()}`}
          delta={`${forecast?.expectedChangePct && forecast.expectedChangePct > 0 ? '+' : ''}${forecast?.expectedChangePct || 0}%`}
          unit="/q"
          subtext="Model prediction"
        />
        <KpiCard
          label={`Expected ${horizon}d Change`}
          value={`${forecast?.expectedChangePct && forecast.expectedChangePct > 0 ? '+' : ''}${forecast?.expectedChangePct || 0}%`}
          subtext="Net trend drift"
        />
        <KpiCard
          label="Forecast Range"
          value={`₹${forecast?.rangeMin.toLocaleString() || 0}`}
          unit={`– ₹${forecast?.rangeMax.toLocaleString() || 0}`}
          subtext="95% CI bound spread"
        />
        <div className="sm:col-span-2 lg:col-span-1">
          <KpiCard
            label="Confidence Score"
            value={`${((forecast?.confidence || 0.95) * 100).toFixed(1)}%`}
            subtext="Model validation score"
          />
        </div>
      </div>
    </div>
  );
};
export default ForecastPage;
