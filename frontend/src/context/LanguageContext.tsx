import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'te';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, paramsOrFallback?: Record<string, string | number> | string) => string;
  cropName: (crop: string) => string;
  yardName: (yard: string) => string;
  adviceName: (advice: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Nav
    'brand.title': 'Smart Mandi',
    'brand.subtitle': 'Telangana Advisory',
    'nav.home': 'Home',
    'nav.forecast': 'Price Forecast',
    'nav.market_comparison': 'Market Comparison',
    'nav.model_performance': 'Model Performance',
    'nav.seasonal': 'Seasonal Patterns',
    'nav.recommendation': 'Recommendation',
    'nav.get_advice': 'Get Advice',
    'nav.get_advice_full': 'Get Sell/Wait Advice',

    // Hero
    'hero.badge': 'AI-POWERED AGRICULTURE',
    'hero.title_pre': 'Driving the Future of Agriculture',
    'hero.title_highlight': 'Smart Innovation',
    'hero.desc': 'Data-backed 7-day and 14-day crop price forecasting and intelligent Sell/Wait decision support for Telangana farmers across 10 state market yards.',
    'hero.btn_forecast': 'View Forecast',
    'hero.btn_compare': 'Compare Mandis',
    'hero.best_benchmark': "Today's Best Benchmark",
    'hero.cotton_rate': 'Cotton modal rate',
    'hero.updated': 'Updated',

    // Key Features
    'feat.forecasting_title': 'Price Forecasting',
    'feat.forecasting_b1': '7-day and 14-day price forecasts computed with historical arrival patterns',
    'feat.forecasting_b2': 'Multiple ML models: ARIMA, Random Forest, XGBoost, and Moving Average',
    'feat.forecasting_b3': '95% Confidence Intervals derived directly from validated test error bounds',
    'feat.forecasting_b4': 'Real-time market data integration with Telangana AMC daily reports',
    'feat.rec_title': 'Smart Recommendations',
    'feat.rec_b1': 'Sell/Wait decision support with high/medium confidence indicators',
    'feat.rec_b2': 'Cost-benefit analysis: 0.1%/day warehouse storage and 2% risk discount',
    'feat.rec_b3': 'Arbitrage detection: identifies price premiums in neighboring mandis',
    'feat.rec_b4': 'Net realization calculation factoring inter-district road transport costs',

    // Overview & Map
    'overview.title_pre': 'Quick Market Overview — Latest Prices with',
    'overview.title_highlight': 'Live Telemetry',
    'overview.desc': 'Comparative modal price (₹/quintal) across 10 Telangana market yards',
    'map.title_pre': 'Telangana Market Yards &',
    'map.title_highlight': 'Geospatial Haul',
    'map.desc': 'Locate primary terminal yards and evaluate haul distances to calculate net arbitrage returns',
    'map.show_lines': 'Show Distance Lines',
    'map.hide_lines': 'Hide Distance Lines',
    'map.toolbar_title': 'Telangana Mandi Geospatial Map',
    'map.toolbar_desc': 'Interactive yard locations, live prices & distance lines',
    'map.primary': 'Primary',
    'map.secondary': 'Secondary',
    'map.selected': 'Selected',
    'map.distances_from': 'Distances from',
    'map.yards_count': 'Yards',
    'map.click_hint': 'Click any yard to view distance & price difference',
    'map.set_origin': 'Set as Origin Mandi',
    'map.selected_yard': '✓ Selected Yard',
    'map.district': 'District:',
    'map.crops': 'Crops:',
    'map.benchmark': 'Benchmark:',

    // Forecast Page
    'fc.badge': 'Time-Series Engine',
    'fc.title_pre': 'Price Forecast &',
    'fc.title_highlight': 'Predictive Intelligence',
    'fc.desc': '180-day modal price history combined with model-derived 95% Confidence Interval band',
    'fc.filters': 'Filters:',
    'fc.crop': 'Crop:',
    'fc.yard': 'Market Yard:',
    'fc.days_7': '7 Days',
    'fc.days_14': '14 Days',
    'fc.history_title': 'Price History: {crop} at {yard} (Recent 180 Days)',
    'fc.history_desc': 'Modal price (solid blue) with daily Min and Max trade bands (dashed)',
    'fc.forecast_title': '{horizon}-Day Price Forecast with 95% Confidence Interval Band',
    'fc.forecast_desc': 'Model: {model} • Validated test error interval',
    'fc.as_of': 'As of {date}',
    'fc.curr_price': 'Current Price',
    'fc.fc_price': '{horizon}d Forecast Price',
    'fc.expected_change': 'Expected {horizon}d Change',
    'fc.range': 'Forecast Range',
    'fc.confidence': 'Confidence Score',
    'fc.sub_observed': 'Observed modal rate',
    'fc.sub_pred': 'Model prediction',
    'fc.sub_trend': 'Net trend drift',
    'fc.sub_range': '95% CI bound spread',
    'fc.sub_conf': 'Model validation score',
    'fc.modal_price': 'Modal Price',
    'fc.max_price': 'Max Price',
    'fc.min_price': 'Min Price',
    'fc.upper_bound': 'Upper 95% Bound',
    'fc.lower_bound': 'Lower 95% Bound',

    // Market Comparison
    'mc.badge': 'Statewide Terminal Network',
    'mc.title_pre': 'Market Yard Comparison &',
    'mc.title_highlight': 'Arbitrage Spreads',
    'mc.desc': 'Real-time price spread across 10 Telangana mandis with actionable Sell/Wait guidance',
    'mc.tab_today': "Today's Comparison",
    'mc.tab_ranking': 'Ranking View',
    'mc.best_price_title': 'Best Price: {yard} at ₹{price}/quintal ({advice})',
    'mc.best_price_desc': 'Offers ₹{spread} premium (+{pct}%) over lowest reporting terminal ({lowest}).',
    'mc.chart_title': '{crop} Prices Across Market Yards',
    'mc.chart_desc': 'Green = Sell Now, Amber = Wait (sorted descending)',
    'mc.table_title': 'Detailed Comparison Table',
    'mc.th_yard': 'Market Yard',
    'mc.th_price': 'Current Price (₹/q)',
    'mc.th_change': '7d Change (%)',
    'mc.th_arrivals': 'Arrivals (q)',
    'mc.th_rec': 'Recommendation',
    'mc.ranking_title': 'Price Comparison & Premium Ranking',
    'mc.th_rank': 'Rank',
    'mc.th_avg_price': 'Average Price (₹)',
    'mc.th_diff_min': 'Difference from Min (₹)',
    'mc.th_premium': 'Premium (%)',
    'mc.spread_analysis': 'Price Spread Analysis',
    'mc.highest_price': 'Highest Price',
    'mc.lowest_price': 'Lowest Price',
    'mc.price_spread': 'Price Spread',

    // Model Performance
    'mp.badge': 'Evaluation Benchmark',
    'mp.title_pre': 'Model Performance &',
    'mp.title_highlight': 'Validation Benchmark',
    'mp.desc': 'Rigorous out-of-sample backtesting against 7 years of Telangana daily mandi arrivals (2020–2026)',
    'mp.best_callout_title': 'Best Performing Model: {model} with MAE of ₹{mae} and MAPE of {mape}%',
    'mp.best_callout_desc': 'Criterion: lowest Mean Absolute Error across test folds. Minimizes rupee-per-quintal prediction deviation.',
    'mp.table_title': 'Model Performance Metrics (Validated 2020–2026)',
    'mp.th_model': 'Model',
    'mp.th_mae': 'MAE (₹/q)',
    'mp.th_rmse': 'RMSE (₹/q)',
    'mp.th_mape': 'MAPE (%)',
    'mp.th_mase': 'MASE',
    'mp.th_da': 'Directional Accuracy (%)',
    'mp.best_performer': 'Best Performer',
    'mp.mae_chart_title': 'Mean Absolute Error (₹/quintal)',
    'mp.mae_chart_desc': 'Lower is better • Sorted ascending by prediction error',
    'mp.mape_chart_title': 'Mean Absolute Percentage Error (%)',
    'mp.mape_chart_desc': 'Lower is better • Measures relative percentage deviation',
    'mp.da_chart_title': 'Directional Accuracy by Model (%)',
    'mp.da_chart_desc': 'Higher is better • Evaluates correctness of price direction sign',

    // Seasonal Patterns
    'sp.badge': 'Agronomic Seasonality',
    'sp.title_pre': 'Seasonal Patterns &',
    'sp.title_highlight': 'Multi-Year Cycles',
    'sp.desc': 'Intra-annual seasonal cycles, Kharif vs. Rabi price comparisons, and 7-year multi-year inflation trend',
    'sp.monthly_title': 'Seasonal Monthly Price Patterns — {crop}',
    'sp.monthly_desc': 'Average historical realization across all 12 calendar months (₹/quintal)',
    'sp.kr_title': 'Kharif vs Rabi Season Comparison',
    'sp.kharif_label': 'Kharif Season Avg (Monsoon)',
    'sp.kharif_desc': 'June to November peak arrivals',
    'sp.rabi_label': 'Rabi Season Avg (Winter / Summer)',
    'sp.rabi_desc': 'December to May harvest market',
    'sp.dynamic_title': 'Seasonal Price Dynamic',
    'sp.dynamic_discount': 'Kharif discount: {pct}% below Rabi season due to concentrated monsoon arrivals entering state market yards simultaneously.',
    'sp.dynamic_premium': 'Kharif premium: +{pct}% compared to Rabi season for {crop}.',
    'sp.yearly_title': 'Multi-Year Price Trend (2020–2026) — {crop}',
    'sp.yearly_desc': '7-year annual modal realization across all Telangana yards (₹/quintal)',
    'sp.avg_price': 'Average Price (₹)',
    'sp.annual_avg': 'Annual Average (₹)',

    // Recommendation
    'rec.badge': 'Decision Support Engine',
    'rec.title_pre': 'Sell or Wait Advisory with',
    'rec.title_highlight': 'Intelligent Scoring',
    'rec.desc': 'Algorithmic recommendation balancing projected gains, godown storage, and haulage costs',
    'rec.crop': 'Crop:',
    'rec.quantity': 'Quantity:',
    'rec.quintals': 'quintals',
    'rec.target_mandi': 'Target Mandi:',
    'rec.wait_headline_pre': 'Wait 7 to 14 Days',
    'rec.wait_headline_post': 'Before Selling',
    'rec.sell_headline_pre': 'Sell Today at',
    'rec.sell_headline_post': 'Local Mandi',
    'rec.confidence_label': 'Decision Confidence',
    'rec.confidence_val': 'High (95% interval)',
    'rec.today_rev': "Today's Realization ({qty} q)",
    'rec.spot_rate': '₹{price}/q spot rate',
    'rec.net_gain': 'Expected 7d Net Gain (Total)',
    'rec.net_gain_wait': '+₹{val}/q net risk buffer',
    'rec.net_gain_sell': 'Hold carries negative margin',
    'rec.proj_price': 'Projected 7d Price',
    'rec.proj_traj': '+{pct}% model trajectory',
    'rec.rationale_label': 'Decision Rationale:',
    'rec.rationale_wait': 'Arrivals at {yard} are running below seasonal baseline, creating upward pressure (+{pct}% in 7 days). Gross gains (₹{gain}/q) comfortably exceed warehouse carrying costs (₹{storage}/q) and 2% volatility buffer (₹{risk}/q).',
    'rec.rationale_sell': 'Spot price at {yard} (₹{price}/q) is currently peaked near local resistance. Holding for 7 days incurs ₹{storage}/q in storage without sufficient upside probability.',
    'rec.cost_benefit_title': '7-Day Cost-Benefit Breakdown (Per Quintal)',
    'rec.cb_gross': 'Projected Gross Price Gain',
    'rec.cb_storage': 'Warehouse Storage Cost (0.1%/day × 7d)',
    'rec.cb_risk': 'Market Volatility Buffer (2.0% Risk Discount)',
    'rec.cb_net': 'Net Risk-Adjusted Gain / Loss',
    'rec.arb_title': 'Regional Inter-Mandi Arbitrage',
    'rec.arb_opp_title': 'Arbitrage Opportunity: Transport to {yard}',
    'rec.arb_opp_desc': 'Price difference is ₹{diff}/q. After deducting estimated haul transport (₹50/q), net extra profit is ₹{net}/quintal (₹{total} for {qty}q).',
    'rec.arb_local_price': 'Local Price ({yard})',
    'rec.arb_high_price': 'Highest Terminal Price ({yard})',
    'rec.arb_transport': 'Estimated Road Transport Cost',
    'rec.arb_best_already': 'Selected Mandi Already Offers Statewide Best Price',
    'rec.arb_best_already_desc': 'No road haul arbitrage needed. Local sale yields peak Telangana price realization.',
    'rec.matrix_title': 'All Mandis Advisory Matrix — {crop}',
    'rec.th_yard': 'Market Yard',
    'rec.th_today': "Today's Price",
    'rec.th_trend': '7d Trend',
    'rec.th_advice': 'Advice',
    'rec.th_action': 'Action',
    'rec.btn_calc': 'Calculate',

    // Footer
    'footer.dept': 'Telangana State Agricultural Marketing Department',
    'footer.disclaimer': 'Prices and forecasts are algorithmic estimates based on historical mandi arrivals, minimum support prices (MSP), and machine learning time-series models. Market conditions may change rapidly due to weather and regional arrivals.',
    'footer.validation': 'Validated against 76,710 records across Telangana market yards (2020–2026). Data updated as of November 19, 2026.',
  },
  te: {
    // Brand & Nav
    'brand.title': 'స్మార్ట్ మండి',
    'brand.subtitle': 'తెలంగాణ రైతు సలహా వేదిక',
    'nav.home': 'హోమ్',
    'nav.forecast': 'ధరల అంచనా',
    'nav.market_comparison': 'మార్కెట్ పోలిక',
    'nav.model_performance': 'మోడల్ పనితీరు',
    'nav.seasonal': 'సీజనల్ సరళి',
    'nav.recommendation': 'అమ్మకపు సలహా',
    'nav.get_advice': 'సలహా పొందండి',
    'nav.get_advice_full': 'అమ్మాలా? వేచి ఉండాలా? సలహా పొందండి',

    // Hero
    'hero.badge': 'ఏఐ ఆధారిత వ్యవసాయ వేదిక',
    'hero.title_pre': 'ఆధునిక సాంకేతికతతో వ్యవసాయ రంగంలో',
    'hero.title_highlight': 'నవ శకం',
    'hero.desc': 'తెలంగాణలోని 10 ప్రధాన మార్కెట్ యార్డులలో 7 మరియు 14 రోజుల పంట ధరల ముందస్తు అంచనాలు, విక్రయ సలహాలు.',
    'hero.btn_forecast': 'ధరల అంచనా చూడండి',
    'hero.btn_compare': 'మార్కెట్లను పోల్చండి',
    'hero.best_benchmark': 'నేటి ఉత్తమ మార్కెట్ ధర',
    'hero.cotton_rate': 'పత్తి మోడల్ ధర',
    'hero.updated': 'తాజా సమాచారం',

    // Key Features
    'feat.forecasting_title': 'ధరల ముందస్తు అంచనాలు',
    'feat.forecasting_b1': 'చారిత్రక మార్కెట్ రాకల ఆధారంగా 7 మరియు 14 రోజుల ధరల ముందస్తు అంచనాలు',
    'feat.forecasting_b2': 'అధునాతన మెషిన్ లెర్నింగ్ మోడల్స్: ARIMA, Random Forest, XGBoost, Moving Average',
    'feat.forecasting_b3': 'పరీక్షించిన ఎర్రర్ బౌండ్స్ నుండి పొందిన 95% విశ్వసనీయతా పరిధి (Confidence Interval)',
    'feat.forecasting_b4': 'తెలంగాణ అగ్రికల్చరల్ మార్కెట్ కమిటీల రోజువారీ డేటాతో అనుసంధానం',
    'feat.rec_title': 'స్మార్ట్ విక్రయ సిఫార్సులు',
    'feat.rec_b1': 'అధిక/మధ్యమ విశ్వసనీయతతో కూడిన "ఇప్పుడే అమ్మాలా? వేచి ఉండాలా?" సలహా',
    'feat.rec_b2': 'గిడ్డంగి నిల్వ ఖర్చులు (0.1%/రోజు) మరియు 2% రిస్క్ తగ్గింపుతో లాభ-నష్టాల విశ్లేషణ',
    'feat.rec_b3': 'సమీప మార్కెట్లలో అధిక ధరల అవకాశాలను (ఆర్బిట్రేజ్) గుర్తించే సదుపాయం',
    'feat.rec_b4': 'జిల్లా స్థాయి రోడ్డు రవాణా ఖర్చులను మినహాయించి నికర లాభం లెక్కింపు',

    // Overview & Map
    'overview.title_pre': 'సత్వర మార్కెట్ పరిశీలన — తాజా ధరలు',
    'overview.title_highlight': 'లైవ్ డేటా',
    'overview.desc': '10 తెలంగాణ మార్కెట్ యార్డులలో క్వింటాలుకు మోడల్ ధరల పోలిక (₹/క్వింటాలు)',
    'map.title_pre': 'తెలంగాణ మార్కెట్ యార్డులు &',
    'map.title_highlight': 'రవాణా దూరాలు',
    'map.desc': 'మార్కెట్ యార్డుల దూరం, రవాణా ఖర్చులను లెక్కించి ఇతర మార్కెట్లలో అధిక లాభాన్ని పొందండి',
    'map.show_lines': 'దూరాల లైన్లు చూపించు',
    'map.hide_lines': 'దూరాల లైన్లు దాచు',
    'map.toolbar_title': 'తెలంగాణ మండి మ్యాప్ & దూరాల నెట్‌వర్క్',
    'map.toolbar_desc': 'మార్కెట్ లొకేషన్లు, తాజా ధరలు మరియు రవాణా దూరాలు',
    'map.primary': 'ప్రధాన మార్కెట్',
    'map.secondary': 'ఉప మార్కెట్',
    'map.selected': 'ఎంచుకున్నది',
    'map.distances_from': 'దూరం లెక్కించిన కేంద్రం:',
    'map.yards_count': 'మార్కెట్లు',
    'map.click_hint': 'దూరం మరియు ధర వ్యత్యాసం చూడటానికి ఏదైనా మార్కెట్‌పై క్లిక్ చేయండి',
    'map.set_origin': 'ప్రారంభ మార్కెట్‌గా ఎంచుకోండి',
    'map.selected_yard': '✓ ఎంచుకున్న మార్కెట్',
    'map.district': 'జిల్లా:',
    'map.crops': 'పంటలు:',
    'map.benchmark': 'మార్కెట్ ధర:',

    // Forecast Page
    'fc.badge': 'టైమ్-సిరీస్ ఏఐ ఇంజిన్',
    'fc.title_pre': 'ధరల ముందస్తు అంచనా &',
    'fc.title_highlight': 'విశ్లేషణ',
    'fc.desc': '180 రోజుల ధరల చరిత్ర మరియు 95% విశ్వసనీయతతో భవిష్యత్ అంచనాలు',
    'fc.filters': 'ఫిల్టర్లు:',
    'fc.crop': 'పంట:',
    'fc.yard': 'మార్కెట్ యార్డ్:',
    'fc.days_7': '7 రోజులు',
    'fc.days_14': '14 రోజులు',
    'fc.history_title': 'ధరల చరిత్ర: {yard} వద్ద {crop} (గత 180 రోజులు)',
    'fc.history_desc': 'మోడల్ ధర (నీలి లైన్), రోజువారీ కనిష్ట మరియు గరిష్ట ధరల పరిధులు (చుక్కల లైన్లు)',
    'fc.forecast_title': '{horizon} రోజుల ధరల అంచనా (95% విశ్వసనీయతా పరిధి)',
    'fc.forecast_desc': 'మోడల్: {model} • ప్రామాణీకరించబడిన టెస్ట్ ఎర్రర్ ఇంటర్వల్',
    'fc.as_of': '{date} నాటికి',
    'fc.curr_price': 'ప్రస్తుత ధర',
    'fc.fc_price': '{horizon} రోజుల అంచనా ధర',
    'fc.expected_change': '{horizon} రోజుల్లో ఆశించే మార్పు',
    'fc.range': 'అంచనా ధరల పరిధి',
    'fc.confidence': 'విశ్వసనీయత స్కోరు',
    'fc.sub_observed': 'నమోదైన మోడల్ ధర',
    'fc.sub_pred': 'ఏఐ మోడల్ అంచనా',
    'fc.sub_trend': 'ధరల సరళి మార్పు',
    'fc.sub_range': '95% విశ్వసనీయ పరిధి',
    'fc.sub_conf': 'మోడల్ ఖచ్చితత్వ స్కోరు',
    'fc.modal_price': 'మోడల్ ధర',
    'fc.max_price': 'గరిష్ట ధర',
    'fc.min_price': 'కనిష్ట ధర',
    'fc.upper_bound': 'గరిష్ట పరిధి (95%)',
    'fc.lower_bound': 'కనిష్ట పరిధి (95%)',

    // Market Comparison
    'mc.badge': 'రాష్ట్రవ్యాప్త మార్కెట్ నెట్‌వర్క్',
    'mc.title_pre': 'మార్కెట్ యార్డుల పోలిక &',
    'mc.title_highlight': 'అధిక ధరల అవకాశాలు',
    'mc.desc': '10 తెలంగాణ మార్కెట్లలో తాజా ధరల వ్యత్యాసాలు మరియు అమ్మకపు మార్గదర్శకాలు',
    'mc.tab_today': 'నేటి మార్కెట్ పోలిక',
    'mc.tab_ranking': 'ర్యాంకింగ్ జాబితా',
    'mc.best_price_title': 'ఉత్తమ ధర: {yard} వద్ద ₹{price}/క్వింటాలు ({advice})',
    'mc.best_price_desc': 'అత్యల్ప ధర ఉన్న మార్కెట్ ({lowest}) కంటే ₹{spread} (+{pct}%) అదనపు ధర లభిస్తోంది.',
    'mc.chart_title': 'వివిధ మార్కెట్లలో {crop} ధరలు',
    'mc.chart_desc': 'ఆకుపచ్చ = ఇప్పుడే అమ్మండి, పసుపు = వేచి ఉండండి (అధిక ధర నుండి క్రమబద్ధం)',
    'mc.table_title': 'సమగ్ర మార్కెట్ పోలిక పట్టిక',
    'mc.th_yard': 'మార్కెట్ యార్డ్',
    'mc.th_price': 'ప్రస్తుత ధర (₹/క్విం)',
    'mc.th_change': '7 రోజుల మార్పు (%)',
    'mc.th_arrivals': 'రాకలు (క్విం)',
    'mc.th_rec': 'సిఫార్సు',
    'mc.ranking_title': 'ధరల పోలిక & ప్రీమియం ర్యాంకింగ్',
    'mc.th_rank': 'ర్యాంక్',
    'mc.th_avg_price': 'సగటు ధర (₹)',
    'mc.th_diff_min': 'కనిష్ట ధరతో తేడా (₹)',
    'mc.th_premium': 'ప్రీమియం (%)',
    'mc.spread_analysis': 'ధర వ్యత్యాస విశ్లేషణ',
    'mc.highest_price': 'అత్యధిక ధర',
    'mc.lowest_price': 'అత్యల్ప ధర',
    'mc.price_spread': 'ధరల వ్యత్యాసం',

    // Model Performance
    'mp.badge': 'పనితీరు మూల్యాంకనం',
    'mp.title_pre': 'మోడల్ పనితీరు &',
    'mp.title_highlight': 'నిర్ధారణ ఫలితాలు',
    'mp.desc': 'గత 7 సంవత్సరాల తెలంగాణ మార్కెట్ డేటా (2020–2026) ఆధారంగా కఠినమైన పరీక్షల ఫలితాలు',
    'mp.best_callout_title': 'అత్యుత్తమ పనితీరు గల మోడల్: {model} (MAE: ₹{mae}, MAPE: {mape}%)',
    'mp.best_callout_desc': 'ప్రామాణికం: అతి తక్కువ సగటు లోపం (MAE). క్వింటాలుకు రూపాయి వ్యత్యాసాన్ని కనిష్టం చేస్తుంది.',
    'mp.table_title': 'మోడల్ పనితీరు గణాంకాలు (2020–2026)',
    'mp.th_model': 'మోడల్ పేరు',
    'mp.th_mae': 'MAE (₹/క్విం)',
    'mp.th_rmse': 'RMSE (₹/క్విం)',
    'mp.th_mape': 'MAPE (%)',
    'mp.th_mase': 'MASE',
    'mp.th_da': 'దిశాత్మక ఖచ్చితత్వం (%)',
    'mp.best_performer': 'నంబర్ 1 మోడల్',
    'mp.mae_chart_title': 'సగటు సంపూర్ణ లోపం - MAE (₹/క్వింటాలు)',
    'mp.mae_chart_desc': 'తక్కువగా ఉంటే మంచిది • లోపం తక్కువగా ఉన్న క్రమంలో',
    'mp.mape_chart_title': 'శాతంలో సగటు లోపం - MAPE (%)',
    'mp.mape_chart_desc': 'తక్కువగా ఉంటే మంచిది • శాతం వ్యత్యాసాన్ని కొలుస్తుంది',
    'mp.da_chart_title': 'ధర దిశ ఖచ్చితత్వం - Directional Accuracy (%)',
    'mp.da_chart_desc': 'ఎక్కువగా ఉంటే మంచిది • ధరల పెరుగుదల/తగ్గుదల దిశ సరైనదా కాదా అనేది చూపిస్తుంది',

    // Seasonal Patterns
    'sp.badge': 'వ్యవసాయ కాలానుగుణ పోకడలు',
    'sp.title_pre': 'పంటల సీజనల్ పోకడలు &',
    'sp.title_highlight': 'బహుళ సంవత్సరాల సరళి',
    'sp.desc': 'వార్షిక సీజనల్ ధరల చక్రాలు, ఖరీఫ్ వర్సెస్ రబీ పోలికలు, మరియు 7 సంవత్సరాల ధోరణి',
    'sp.monthly_title': 'నెలవారీ సగటు ధరల సరళి — {crop}',
    'sp.monthly_desc': 'ఏడాదిలోని 12 నెలల్లో చారిత్రక సగటు ధరలు (₹/క్వింటాలు)',
    'sp.kr_title': 'ఖరీఫ్ వర్సెస్ రబీ సీజన్ పోలిక',
    'sp.kharif_label': 'ఖరీఫ్ సీజన్ సగటు (వర్షాకాలం)',
    'sp.kharif_desc': 'జూన్ నుండి నవంబర్ వరకు మార్కెట్ రాకలు',
    'sp.rabi_label': 'రబీ సీజన్ సగటు (శీతాకాలం / వేసవి)',
    'sp.rabi_desc': 'డిసెంబర్ నుండి మే వరకు పంట మార్కెట్',
    'sp.dynamic_title': 'సీజనల్ ధరల విశ్లేషణ',
    'sp.dynamic_discount': 'ఖరీఫ్ ధరలు: రబీ సీజన్ కంటే {pct}% తక్కువగా ఉంటాయి. వర్షాకాల పంటల రాక ఒకేసారి మార్కెట్లకు చేరడమే ఇందుకు కారణం.',
    'sp.dynamic_premium': 'ఖరీఫ్ ప్రీమియం: {crop} పంటకు రబీ కంటే +{pct}% అధిక ధర నమోదైంది.',
    'sp.yearly_title': 'బహుళ సంవత్సరాల ధరల ధోరణి (2020–2026) — {crop}',
    'sp.yearly_desc': 'గత 7 సంవత్సరాలలో తెలంగాణ మార్కెట్ల సగటు ధరలు (₹/క్వింటాలు)',
    'sp.avg_price': 'సగటు ధర (₹)',
    'sp.annual_avg': 'వార్షిక సగటు (₹)',

    // Recommendation
    'rec.badge': 'నిర్ణయ మద్దతు వ్యవస్థ',
    'rec.title_pre': 'అమ్మాలా? వేచి ఉండాలా?',
    'rec.title_highlight': 'తెలివైన విక్రయ సలహా',
    'rec.desc': 'భవిష్యత్ ధరల లాభం, గిడ్డంగి నిల్వ ఖర్చులు, రవాణా చార్జీలను బేరీజు వేసి అందించే సలహా',
    'rec.crop': 'పంట:',
    'rec.quantity': 'పంట పరిమాణం:',
    'rec.quintals': 'క్వింటాళ్ళు',
    'rec.target_mandi': 'లక్ష్య మార్కెట్:',
    'rec.wait_headline_pre': 'విక్రయించడానికి 7 నుండి 14 రోజులు',
    'rec.wait_headline_post': 'వేచి ఉండండి',
    'rec.sell_headline_pre': 'స్థానిక మార్కెట్‌లో',
    'rec.sell_headline_post': 'ఇప్పుడే అమ్మండి',
    'rec.confidence_label': 'నిర్ణయ విశ్వసనీయత',
    'rec.confidence_val': 'చాలా ఎక్కువ (95% విశ్వసనీయత)',
    'rec.today_rev': 'నేటి మొత్తం రాబడి ({qty} క్విం)',
    'rec.spot_rate': '₹{price}/క్విం స్పాట్ ధర',
    'rec.net_gain': '7 రోజులు ఆగితే ఆశించే నికర లాభం',
    'rec.net_gain_wait': '+₹{val}/క్విం నిల్వ, రిస్క్ మినహాయించిన నికర లాభం',
    'rec.net_gain_sell': 'నిల్వ చేస్తే నష్టపోయే ప్రమాదం ఉంది',
    'rec.proj_price': '7 రోజుల తర్వాత అంచనా ధర',
    'rec.proj_traj': '+{pct}% మోడల్ అంచనా ప్రకారం',
    'rec.rationale_label': 'నిర్ణయ విశ్లేషణ:',
    'rec.rationale_wait': '{yard} మార్కెట్‌కు సాధారణం కంటే తక్కువ పంట వస్తోంది, దీనివల్ల 7 రోజుల్లో ధరలు పెరిగే అవకాశం (+{pct}%) ఉంది. ఆశించే స్థూల లాభం (₹{gain}/క్విం) గిడ్డంగి నిల్వ ఖర్చులు (₹{storage}/క్విం) మరియు రిస్క్ తగ్గింపు (₹{risk}/క్విం) కంటే ఎక్కువగా ఉంది.',
    'rec.rationale_sell': '{yard} వద్ద ప్రస్తుత స్పాట్ ధర (₹{price}/క్విం) ఇప్పటికే గరిష్ట స్థాయి వద్ద ఉంది. 7 రోజులు నిల్వ ఉంచితే ₹{storage}/క్విం గిడ్డంగి ఖర్చు అవుతుంది కానీ తగినంత ధర పెరిగే అవకాశం తక్కువగా ఉంది.',
    'rec.cost_benefit_title': '7 రోజుల లాభ-నష్టాల సమగ్ర విశ్లేషణ (క్వింటాలుకు)',
    'rec.cb_gross': 'ఆశించే స్థూల ధర పెరుగుదల',
    'rec.cb_storage': 'గిడ్డంగి నిల్వ ఖర్చు (0.1%/రోజు × 7 రోజులు)',
    'rec.cb_risk': 'మార్కెట్ హెచ్చుతగ్గుల బఫర్ (2.0% రిస్క్ డిస్కౌంట్)',
    'rec.cb_net': 'నికర సర్దుబాటు చేసిన లాభం / నష్టం',
    'rec.arb_title': 'ఇతర ప్రాంతీయ మార్కెట్లలో అధిక ధరల అవకాశం (ఆర్బిట్రేజ్)',
    'rec.arb_opp_title': 'అధిక ధర అవకాశం: {yard} మార్కెట్‌కు రవాణా చేయండి',
    'rec.arb_opp_desc': 'ధర వ్యత్యాసం క్వింటాలుకు ₹{diff}. అంచనా రవాణా ఖర్చు (₹50/క్విం) మినహాయించిన తర్వాత, నికర అదనపు లాభం క్వింటాలుకు ₹{net} ({qty} క్వింటాళ్లకు మొత్తం ₹{total}).',
    'rec.arb_local_price': 'స్థానిక మార్కెట్ ధర ({yard})',
    'rec.arb_high_price': 'అత్యధిక ధర ఉన్న మార్కెట్ ({yard})',
    'rec.arb_transport': 'అంచనా రోడ్డు రవాణా ఖర్చు',
    'rec.arb_best_already': 'మీరు ఎంచుకున్న మార్కెట్‌లోనే రాష్ట్రంలో అత్యుత్తమ ధర లభిస్తోంది',
    'rec.arb_best_already_desc': 'ఇతర మార్కెట్లకు రవాణా చేయాల్సిన అవసరం లేదు. స్థానిక విక్రయమే అత్యధిక లాభదాయకం.',
    'rec.matrix_title': 'అన్ని మార్కెట్ల విక్రయ సలహా పట్టిక — {crop}',
    'rec.th_yard': 'మార్కెట్ యార్డ్',
    'rec.th_today': 'నేటి ధర',
    'rec.th_trend': '7 రోజుల మార్పు',
    'rec.th_advice': 'సలహా',
    'rec.th_action': 'చర్య',
    'rec.btn_calc': 'లెక్కించు',

    // Footer
    'footer.dept': 'తెలంగాణ రాష్ట్ర వ్యవసాయ మార్కెటింగ్ శాఖ',
    'footer.disclaimer': 'ముఖ్య గమనిక: ధరలు మరియు అంచనాలు చారిత్రక మార్కెట్ రాకలు, కనీస మద్దతు ధరలు (MSP), మరియు మెషిన్ లెర్నింగ్ మోడల్స్ ఆధారంగా రూపొందించిన అంచనాలు మాత్రమే. వాతావరణం మరియు మార్కెట్ రాకలను బట్టి ధరలు మారవచ్చు.',
    'footer.validation': 'తెలంగాణ మార్కెట్ యార్డులలోని 76,710 రికార్డుల ఆధారంగా ప్రామాణీకరించబడింది (2020–2026). డేటా తాజాకరణ: 19 నవంబర్ 2026.',
  },
};

