# Smart Mandi Advisory: Website Design Document

## Scope
The build is a six-page, decision-first web app that tells a Telangana farmer whether to sell today or wait, for five crops across the state's market yards (mandis).
- **Product name:** Smart Mandi Advisory | Telangana
- **Functionality:** From Streamlit screenshots (forecast, market comparison, model performance, seasonal patterns, recommendation).
- **Visual Style:** Light rounded AgFarm visual style (light sage canvas, mint surface `#EEF3EE`, white rounded cards 20px radius, forest-green `#0A4D2E` pills, large bold headlines, glass cards over photographic hero, soft shadows).
- **Crops:** Cotton, Chilli, Maize, Paddy, Turmeric.
- **Yards (10 in total):** Hyderabad RCI Market, Warangal Gurramguda, Karimnagar BCCL Market, Nizamabad, Khammam, Adilabad, Medak, Suryapet, Mahbubnagar, Nalgonda.
- **Routing:** React Router with HashRouter (`#/`, `#/forecast`, `#/market-comparison`, `#/models`, `#/seasonal`, `#/recommendation`).
- **Data Source:** Precomputed static JSON files in `/public/data/` (no hard-coded numbers).

## Design Tokens
```css
--canvas: #6B8266;       /* Sage outer frame */
--surface: #EEF3EE;      /* Page background */
--card: #FFFFFF;         /* Cards, table wrappers, chart cards */
--brand-900: #0A4D2E;    /* Logo, primary buttons, accents */
--brand-700: #0F6B3F;    /* Button hover, active nav */
--ink-900: #111613;      /* Headings & primary text */
--ink-600: #5B665F;      /* Secondary text */
--ink-400: #8A948D;      /* Muted text / captions */
--sell: #0A7A3B;         /* "Sell Now" badge and bars */
--wait: #F59E0B;         /* "Wait" badge and bars */
--info-bg: #E7F1FB;      /* Info callouts */
--success-bg: #E5F4E4;   /* Success callouts */
--chart-hist: #1D4ED8;   /* History line */
--chart-fcst: #DC2626;   /* Forecast line */
--chart-band: rgba(220, 38, 38, 0.15); /* 95% CI band */
--chart-max: #16A34A;    /* Dashed max price line */
--chart-min: #DC2626;    /* Dashed min price line */
--chart-neutral: #B8C4BA;/* Non-highlighted bars */
```

## Structure & Pages
1. **Home (`#/`):**
   - AgFarm photographic hero with glass badge ("Today's Best Price"), CTA buttons ("View Forecast", "Compare Mandis").
   - Key Features (2 white cards with blue-tinted strips).
   - Quick Market Overview: Crop-selectable grouped bar chart with latest modal prices across mandis.
   - Geospatial Telangana Map & Distance Haul network.
   - Footer with advisory disclaimer and data date.
2. **Price Forecast (`#/forecast`):**
   - Filters: Crop, Yard, Horizon (7 vs 14 days).
   - 180-day history chart (Modal solid, Max dashed, Min dashed).
   - Forecast chart with 95% Confidence Interval band.
   - 5 KPI cards (Current Price, Forecast Price + Delta, Expected Change %, Forecast Range, Confidence Score).
3. **Market Comparison (`#/market-comparison`):**
   - Filter: Crop.
   - Tabs: "Today's Comparison" (bars colored by Sell Now green vs Wait amber) & "Ranking" (ranked table & single-hue bars).
   - Detailed Comparison Table (10 yards, sortable, status badges).
   - Best Price success banner + Price Spread Analysis (Highest, Lowest, Spread).
4. **Model Performance (`#/models`):**
   - Metrics table for 5 models (Random Forest, XGBoost, Moving Average, ARIMA, Naive).
   - Single-hue bar charts (MAE, MAPE, Directional Accuracy with best model highlighted in `--brand-900`).
   - Best model callout.
5. **Seasonal Patterns (`#/seasonal`):**
   - Monthly seasonal price line chart (Jan-Dec).
   - Kharif vs Rabi averages & Kharif discount callout.
   - 7-year multi-year secular trendline (2020-2026).
6. **Recommendation (`#/recommendation`):**
   - Crop & Quantity input (quintals) with dynamic yield calculators.
   - Sell/Wait decision hero banner with confidence & reasoning.
   - Cost-benefit analysis (storage carrying cost vs expected gross gain).
   - Arbitrage opportunity matrix (haul distance vs transport cost).
