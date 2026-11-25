import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Crop, YardSnapshot, loadSnapshot } from '../../services/dataLoader';
import { useLanguage } from '../../context/LanguageContext';

interface TickerItem {
  crop: Crop;
  yard: string;
  price: number;
  change7d: number;
}

const CROPS: Crop[] = ['Cotton', 'Chilli', 'Maize', 'Paddy', 'Turmeric'];

export const MandiTicker: React.FC = () => {
  const [items, setItems] = useState<TickerItem[]>([]);
  const { language, cropName, yardName } = useLanguage();

  useEffect(() => {
    let mounted = true;
    Promise.all(
      CROPS.map(async (crop) => {
        const snapshots: YardSnapshot[] = await loadSnapshot(crop);
        return snapshots.slice(0, 4).map((s) => ({
          crop,
          yard: s.yard,
          price: s.price,
          change7d: s.change7d,
        }));
      })
    ).then((grouped) => {
      if (!mounted) return;
      // Interleave crops so users see diverse commodities immediately
      const interleaved: TickerItem[] = [];
      const maxLen = Math.max(...grouped.map((g) => g.length), 0);
      for (let i = 0; i < maxLen; i++) {
        for (const group of grouped) {
          if (group[i]) interleaved.push(group[i]);
        }
      }
      setItems(interleaved);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (items.length === 0) return null;

  const liveLabel = language === 'te' ? 'లైవ్ మండి' : 'LIVE MANDI';

  const renderTrack = (keyPrefix: string) =>
    items.map((item, idx) => {
      const isUp = item.change7d >= 0;
      const absChange = Math.abs(item.change7d).toFixed(1);
      return (
        <Link
          key={`${keyPrefix}-${item.crop}-${item.yard}-${idx}`}
          to="/forecast"
          className="inline-flex items-center gap-2.5 px-4 py-1.5 border-r border-white/10 hover:bg-white/5 transition-colors shrink-0 group"
        >
          <span className="text-xs font-extrabold text-emerald-200 tracking-wide">
            {cropName(item.crop)}
          </span>
          <span className="text-xs font-medium text-white/75 group-hover:text-white transition-colors">
            {yardName(item.yard)}
          </span>
          <span className="text-xs sm:text-sm font-black text-white tabular-nums">
            ₹{item.price.toLocaleString()}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black tabular-nums ${
              isUp
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                : 'bg-red-500/20 text-red-300 border border-red-400/30'
            }`}
          >
            {isUp ? (
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-400" />
            )}
            <span>
              {isUp ? '▲ +' : '▼ -'}
              {absChange}%
            </span>
          </span>
        </Link>
      );
    });

  return (
    <div
      className="relative flex items-center bg-[#072B1A] text-white rounded-2xl sm:rounded-full border border-emerald-900/60 shadow-agfarm overflow-hidden"
      role="region"
      aria-label="Live Telangana Mandi Price Ticker"
    >
      {/* Pinned Live Indicator Badge */}
      <div className="relative z-10 flex items-center gap-2 bg-[#0A4D2E] px-3.5 sm:px-4 py-2.5 border-r border-white/15 shrink-0 shadow-[4px_0_12px_rgba(0,0,0,0.25)]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>
        <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-emerald-100 whitespace-nowrap">
          {liveLabel}
        </span>
      </div>

      {/* Seamless Scrolling Marquee Track */}
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-mandi-marquee items-center py-1">
          <div className="flex items-center shrink-0">{renderTrack('a')}</div>
          <div className="flex items-center shrink-0" aria-hidden="true">
            {renderTrack('b')}
          </div>
        </div>
        {/* Subtle right fade-out edge */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#072B1A] to-transparent" />
      </div>
    </div>
  );
};

export default MandiTicker;