const cropTranslations: Record<string, string> = {
  Cotton: 'పత్తి (Cotton)',
  Chilli: 'మిర్చి (Chilli)',
  Maize: 'మొక్కజొన్న (Maize)',
  Paddy: 'వరి (Paddy)',
  Turmeric: 'పసుపు (Turmeric)',
};

const yardTranslations: Record<string, string> = {
  'Hyderabad RCI Market': 'హైదరాబాద్ ఆర్.సి.ఐ మార్కెట్',
  'Warangal Gurramguda': 'వరంగల్ గుర్రంగూడ',
  'Karimnagar BCCL Market': 'కరీంనగర్ బి.సి.సి.ఎల్ మార్కెట్',
  'Nizamabad Gunj Market': 'నిజామాబాద్ గంజ్ మార్కెట్',
  Nizamabad: 'నిజామాబాద్',
  'Khammam Agricultural Market': 'ఖమ్మం వ్యవసాయ మార్కెట్',
  Khammam: 'ఖమ్మం',
  'Adilabad Cotton Yard': 'ఆదిలాబాద్ కాటన్ యార్డ్',
  Adilabad: 'ఆదిలాబాద్',
  Medak: 'మెదక్',
  Suryapet: 'సూర్యాపేట',
  Mahbubnagar: 'మహబూబ్‌నగర్',
  Nalgonda: 'నల్గొండ',
};

