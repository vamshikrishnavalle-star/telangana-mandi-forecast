import React, { useState } from 'react';
import TelanganaMap, { defaultMarketYards, haversineDistance } from '../components/ui/TelanganaMap';
import RecommendationCard from '../components/ui/RecommendationCard';
import { MapPin, Navigation, TrendingUp, DollarSign, Calendar, ShieldCheck } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [selectedYard, setSelectedYard] = useState<string>('Hyderabad RCI Market');
  const [showDistances, setShowDistances] = useState<boolean>(true);
  const [selectedCrop, setSelectedCrop] = useState<string>('Cotton');

  // Currently selected yard object
  const currentYardObj = defaultMarketYards.find((y) => y.name === selectedYard) || defaultMarketYards[0];

  // Recommendations data
  const sampleRecommendations = [
    {
      commodity: 'Cotton',
      yard: selectedYard,
      currentPrice: currentYardObj.currentPrice,
      recommendation: 'Wait 7 Days' as const,
      confidenceLevel: 'High' as const,
      expectedGainPct: 5.4,
      netGainAmount: 305,
      storageCost: 39,
      riskDiscount: 119,
      explanation: 'Bullish arrivals deficit in central mandis. Price projected to reach ₹5,955/q (+5.4%) in 7 days after factoring 0.1%/day storage and 2% risk discount.',
    },
    {
      commodity: 'Chilli',
      yard: selectedYard,
      currentPrice: 13500,
      recommendation: 'Wait 14 Days' as const,
      confidenceLevel: 'Medium' as const,
      expectedGainPct: 7.2,
      netGainAmount: 970,
      storageCost: 189,
      riskDiscount: 290,
      explanation: 'Export demand surge from Khammam & Warangal terminals. Extended hold to 14 days offers favorable net premium.',
    },
    {
      commodity: 'Maize',
      yard: selectedYard,
      currentPrice: 2420,
      recommendation: 'Sell Now' as const,
      confidenceLevel: 'High' as const,
      expectedGainPct: 0.8,
      netGainAmount: 0,
      storageCost: 17,
      riskDiscount: 49,
      explanation: 'Current mandi price ₹2,420/q is above MSP (₹2,225/q). Fresh rabi arrivals are peaking; holding beyond 3 days risks net margin compression.',
    },
    {
      commodity: 'Paddy',
      yard: selectedYard,
      currentPrice: 2380,
      recommendation: 'Sell Now' as const,
      confidenceLevel: 'High' as const,
      expectedGainPct: 0.5,
      netGainAmount: 0,
      storageCost: 16,
      riskDiscount: 48,
      explanation: 'Stable procurement at state centers. Sell now to minimize holding losses.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Dataset Records</p>
            <p className="text-lg font-bold text-slate-900">76,710</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Market Yards</p>
            <p className="text-lg font-bold text-slate-900">6 Key Terminals</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Top ML Model</p>
            <p className="text-lg font-bold text-slate-900">Random Forest (1.6% MAPE)</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Historical Coverage</p>
            <p className="text-lg font-bold text-slate-900">2020 – 2026</p>
          </div>
        </div>
      </div>

      {/* Geospatial Map Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Telangana Market Yards & Distance Network
            </h2>
            <p className="text-xs text-slate-500">
              Select any reference mandi to measure haul distances and identify regional price spreads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedYard}
              onChange={(e) => setSelectedYard(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              {defaultMarketYards.map((y) => (
                <option key={y.name} value={y.name}>
                  {y.name} ({y.district})
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowDistances(!showDistances)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                showDistances
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              {showDistances ? 'Hide Distance Lines' : 'Show Distance Lines'}
            </button>
          </div>
        </div>

        {/* Map Canvas */}
        <TelanganaMap
          selectedYard={selectedYard}
          showDistances={showDistances}
          onSelectYard={(yard) => setSelectedYard(yard)}
        />
      </section>

      {/* Sell Advisory Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Smart Sell-Time Recommendations for {selectedYard}
            </h2>
            <p className="text-xs text-slate-500">
              Net gain estimates after deducting storage costs (0.1%/day) and market volatility discount (2%).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sampleRecommendations.map((rec) => (
            <RecommendationCard key={rec.commodity} {...rec} />
          ))}
        </div>
      </section>

      {/* Arbitrage & Yard Distance Table */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Regional Price & Haul Comparison from {selectedYard}
            </h3>
            <p className="text-xs text-slate-500">
              Compare local benchmark price against neighboring mandis to identify arbitrage opportunities.
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full">
            Base: ₹{currentYardObj.currentPrice.toLocaleString()}/q
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Market Yard</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Benchmark Price</th>
                <th className="py-3 px-4">Price Difference</th>
                <th className="py-3 px-4">Distance from {currentYardObj.district}</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {defaultMarketYards.map((y) => {
                const dist = haversineDistance(
                  currentYardObj.position[0],
                  currentYardObj.position[1],
                  y.position[0],
                  y.position[1]
                );
                const diff = y.currentPrice - currentYardObj.currentPrice;

                return (
                  <tr
                    key={y.name}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      y.name === selectedYard ? 'bg-emerald-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {y.name}
                      {y.name === selectedYard && (
                        <span className="ml-2 text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{y.district}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          y.type === 'Primary'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {y.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">₹{y.currentPrice.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      {diff === 0 ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <span className={diff > 0 ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                          {diff > 0 ? `+₹${diff.toLocaleString()}` : `-₹${Math.abs(diff).toLocaleString()}`}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {y.name === selectedYard ? (
                        <span className="text-slate-400 font-normal">0 km (Origin)</span>
                      ) : (
                        <span className="font-semibold text-slate-700">{dist} km</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {y.name !== selectedYard && (
                        <button
                          onClick={() => setSelectedYard(y.name)}
                          className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline"
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
