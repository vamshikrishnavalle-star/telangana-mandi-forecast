import React, { useEffect, useState } from 'react';
import { loadSnapshot, Crop, YardSnapshot } from '../services/dataLoader';
import { AgCard, AgBadge, Callout } from '../components/agfarm/Common';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Clock, CheckCircle2, DollarSign, Truck, SlidersHorizontal, Calculator } from 'lucide-react';

const CROPS: Crop[] = ['Cotton', 'Chilli', 'Maize', 'Paddy', 'Turmeric'];

export const RecommendationPage: React.FC = () => {
  const { t, cropName, yardName } = useLanguage();
  const [crop, setCrop] = useState<Crop>('Cotton');
  const [quantity, setQuantity] = useState<number>(50); // quintals
  const [snapshots, setSnapshots] = useState<YardSnapshot[]>([]);
  const [selectedYardName, setSelectedYardName] = useState<string>('Hyderabad RCI Market');

  useEffect(() => {
    loadSnapshot(crop).then((data) => {
      setSnapshots(data);
      if (data.length > 0 && !data.find((d) => d.yard === selectedYardName)) {
        setSelectedYardName(data[0].yard);
      }
    });
  }, [crop]);

  const activeYard = snapshots.find((s) => s.yard === selectedYardName) || snapshots[0] || {
    yard: 'Hyderabad RCI Market',
    price: 8903,
    advice: 'Sell Now',
    change7d: -1.1,
  };

  const isWait = activeYard.advice === 'Wait';
  const price = activeYard.price;
  
  // Cost-benefit calculations
  const expectedGainPct = isWait ? Math.max(3.5, activeYard.change7d) : 0.8;
  const grossGainPerQ = Math.round(price * (expectedGainPct / 100));
  const storageCost7dPerQ = Math.round(price * 0.001 * 7); // 0.1% daily
  const riskDiscountPerQ = Math.round(price * 0.02); // 2% risk discount
  const netGainPerQ = isWait ? grossGainPerQ - storageCost7dPerQ - riskDiscountPerQ : 0;
  
  const totalRevenueToday = price * quantity;
  const totalNetGainWait = netGainPerQ * quantity;

  // Arbitrage: Find highest yard vs selected
  const bestYard = [...snapshots].sort((a, b) => b.price - a.price)[0] || activeYard;
  const priceDiffPerQ = bestYard.price - activeYard.price;
  const estTransportCostPerQ = bestYard.yard === activeYard.yard ? 0 : 50; // ₹50/q haul
  const netArbitragePerQ = priceDiffPerQ - estTransportCostPerQ;

  return (
    <div className="space-y-8">
      {/* 1. Header & Crop/Quantity Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-900 text-sm font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('rec.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">
            {t('rec.title_pre')}{' '}
            <span className="font-serif italic font-normal text-brand-700">{t('rec.title_highlight')}</span>
          </h1>
          <p className="text-sm text-ink-600 mt-1.5">
            {t('rec.desc')}
          </p>
        </div>

        {/* Inputs Bar */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 bg-card p-2.5 rounded-2xl sm:rounded-full border border-black/5 shadow-agfarm-sm w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-900" />
            <span className="text-sm font-bold text-ink-700">{t('rec.crop')}</span>
          </div>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value as Crop)}
            className="bg-surface text-ink-900 text-sm font-bold px-4 py-2 rounded-xl sm:rounded-full border border-black/5 focus:ring-2 focus:ring-brand-900 cursor-pointer w-full sm:w-auto"
          >
            {CROPS.map((c) => (
              <option key={c} value={c}>{cropName(c)}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 sm:gap-1.5 px-2 sm:border-l border-black/5 pt-2 sm:pt-0 border-t sm:border-t-0">
            <div className="flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-brand-900" />
              <span className="text-sm font-bold text-ink-700">{t('rec.quantity')}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <input
                type="number"
                min={1}
                max={1000}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-20 sm:w-24 bg-surface text-ink-900 text-sm font-black px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-full border border-black/5 focus:ring-2 focus:ring-brand-900"
              />
              <span className="text-sm font-bold text-ink-600 pr-1">{t('rec.quintals')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Decision Card (AgFarm style) */}
      <div
        className={`rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 border shadow-agfarm transition-all ${
          isWait
            ? 'bg-[#FEF3C7]/40 border-[#F59E0B]/30'
            : 'bg-[#E5F4E4]/60 border-[#0A7A3B]/30'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-black/5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-sm shrink-0 ${
                isWait ? 'bg-[#F59E0B] text-white' : 'bg-[#0A7A3B] text-white'
              }`}
            >
              {isWait ? <Clock className="w-6 h-6 sm:w-7 sm:h-7" /> : <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-ink-700 uppercase tracking-wider">
                  {t('rec.target_mandi')} {yardName(activeYard.yard)}
                </span>
                <AgBadge advice={activeYard.advice} />
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-ink-900 tracking-tight mt-1">
                {isWait ? (
                  <>
                    {t('rec.wait_headline_pre')}{' '}
                    <span className="font-serif italic font-normal text-brand-700">{t('rec.wait_headline_post')}</span>
                  </>
                ) : (
                  <>
                    {t('rec.sell_headline_pre')}{' '}
                    <span className="font-serif italic font-normal text-brand-700">{t('rec.sell_headline_post')}</span>
                  </>
                )}
              </h2>
            </div>
          </div>

          <div className="bg-card px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl sm:rounded-full border border-black/5 shadow-sm text-left sm:text-right self-start sm:self-auto">
            <span className="text-[10px] sm:text-xs font-bold text-ink-500 uppercase tracking-wider block">{t('rec.confidence_label')}</span>
            <span className="text-sm sm:text-base font-black text-brand-900">{t('rec.confidence_val')}</span>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-5 sm:pt-6">
          <div className="bg-card rounded-[20px] p-4 sm:p-5 border border-black/5">
            <span className="text-xs sm:text-sm font-semibold text-ink-700">
              {t('rec.today_rev', { qty: quantity })}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-ink-900 mt-1">
              ₹{totalRevenueToday.toLocaleString()}
            </div>
            <span className="text-xs sm:text-sm text-ink-600 block mt-0.5">
              {t('rec.spot_rate', { price: price.toLocaleString() })}
            </span>
          </div>

          <div className="bg-card rounded-[20px] p-4 sm:p-5 border border-black/5">
            <span className="text-xs sm:text-sm font-semibold text-ink-700">{t('rec.net_gain')}</span>
            <div className={`text-2xl sm:text-3xl font-black mt-1 ${isWait ? 'text-emerald-700' : 'text-ink-600'}`}>
              {isWait ? `+₹${totalNetGainWait.toLocaleString()}` : '₹0'}
            </div>
            <span className="text-xs sm:text-sm text-ink-600 block mt-0.5">
              {isWait
                ? t('rec.net_gain_wait', { val: netGainPerQ })
                : t('rec.net_gain_sell')}
            </span>
          </div>

          <div className="bg-card rounded-[20px] p-4 sm:p-5 border border-black/5">
            <span className="text-xs sm:text-sm font-semibold text-ink-700">{t('rec.proj_price')}</span>
            <div className="text-2xl sm:text-3xl font-black text-brand-900 mt-1">
              ₹{Math.round(price * (1 + expectedGainPct / 100)).toLocaleString()}
            </div>
            <span className="text-xs sm:text-sm text-ink-600 block mt-0.5">
              {t('rec.proj_traj', { pct: expectedGainPct })}
            </span>
          </div>
        </div>

        {/* Recommendation Reasoning */}
        <p className="mt-6 text-sm text-ink-700 leading-relaxed bg-card/80 p-4 rounded-[16px] border border-black/5">
          <strong className="text-ink-900 font-bold">{t('rec.rationale_label')}</strong>{' '}
          {isWait
            ? t('rec.rationale_wait', {
                yard: yardName(activeYard.yard),
                pct: activeYard.change7d,
                gain: grossGainPerQ,
                storage: storageCost7dPerQ,
                risk: riskDiscountPerQ
              })
            : t('rec.rationale_sell', {
                yard: yardName(activeYard.yard),
                price: price.toLocaleString(),
                storage: storageCost7dPerQ
              })}
        </p>
      </div>

      {/* 3. Cost-Benefit & Arbitrage Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost-Benefit Breakdown */}
        <AgCard className="space-y-4">
          <div className="flex items-center gap-2 text-brand-900">
            <DollarSign className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-ink-900">{t('rec.cost_benefit_title')}</h2>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface">
              <span className="font-semibold text-ink-700">{t('rec.cb_gross')}</span>
              <span className="font-black text-base text-emerald-700">+₹{grossGainPerQ}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface">
              <span className="font-semibold text-ink-700">{t('rec.cb_storage')}</span>
              <span className="font-black text-base text-red-600">-₹{storageCost7dPerQ}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface">
              <span className="font-semibold text-ink-700">{t('rec.cb_risk')}</span>
              <span className="font-black text-base text-red-600">-₹{riskDiscountPerQ}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-brand-100/60 border border-brand-900/10 font-bold">
              <span className="text-brand-900 text-sm sm:text-base font-bold">{t('rec.cb_net')}</span>
              <span className={`font-black text-base sm:text-lg ${netGainPerQ > 0 ? 'text-brand-900' : 'text-red-700'}`}>
                {netGainPerQ > 0 ? `+₹${netGainPerQ}/q` : `-₹${Math.abs(netGainPerQ)}/q`}
              </span>
            </div>
          </div>
        </AgCard>

        {/* Inter-Mandi Arbitrage Panel */}
        <AgCard className="space-y-4">
          <div className="flex items-center gap-2 text-brand-900">
            <Truck className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-ink-900">{t('rec.arb_title')}</h2>
          </div>

          {bestYard.yard !== activeYard.yard ? (
            <div className="space-y-3">
              <Callout kind="info" title={t('rec.arb_opp_title', { yard: yardName(bestYard.yard) })}>
                {t('rec.arb_opp_desc', {
                  diff: priceDiffPerQ,
                  net: netArbitragePerQ,
                  total: (netArbitragePerQ * quantity).toLocaleString(),
                  qty: quantity
                })}
              </Callout>

              <div className="space-y-2 text-sm pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface">
                  <span className="text-ink-700 font-medium">{t('rec.arb_local_price', { yard: yardName(activeYard.yard) })}</span>
                  <span className="font-bold text-ink-900">₹{activeYard.price.toLocaleString()}/q</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface">
                  <span className="text-ink-700 font-medium">{t('rec.arb_high_price', { yard: yardName(bestYard.yard) })}</span>
                  <span className="font-black text-brand-900 text-base">₹{bestYard.price.toLocaleString()}/q</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface">
                  <span className="text-ink-700 font-medium">{t('rec.arb_transport')}</span>
                  <span className="font-bold text-red-600">₹{estTransportCostPerQ}/q</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-surface text-center space-y-2 text-sm">
              <p className="font-bold text-brand-900 text-base">{t('rec.arb_best_already')}</p>
              <p className="text-ink-600">{t('rec.arb_best_already_desc')}</p>
            </div>
          )}
        </AgCard>
      </div>

      {/* 4. All Mandis Advisory Matrix */}
      <AgCard className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-ink-900">
          {t('rec.matrix_title', { crop: cropName(crop) })}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-ink-700 uppercase font-bold text-xs tracking-wider border-b border-black/5">
              <tr>
                <th className="py-3 px-4">{t('rec.th_yard')}</th>
                <th className="py-3 px-4">{t('rec.th_today')}</th>
                <th className="py-3 px-4">{t('rec.th_trend')}</th>
                <th className="py-3 px-4">{t('rec.th_advice')}</th>
                <th className="py-3 px-4 text-right">{t('rec.th_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 font-medium text-ink-900">
              {snapshots.map((s) => (
                <tr
                  key={s.yard}
                  className={`hover:bg-brand-100/30 transition-colors ${
                    s.yard === activeYard.yard ? 'bg-brand-100/20 font-bold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold">{yardName(s.yard)}</td>
                  <td className="py-3.5 px-4 font-black text-base text-brand-900">₹{s.price.toLocaleString()}</td>
                  <td className={`py-3.5 px-4 font-bold ${s.change7d >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {s.change7d >= 0 ? `+${s.change7d}%` : `${s.change7d}%`}
                  </td>
                  <td className="py-3.5 px-4">
                    <AgBadge advice={s.advice} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {s.yard !== activeYard.yard && (
                      <button
                        onClick={() => setSelectedYardName(s.yard)}
                        className="text-sm font-bold text-brand-900 hover:text-brand-700 underline"
                      >
                        {t('rec.btn_calc')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AgCard>
    </div>
  );
};
export default RecommendationPage;