const adviceTranslations: Record<string, string> = {
  'Sell Now': 'ఇప్పుడే అమ్మండి',
  'Sell': 'అమ్మండి',
  'Wait': 'వేచి ఉండండి',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('smart_mandi_language');
    return saved === 'te' ? 'te' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('smart_mandi_language', language);
    if (language === 'te') {
      document.documentElement.lang = 'te';
    } else {
      document.documentElement.lang = 'en';
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'te' : 'en'));
  };

  const t = (key: string, paramsOrFallback?: Record<string, string | number> | string): string => {
    const dict = translations[language] || translations.en;
    const enDict = translations.en;
    let text =
      dict[key] ||
      enDict[key] ||
      (typeof paramsOrFallback === 'string' ? paramsOrFallback : key);

    if (paramsOrFallback && typeof paramsOrFallback === 'object') {
      for (const [paramKey, paramVal] of Object.entries(paramsOrFallback)) {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      }
    }
    return text;
  };

  const cropName = (crop: string): string => {
    if (language === 'te' && cropTranslations[crop]) {
      return cropTranslations[crop];
    }
    return crop;
  };

  const yardName = (yard: string): string => {
    if (language === 'te' && yardTranslations[yard]) {
      return yardTranslations[yard];
    }
    return yard;
  };

  const adviceName = (advice: string): string => {
    if (language === 'te') {
      for (const [enKey, teVal] of Object.entries(adviceTranslations)) {
        if (advice.toLowerCase().includes(enKey.toLowerCase())) {
          return teVal;
        }
      }
    }
    return advice;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        cropName,
        yardName,
        adviceName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
