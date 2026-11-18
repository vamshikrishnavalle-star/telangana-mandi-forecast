import React from 'react';
import { ArrowUpRight, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export type RecommendationProps = {
  commodity: string;
  yard: string;
  currentPrice: number;
  recommendation: 'Wait 7 Days' | 'Wait 14 Days' | 'Sell Now';
  confidenceLevel: 'High' | 'Medium' | 'Low';
  expectedGainPct: number;
  netGainAmount: number;
  storageCost: number;
  riskDiscount: number;
  explanation: string;
};

export const RecommendationCard: React.FC<RecommendationProps> = ({
  commodity,
  yard,
  currentPrice,
  recommendation,
  confidenceLevel,
  expectedGainPct,
  netGainAmount,
  storageCost,
  riskDiscount,
  explanation,
}) => {
  const isWait = recommendation.startsWith('Wait');

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isWait
          ? 'bg-emerald-50/70 border-emerald-300 hover:shadow-emerald-100'
          : 'bg-amber-50/70 border-amber-300 hover:shadow-amber-100'
      } shadow-md`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {yard}
          </span>
          <h3 className="text-xl font-bold text-slate-900">{commodity}</h3>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isWait
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-amber-600 text-white shadow-sm'
          }`}
        >
          {isWait ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          <span>{recommendation}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 bg-white/80 rounded-xl border border-slate-100 mb-3">
        <div>
          <span className="text-[11px] text-slate-500">Current Mandi Price</span>
          <p className="text-lg font-bold text-slate-900">₹{currentPrice.toLocaleString()}<span className="text-xs font-normal text-slate-500">/q</span></p>
        </div>
        <div>
          <span className="text-[11px] text-slate-500">Projected Net Gain</span>
          <p className={`text-lg font-bold flex items-center ${isWait ? 'text-emerald-700' : 'text-slate-700'}`}>
            {isWait ? `+₹${netGainAmount.toLocaleString()}` : '₹0'}
            {isWait && <span className="text-xs ml-1 font-semibold text-emerald-600">(+{expectedGainPct.toFixed(1)}%)</span>}
          </p>
        </div>
      </div>

      {/* Cost deductions */}
      {isWait && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white/50 px-3 py-1.5 rounded-lg mb-3">
          <span>Storage Cost: -₹{storageCost.toFixed(0)}</span>
          <span>Risk Discount (2%): -₹{riskDiscount.toFixed(0)}</span>
          <span className="font-semibold text-emerald-800">Confidence: {confidenceLevel}</span>
        </div>
      )}

      <p className="text-xs text-slate-700 leading-relaxed bg-white/60 p-2.5 rounded-lg border border-slate-100">
        💡 {explanation}
      </p>
    </div>
  );
};

export default RecommendationCard;
