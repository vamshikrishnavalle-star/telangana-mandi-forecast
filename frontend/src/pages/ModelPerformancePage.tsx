import React from 'react';
import { MODEL_PERFORMANCE } from '../data/staticData';
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
import { Award, BarChart3, CheckCircle2 } from 'lucide-react';

export const ModelPerformancePage: React.FC = () => {
  // Sort by MAE ascending (best to worst)
  const sortedByMAE = [...MODEL_PERFORMANCE].sort((a, b) => a.mae - b.mae);

  // Gradient colors
  const redColors = ['#991b1b', '#dc2626', '#ea580c', '#f97316', '#fdba74'];
  const blueColors = ['#1e3a8a', '#2563eb', '#38bdf8', '#7dd3fc', '#bae6fd'];
  const greenColors = ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          📊 Model Performance
        </h1>
        <p className="text-xs text-slate-400">
          Validation metrics across historical datasets (2020–2026) evaluating 5 forecasting algorithms
        </p>
      </div>

      {/* Best Model Banner */}
      <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 flex items-center gap-3 text-emerald-200">
        <Award className="w-6 h-6 text-emerald-400 shrink-0" />
        <div>
          <p className="text-sm font-bold">
            🏆 Best Performing Model: Random Forest with MAE of ₹155.71 and MAPE of 1.66%
          </p>
          <p className="text-xs text-emerald-300/80">
            Achieves 74.8% Directional Accuracy with lowest Mean Absolute Scaled Error (0.632)
          </p>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white">
          Model Performance Metrics (Validated 2020–2026)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-300 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">MAE (₹/q)</th>
                <th className="py-3 px-4">RMSE (₹/q)</th>
                <th className="py-3 px-4">MAPE (%)</th>
                <th className="py-3 px-4">MASE</th>
                <th className="py-3 px-4">Directional Accuracy (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium text-slate-200">
              {sortedByMAE.map((m, idx) => (
                <tr
                  key={m.model}
                  className={`hover:bg-slate-800/60 transition-colors ${
                    idx === 0 ? 'bg-emerald-950/40 font-bold' : ''
                  }`}
                >
                  <td className="py-3 px-4 flex items-center gap-2">
                    {idx === 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    <span className="text-white">{m.model}</span>
                    {idx === 0 && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        Top Rank
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{m.mae.toFixed(2)}</td>
                  <td className="py-3 px-4">{m.rmse.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sky-400 font-bold">{m.mape.toFixed(2)}%</td>
                  <td className="py-3 px-4">{m.mase.toFixed(3)}</td>
                  <td className="py-3 px-4 text-amber-400">{m.da.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-side Bar Charts: MAE & MAPE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MAE Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Mean Absolute Error Comparison (₹/quintal)</h3>
            <p className="text-[11px] text-slate-400">Lower is better • Random Forest achieves ₹155.71/q</p>
          </div>

          <div className="h-[260px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedByMAE} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="model" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={0} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[100, 250]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="mae" name="MAE (₹/q)" radius={[4, 4, 0, 0]}>
                  {sortedByMAE.map((_, index) => (
                    <Cell key={`cell-mae-${index}`} fill={redColors[index % redColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MAPE Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Mean Absolute Percentage Error (%)</h3>
            <p className="text-[11px] text-slate-400">Lower is better • Evaluates relative error margin</p>
          </div>

          <div className="h-[260px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedByMAE} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="model" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={0} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 3]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="mape" name="MAPE (%)" radius={[4, 4, 0, 0]}>
                  {sortedByMAE.map((_, index) => (
                    <Cell key={`cell-mape-${index}`} fill={blueColors[index % blueColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Directional Accuracy Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Directional Accuracy by Model (%)</h2>
          <p className="text-xs text-slate-400">
            Percentage of times model accurately predicted the sign of price change (bullish vs. bearish)
          </p>
        </div>

        <div className="h-[260px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedByMAE} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="model" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="da" name="Directional Accuracy (%)" radius={[4, 4, 0, 0]}>
                {sortedByMAE.map((_, index) => (
                  <Cell key={`cell-da-${index}`} fill={greenColors[index % greenColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformancePage;
