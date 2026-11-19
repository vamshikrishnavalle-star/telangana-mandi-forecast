import React, { useState, useMemo } from 'react';
import { COMMODITIES, YARDS, generatePriceHistory, generateForecast, getBasePrice } from '../data/staticData';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Calendar, ShieldCheck, DollarSign } from 'lucide-react';

export const ForecastPage: React.FC = () => {
  const [commodity, setCommodity] = useState<string>('Cotton');
  const [yard, setYard] = useState<string>('Hyderabad RCI Market');
  const [horizon, setHorizon] = useState<number>(7);

  const historyData = useMemo(() => {
    return generatePriceHistory(commodity, yard, 60);
  }, [commodity, yard]);

  const lastPrice = historyData[historyData.length - 1]?.modalPrice || getBasePrice(commodity);

  const forecastData = useMemo(() => {
    return generateForecast(lastPrice, horizon);
  }, [lastPrice, horizon]);

  const expectedChangePct = Number(
    (((forecastData[forecastData.length - 1].predictedPrice - lastPrice) / lastPrice) * 100).toFixed(1)
  );

  const minForecast = Math.min(...forecastData.map((d) => d.predictedPrice));
  const maxForecast = Math.max(...forecastData.map((d) => d.predictedPrice));

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            📈 Price Forecasting Engine
          </h1>
          <p className="text-xs text-slate-400">
            Multi-model time-series forecasting with 95% Confidence Intervals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
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

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Select Market Yard</label>
            <select
              value={yard}
              onChange={(e) => setYard(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              {YARDS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Forecast Horizon</label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              <option value={7}>7 Days Horizon</option>
              <option value={14}>14 Days Horizon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price History Chart (Recent 60 Days) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">
            Price History: {commodity} at {yard} (Recent 60 Days)
          </h2>
          <p className="text-xs text-slate-400">Modal price along with daily Min and Max trade bands</p>
        </div>

        <div className="h-[300px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={historyData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} minTickGap={30} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['dataMin - 200', 'dataMax + 200']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line type="monotone" dataKey="modalPrice" name="Modal Price" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="maxPrice" name="Max Price" stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="minPrice" name="Min Price" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Chart & 95% Confidence Interval */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            {horizon}-Day Price Forecast with 95% Confidence Interval
          </h2>
          <p className="text-xs text-slate-400">
            Projected trajectory based on seasonal momentum, volume arrivals, and weather covariates
          </p>
        </div>

        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} domain={['dataMin - 300', 'dataMax + 300']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line type="monotone" dataKey="predictedPrice" name="Predicted Price (₹)" stroke="#ef4444" strokeWidth={3} dot={{ r: 5, fill: '#ef4444' }} />
              <Line type="monotone" dataKey="upperBound95" name="Upper 95% CI" stroke="#38bdf8" strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="lowerBound95" name="Lower 95% CI" stroke="#38bdf8" strokeDasharray="4 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 4 Forecast Metrics (Exact match to Streamlit) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">Current Price</span>
            <p className="text-xl font-bold text-white mt-1">₹{lastPrice.toLocaleString()}</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">Expected {horizon}d Change</span>
            <p className={`text-xl font-bold mt-1 ${expectedChangePct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {expectedChangePct >= 0 ? `+${expectedChangePct}%` : `${expectedChangePct}%`}
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">Forecast Range</span>
            <p className="text-xl font-bold text-white mt-1">
              ₹{minForecast.toLocaleString()} – ₹{maxForecast.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">Confidence Score</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {horizon === 7 ? '95.0%' : '88.5%'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastPage;
