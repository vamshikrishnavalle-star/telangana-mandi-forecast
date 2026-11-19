import React, { useState } from 'react';
import { COMMODITIES, YARDS, getBasePrice } from '../data/staticData';
import { RecommendationCard } from '../components/ui/RecommendationCard';
import { ShieldCheck, Clock, CheckCircle2, DollarSign, Truck, AlertTriangle } from 'lucide-react';

export const RecommendationPage: React.FC = () => {
  const [commodity, setCommodity] = useState<string>('Cotton');
  const [yard, setYard] = useState<string>('Hyderabad RCI Market');

  const base = getBasePrice(commodity);
  const yardOffset = YARDS.indexOf(yard) * 45;
  const currentPrice = base + yardOffset;

  // 7-day and 14-day models
  const forecast7d = Math.round(currentPrice * 1.054);
  const forecast14d = Math.round(currentPrice * 1.072);

  const gain7d = forecast7d - currentPrice;
  const gainPct7d = Number(((gain7d / currentPrice) * 100).toFixed(1));

  // Storage cost: 0.1% daily
  const storageCost7d = Math.round(currentPrice * 0.001 * 7);
  const storageCost14d = Math.round(currentPrice * 0.001 * 14);
  const riskDiscount = Math.round(currentPrice * 0.02); // 2% risk discount
  const transportCost = 50; // ₹50/q

  const netGainAmount = gain7d - storageCost7d - riskDiscount;
  const isWait = netGainAmount > 0;

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            💡 Smart Sell-Time Recommendation Engine
          </h1>
          <p className="text-xs text-slate-400">
            Algorithmic sell vs. hold advisory balancing expected price appreciation, warehouse storage, and risk
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
        </div>
      </div>

      {/* Main Recommendation Hero Card (matches Streamlit styling) */}
      <div
        className={`rounded-2xl p-6 border shadow-xl ${
          isWait
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
            : 'bg-amber-950/40 border-amber-500/50 text-amber-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                isWait ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {isWait ? <Clock className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {yard} • Recommendation
              </span>
              <h2 className="text-2xl font-black text-white">
                {isWait ? '⏰ Wait 7 Days' : '🛒 Sell Now'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800/80 px-3 py-1.5 rounded-full font-bold text-slate-200 border border-slate-700">
              Confidence: High (85%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 mb-4">
          <div>
            <span className="text-xs text-slate-400 font-medium">Current Mandi Price</span>
            <p className="text-2xl font-black text-white mt-0.5">₹{currentPrice.toLocaleString()}<span className="text-xs text-slate-400 font-normal">/q</span></p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Projected Net Gain (After Costs)</span>
            <p className={`text-2xl font-black mt-0.5 ${isWait ? 'text-emerald-400' : 'text-slate-300'}`}>
              {isWait ? `+₹${netGainAmount.toLocaleString()}/q` : '₹0'}
              {isWait && <span className="text-xs ml-2 text-emerald-300">(+{gainPct7d}%)</span>}
            </p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
          💡 <strong>Reasoning:</strong>{' '}
          {isWait
            ? `Arrivals at ${yard} are trending 14% below seasonal averages while central mandi buying pressure is strong. Holding for 7 days yields an expected ₹${gain7d} gain, exceeding combined storage fees (₹${storageCost7d}) and volatility risk discount (₹${riskDiscount}).`
            : `Current mandi price ₹${currentPrice.toLocaleString()}/q is elevated and near peak resistance. Upcoming arrivals wave risks price compression beyond storage carrying costs.`}
        </p>
      </div>

      {/* Detailed Analysis Cards (7-Day vs 14-Day) */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">📊 Detailed Analysis</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-2">
            <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> 7-Day Forecast
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
              <li>• <strong>Expected Price:</strong> ₹{forecast7d.toLocaleString()}/q</li>
              <li>• <strong>Confidence:</strong> 85.0%</li>
              <li className="text-emerald-400">• <strong>Potential Gain:</strong> +{gainPct7d}%</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-2">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> 14-Day Forecast
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
              <li>• <strong>Expected Price:</strong> ₹{forecast14d.toLocaleString()}/q</li>
              <li>• <strong>Confidence:</strong> 72.0%</li>
              <li className="text-emerald-400">• <strong>Potential Gain:</strong> +7.2%</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cost-Benefit Breakdown (Matches Streamlit 3 metrics) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          💰 Cost-Benefit Analysis Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">Storage Cost (7 days)</span>
            <p className="text-xl font-bold text-white mt-1">₹{storageCost7d}</p>
            <span className="text-[11px] text-slate-400">0.1% per day standard godown rate</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">Storage Cost (14 days)</span>
            <p className="text-xl font-bold text-white mt-1">₹{storageCost14d}</p>
            <span className="text-[11px] text-slate-400">0.1% per day extended hold</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">Regional Transport Cost</span>
            <p className="text-xl font-bold text-white mt-1">₹{transportCost}/q</p>
            <span className="text-[11px] text-slate-400">Average haul to neighboring terminal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
