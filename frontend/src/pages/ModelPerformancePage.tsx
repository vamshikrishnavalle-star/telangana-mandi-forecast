import React, { useEffect, useState } from 'react';
import { loadModels, ModelMetrics } from '../services/dataLoader';
import { AgCard, Callout } from '../components/agfarm/Common';
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
import { BarChart3, CheckCircle2 } from 'lucide-react';

export const ModelPerformancePage: React.FC = () => {
  const [models, setModels] = useState<ModelMetrics[]>([]);

  useEffect(() => {
    loadModels().then(setModels);
  }, []);

  const sortedByMAE = [...models].sort((a, b) => a.mae - b.mae);
  const bestModel = sortedByMAE[0] || { model: 'Random Forest', mae: 155.71, mape: 1.66 };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-900 text-sm font-bold mb-2">
          <BarChart3 className="w-4 h-4" />
          <span>Evaluation Benchmark</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">
          Model Performance & <span className="font-serif italic font-normal text-brand-700">Validation Benchmark</span>
        </h1>
        <p className="text-sm text-ink-600 mt-1.5">
          Rigorous out-of-sample backtesting against 7 years of Telangana daily mandi arrivals (2020–2026)
        </p>
      </div>

      {/* Dynamic Best Model Callout Banner */}
      <Callout
        kind="success"
        title={`Best Performing Model: ${bestModel.model} with MAE of ₹${bestModel.mae.toFixed(2)} and MAPE of ${bestModel.mape.toFixed(2)}%`}
      >
        Criterion: lowest Mean Absolute Error across test folds. Minimizes rupee-per-quintal prediction deviation.
      </Callout>

      {/* Validation Metrics Table */}
      <AgCard className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-ink-900">
          Model Performance Metrics (Validated 2020–2026)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-ink-700 uppercase font-bold text-xs tracking-wider border-b border-black/5">
              <tr>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">MAE (₹/q)</th>
                <th className="py-3 px-4">RMSE (₹/q)</th>
                <th className="py-3 px-4">MAPE (%)</th>
                <th className="py-3 px-4">MASE</th>
                <th className="py-3 px-4 text-right">Directional Accuracy (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 font-medium text-ink-900">
              {sortedByMAE.map((m, idx) => (
                <tr key={m.model} className={`hover:bg-brand-100/30 transition-colors ${idx === 0 ? 'bg-brand-100/20 font-bold' : ''}`}>
                  <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                    {idx === 0 && <CheckCircle2 className="w-4 h-4 text-brand-900" />}
                    <span>{m.model}</span>
                    {idx === 0 && (
                      <span className="text-xs bg-brand-900 text-white px-2.5 py-0.5 rounded-full font-bold ml-1">
                        Best Performer
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-black text-base text-brand-900">₹{m.mae.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-ink-700">₹{m.rmse.toFixed(2)}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-800">{m.mape.toFixed(2)}%</td>
                  <td className="py-3.5 px-4 text-ink-700">{m.mase.toFixed(3)}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-ink-900">{m.directionalAccuracy.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AgCard>

      {/* Single-Hue Charts Rule: Best model in --brand-900 (#0A4D2E), rest in neutral (#B8C4BA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MAE Chart */}
        <AgCard className="space-y-4 !p-4 sm:!p-6">
          <div>
            <h2 className="text-base font-bold text-ink-900">Mean Absolute Error (₹/quintal)</h2>
            <p className="text-xs sm:text-sm text-ink-600">Lower is better • Sorted ascending by prediction error</p>
          </div>
          <div className="h-[260px] sm:h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedByMAE} margin={{ top: 10, right: 10, left: -10, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF3EE" />
                <XAxis dataKey="model" stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 11 }} interval={0} angle={-25} textAnchor="end" />
                <YAxis stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 11 }} domain={[100, 250]} />
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
                <Bar dataKey="mae" name="MAE (₹/q)" radius={[6, 6, 0, 0]}>
                  {sortedByMAE.map((_, index) => (
                    <Cell key={`cell-mae-${index}`} fill={index === 0 ? '#0A4D2E' : '#B8C4BA'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AgCard>

        {/* MAPE Chart */}
        <AgCard className="space-y-4 !p-4 sm:!p-6">
          <div>
            <h2 className="text-base font-bold text-ink-900">Mean Absolute Percentage Error (%)</h2>
            <p className="text-xs sm:text-sm text-ink-600">Lower is better • Measures relative percentage deviation</p>
          </div>
          <div className="h-[260px] sm:h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedByMAE} margin={{ top: 10, right: 10, left: -10, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF3EE" />
                <XAxis dataKey="model" stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 11 }} interval={0} angle={-25} textAnchor="end" />
                <YAxis stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 11 }} domain={[0, 3]} />
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
                <Bar dataKey="mape" name="MAPE (%)" radius={[6, 6, 0, 0]}>
                  {sortedByMAE.map((_, index) => (
                    <Cell key={`cell-mape-${index}`} fill={index === 0 ? '#0A4D2E' : '#B8C4BA'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AgCard>
      </div>

      {/* Directional Accuracy Chart */}
      <AgCard className="space-y-4 !p-4 sm:!p-6">
        <div>
          <h2 className="text-base font-bold text-ink-900">Directional Accuracy by Model (%)</h2>
          <p className="text-xs sm:text-sm text-ink-600">Higher is better • Evaluates correctness of price direction sign</p>
        </div>
        <div className="h-[260px] sm:h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedByMAE} margin={{ top: 10, right: 10, left: -10, bottom: 35 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF3EE" />
              <XAxis dataKey="model" stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 11 }} interval={0} angle={-25} textAnchor="end" />
              <YAxis stroke="#8A948D" tick={{ fill: '#5B665F', fontSize: 11 }} domain={[0, 100]} />
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
              <Bar dataKey="directionalAccuracy" name="Directional Accuracy (%)" radius={[6, 6, 0, 0]}>
                {sortedByMAE.map((entry) => (
                  <Cell key={`cell-da-${entry.model}`} fill={entry.directionalAccuracy > 75 ? '#0A4D2E' : '#B8C4BA'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AgCard>
    </div>
  );
};
export default ModelPerformancePage;
