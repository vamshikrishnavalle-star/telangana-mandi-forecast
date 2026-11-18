import React, { useState } from 'react';
import GlassyDashboard from './components/ui/GlassyDashboard';
import Layout from './components/ui/Layout';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <GlassyDashboard workspaceName="Smart Mandi Telangana">
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'dashboard' && <Dashboard />}

        {activeTab === 'advisory' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">🌾 Comprehensive Sell-Time Advisory Guidelines</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              The recommendation engine applies economic decision optimization to daily modal prices:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h4 className="text-sm font-bold text-emerald-800">1. Net Gain Requirement</h4>
                <p className="text-xs text-slate-600 mt-1">Holding stocks is only advised when net return exceeds the 3% default margin after deducting storage costs.</p>
              </div>
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                <h4 className="text-sm font-bold text-sky-800">2. Storage Cost Deduction</h4>
                <p className="text-xs text-slate-600 mt-1">Calculated at 0.1% of crop value per holding day (covering warehouse rent, bag depreciation, and dry matter loss).</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <h4 className="text-sm font-bold text-amber-800">3. Risk Discount Safety Margin</h4>
                <p className="text-xs text-slate-600 mt-1">Deducts 2% of forecast value to protect farmers from unexpected market dips and weather supply shocks.</p>
              </div>
            </div>
            <div className="mt-6">
              <Dashboard />
            </div>
          </div>
        )}

        {activeTab === 'arbitrage' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-2">🏛️ Regional Mandi Arbitrage Finder</h2>
              <p className="text-xs text-slate-600">
                Prices vary significantly across Telangana districts. Check the map and table below to evaluate whether transporting crop stocks to a higher-paying mandi yields higher net profit.
              </p>
            </div>
            <Dashboard />
          </div>
        )}

        {activeTab === 'models' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">📊 ML Model Leaderboard (Validated on 2020–2026 Data)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Model</th>
                    <th className="py-3 px-4">MAE (₹/q)</th>
                    <th className="py-3 px-4">RMSE (₹/q)</th>
                    <th className="py-3 px-4">MAPE (%)</th>
                    <th className="py-3 px-4">MASE</th>
                    <th className="py-3 px-4">Directional Acc. (%)</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="bg-emerald-50/60 font-bold">
                    <td className="py-3 px-4 text-emerald-800">Random Forest</td>
                    <td className="py-3 px-4 text-emerald-800">₹155.71</td>
                    <td className="py-3 px-4">₹194.95</td>
                    <td className="py-3 px-4">1.66%</td>
                    <td className="py-3 px-4">0.632</td>
                    <td className="py-3 px-4">74.75%</td>
                    <td className="py-3 px-4"><span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full">Best Overall</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">XGBoost</td>
                    <td className="py-3 px-4">₹179.63</td>
                    <td className="py-3 px-4">₹222.57</td>
                    <td className="py-3 px-4">1.93%</td>
                    <td className="py-3 px-4">0.729</td>
                    <td className="py-3 px-4">62.63%</td>
                    <td className="py-3 px-4"><span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full">Top ML</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Moving Average (7d)</td>
                    <td className="py-3 px-4">₹189.05</td>
                    <td className="py-3 px-4">₹237.29</td>
                    <td className="py-3 px-4">2.03%</td>
                    <td className="py-3 px-4">0.767</td>
                    <td className="py-3 px-4">77.78%</td>
                    <td className="py-3 px-4"><span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full">Baseline</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">ARIMA(1,1,1)</td>
                    <td className="py-3 px-4">₹196.42</td>
                    <td className="py-3 px-4">₹248.58</td>
                    <td className="py-3 px-4">2.10%</td>
                    <td className="py-3 px-4">0.797</td>
                    <td className="py-3 px-4">77.78%</td>
                    <td className="py-3 px-4"><span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full">Time Series</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Naive</td>
                    <td className="py-3 px-4">₹216.84</td>
                    <td className="py-3 px-4">₹272.87</td>
                    <td className="py-3 px-4">2.32%</td>
                    <td className="py-3 px-4">0.880</td>
                    <td className="py-3 px-4">76.77%</td>
                    <td className="py-3 px-4"><span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full">Reference</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Layout>
    </GlassyDashboard>
  );
}
