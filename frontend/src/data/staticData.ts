// Static data & generator functions matching Streamlit App (Phase 9)
export const COMMODITIES = ['Cotton', 'Chilli', 'Maize', 'Paddy', 'Turmeric'];

export const YARDS = [
  'Hyderabad RCI Market',
  'Warangal Gurramguda',
  'Karimnagar BCCL Market',
  'Nizamabad',
  'Khammam',
  'Adilabad'
];

export const BASE_PRICES: Record<string, number> = {
  Cotton: 8420,
  Chilli: 13500,
  Maize: 2350,
  Paddy: 2280,
  Turmeric: 10500
};

export const YARD_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const MODEL_PERFORMANCE = [
  { model: 'Random Forest', mae: 155.71, rmse: 194.95, mape: 1.66, mase: 0.632, da: 74.75 },
  { model: 'XGBoost', mae: 179.63, rmse: 222.57, mape: 1.93, mase: 0.729, da: 62.63 },
  { model: 'Moving Average', mae: 189.05, rmse: 237.29, mape: 2.03, mase: 0.767, da: 77.78 },
  { model: 'ARIMA', mae: 196.42, rmse: 248.58, mape: 2.10, mase: 0.797, da: 77.78 },
  { model: 'Naive', mae: 216.84, rmse: 272.87, mape: 2.32, mase: 0.880, da: 76.77 }
];

export function getBasePrice(commodity: string): number {
  return BASE_PRICES[commodity] || 8000;
}

export function generatePriceHistory(commodity: string, yard: string, days = 60) {
  const base = getBasePrice(commodity);
  const yardOffset = YARDS.indexOf(yard) * 45;
  const data = [];
  const now = new Date(2026, 11, 31);

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const wave = Math.sin(i / 6.0) * (base * 0.035) + Math.cos(i / 14.0) * (base * 0.02);
    const modal = Math.round(base + yardOffset + wave);
    data.push({
      date: dateStr,
      modalPrice: modal,
      minPrice: Math.round(modal * 0.96),
      maxPrice: Math.round(modal * 1.04)
    });
  }
  return data;
}

export function generateForecast(lastPrice: number, horizon = 7, volatility = 0.025) {
  const data = [];
  const now = new Date(2026, 11, 31);
  let current = lastPrice;

  for (let i = 1; i <= horizon; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    current = current * (1 + 0.0035);
    const ci = current * volatility * Math.sqrt(i);
    data.push({
      day: i,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      predictedPrice: Math.round(current),
      lowerBound95: Math.round(current - ci),
      upperBound95: Math.round(current + ci)
    });
  }
  return data;
}

export function getMonthlyPattern(commodity: string) {
  const base = getBasePrice(commodity);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Agricultural peak around Feb-Apr, dip around Aug-Sep
  const weights = [0.98, 1.02, 1.05, 1.03, 0.99, 0.95, 0.91, 0.88, 0.87, 0.89, 0.93, 0.96];

  return months.map((m, idx) => ({
    month: idx + 1,
    monthName: m,
    avgPrice: Math.round(base * weights[idx])
  }));
}

export function getYearlyTrend(commodity: string) {
  const base = getBasePrice(commodity);
  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
  return years.map((y, idx) => ({
    year: y,
    avgPrice: Math.round(base * (0.8 + idx * 0.035))
  }));
}

export function getMarketComparisonData(commodity: string) {
  const base = getBasePrice(commodity);
  const raw = [
    { marketYard: 'Hyderabad RCI Market', priceRatio: 1.045, arrivals: 2587, change7d: -1.1 },
    { marketYard: 'Khammam', priceRatio: 1.015, arrivals: 1052, change7d: 0.2 },
    { marketYard: 'Warangal Gurramguda', priceRatio: 1.005, arrivals: 393, change7d: 0.7 },
    { marketYard: 'Nizamabad', priceRatio: 0.995, arrivals: 3315, change7d: 4.9 },
    { marketYard: 'Karimnagar BCCL Market', priceRatio: 0.985, arrivals: 1254, change7d: 3.1 },
    { marketYard: 'Adilabad', priceRatio: 0.965, arrivals: 4749, change7d: 6.1 }
  ];

  const sorted = raw.map(r => ({
    ...r,
    avgPrice: Math.round(base * r.priceRatio)
  })).sort((a, b) => b.avgPrice - a.avgPrice);

  const minPrice = sorted[sorted.length - 1].avgPrice;

  return sorted.map((item, idx) => {
    const diff = item.avgPrice - minPrice;
    return {
      rank: idx + 1,
      marketYard: item.marketYard,
      avgPrice: item.avgPrice,
      totalArrivals: item.arrivals,
      diffFromMin: diff,
      premiumPct: Number(((diff / minPrice) * 100).toFixed(1)),
      change7d: item.change7d,
      recommendation: item.change7d > 2.0 ? 'Wait' : 'Sell Now'
    };
  });
}
