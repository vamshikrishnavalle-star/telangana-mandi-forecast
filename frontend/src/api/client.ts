/**
 * Smart Mandi API Client
 * Connects React frontend with the FastAPI backend for real-time prices & ML advisory
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

export type LatestPriceItem = {
  date: string;
  commodity: string;
  market_yard: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  arrivals: number;
};

export type ForecastResponse = {
  commodity: string;
  yard: string;
  current_price: number;
  forecast_horizon_days: number;
  expected_change_pct: number;
  confidence_score: number;
  forecast: Array<{
    day: number;
    date: string;
    predicted_price: number;
    lower_bound_95: number;
    upper_bound_95: number;
  }>;
};

export type RecommendationResponse = {
  commodity: string;
  yard: string;
  current_price: number;
  recommendation: 'Wait 7 Days' | 'Wait 14 Days' | 'Sell Now';
  confidence_level: 'High' | 'Medium' | 'Low';
  best_horizon_days: number | null;
  expected_net_gain_pct: number;
  explanation: string;
  breakdown: {
    '7_days': {
      forecast_price: number;
      gross_gain: number;
      storage_cost: number;
      risk_discount: number;
      net_gain: number;
    };
    '14_days': {
      forecast_price: number;
      gross_gain: number;
      storage_cost: number;
      risk_discount: number;
      net_gain: number;
    };
  };
};

export type ArbitrageResponse = {
  commodity: string;
  origin_yard: string;
  base_price: number;
  yards: Array<{
    market_yard: string;
    district: string;
    modal_price: number;
    distance_km: number;
    transport_cost: number;
    net_price_after_haul: number;
    net_profit_over_origin: number;
    is_profitable_arbitrage: boolean;
  }>;
};

// Generic fetch with timeout
async function fetchWithFallback<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[SmartMandiAPI] Endpoint ${endpoint} unreachable. Using local engine fallback.`, err);
    return null;
  }
}

export const api = {
  async getLatestPrices(commodity?: string): Promise<LatestPriceItem[] | null> {
    const query = commodity ? `?commodity=${encodeURIComponent(commodity)}` : '';
    const res = await fetchWithFallback<{ prices: LatestPriceItem[] }>(`/mandi/latest${query}`);
    return res ? res.prices : null;
  },

  async getForecast(commodity: string, yard: string, horizon = 7): Promise<ForecastResponse | null> {
    return fetchWithFallback<ForecastResponse>(
      `/forecast?commodity=${encodeURIComponent(commodity)}&yard=${encodeURIComponent(yard)}&horizon=${horizon}`
    );
  },

  async getRecommendation(
    commodity: string,
    yard: string,
    currentPrice: number
  ): Promise<RecommendationResponse | null> {
    return fetchWithFallback<RecommendationResponse>('/recommendation', {
      method: 'POST',
      body: JSON.stringify({
        commodity,
        yard,
        current_price: currentPrice,
      }),
    });
  },

  async getArbitrage(commodity: string, originYard: string): Promise<ArbitrageResponse | null> {
    return fetchWithFallback<ArbitrageResponse>(
      `/mandi/arbitrage?commodity=${encodeURIComponent(commodity)}&origin_yard=${encodeURIComponent(originYard)}`
    );
  },

  async getLiveWeather(yard: string) {
    return fetchWithFallback<any>(`/weather?yard=${encodeURIComponent(yard)}`);
  },
};
