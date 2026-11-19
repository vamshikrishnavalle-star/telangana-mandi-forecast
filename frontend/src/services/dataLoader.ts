export type Crop = 'Cotton' | 'Chilli' | 'Maize' | 'Paddy' | 'Turmeric';
export type Advice = 'Sell Now' | 'Wait';

export interface PricePoint {
  date: string;
  modal: number;
  min: number;
  max: number;
  arrivals: number;
}

export interface ForecastPoint {
  day: number;
  date: string;
  forecast: number;
  lower: number;
  upper: number;
}

export interface ForecastResult {
  crop: Crop;
  yard: string;
  horizon: 7 | 14;
  asOf: string;
  currentPrice: number;
  forecastPrice: number;
  expectedChangePct: number;
  rangeMin: number;
  rangeMax: number;
  confidence: number;
  model: string;
  points: ForecastPoint[];
}

export interface YardSnapshot {
  yard: string;
  price: number;
  change7d: number;
  arrivals: number;
  advice: Advice;
}

export interface ModelMetrics {
  model: string;
  mae: number;
  rmse: number;
  mape: number;
  mase: number;
  directionalAccuracy: number;
}

export interface SeasonalData {
  crop: Crop;
  monthly: { month: number; monthName: string; avgPrice: number }[];
  kharifAvg: number;
  rabiAvg: number;
  discountPct: number;
  yearly: { year: number; avg: number }[];
}

export interface MetaData {
  product: string;
  asOf: string;
  source: string;
  crops: Crop[];
  yards: string[];
  totalRecords: number;
  period: string;
}

// Data loaders
export async function loadMeta(): Promise<MetaData> {
  const res = await fetch('./data/meta.json');
  return res.json();
}

export async function loadModels(): Promise<ModelMetrics[]> {
  const res = await fetch('./data/models.json');
  return res.json();
}

export async function loadSnapshot(crop: Crop): Promise<YardSnapshot[]> {
  const res = await fetch(`./data/snapshots/${crop.toLowerCase()}.json`);
  return res.json();
}

export async function loadPriceHistory(crop: Crop, yard: string): Promise<PricePoint[]> {
  const slug = yard.toLowerCase().replace(/ /g, '-');
  const res = await fetch(`./data/prices/${crop.toLowerCase()}-${slug}.json`);
  return res.json();
}

export async function loadForecast(crop: Crop, yard: string, horizon: 7 | 14): Promise<ForecastResult> {
  const slug = yard.toLowerCase().replace(/ /g, '-');
  const res = await fetch(`./data/forecasts/${crop.toLowerCase()}-${slug}-${horizon}.json`);
  return res.json();
}

export async function loadSeasonal(crop: Crop): Promise<SeasonalData> {
  const res = await fetch(`./data/seasonal/${crop.toLowerCase()}.json`);
  return res.json();
}
