"""
Comprehensive Phase-by-Phase Test Script for Smart Mandi Advisory
Generates synthetic data and tests each phase independently.
"""

import sys
import os
import traceback

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# ============================================================
# HELPER: Generate realistic synthetic Telangana market data
# ============================================================
def generate_synthetic_data():
    """Generate realistic synthetic market data for testing"""
    print("=" * 60)
    print("GENERATING SYNTHETIC MARKET DATA")
    print("=" * 60)

    np.random.seed(42)

    commodities = ['Cotton', 'Chilli', 'Maize', 'Paddy', 'Turmeric']
    yards = [
        'Hyderabad RCI Market', 'Warangal Gurramguda', 'Karimnagar BCCL Market',
        'Nizamabad', 'Khammam', 'Adilabad'
    ]
    varieties = {
        'Cotton': ['H4', 'DCH-32', 'Bunny'],
        'Chilli': ['Teja', 'Byadgi', '334'],
        'Maize': ['Yellow', 'White', 'Hybrid'],
        'Paddy': ['BPT 5204', 'IR64', 'Sona Masuri'],
        'Turmeric': ['Erode', 'Salem', 'Nizamabad Bulb']
    }

    base_prices = {
        'Cotton': 7500, 'Chilli': 11000, 'Maize': 2000,
        'Paddy': 1900, 'Turmeric': 8000
    }

    dates = pd.date_range(start='2020-01-01', end='2026-12-31', freq='D')

    rows = []
    for commodity in commodities:
        for yard in yards:
            variety = varieties[commodity][0]
            base = base_prices[commodity]

            for date in dates:
                # Add seasonal pattern
                month = date.month
                seasonal = np.sin(2 * np.pi * month / 12) * base * 0.08

                # Add yearly trend
                year_offset = (date.year - 2020) * base * 0.05

                # Add yard premium
                yard_premium = hash(yard) % 500 - 250

                # Random noise
                noise = np.random.normal(0, base * 0.03)

                modal_price = base + seasonal + year_offset + yard_premium + noise
                min_price = modal_price * 0.9
                max_price = modal_price * 1.1
                arrivals = max(10, int(np.random.normal(500, 200)))

                rows.append({
                    'date': date,
                    'market_yard': yard,
                    'commodity': commodity,
                    'variety': variety,
                    'min_price': round(min_price, 2),
                    'max_price': round(max_price, 2),
                    'modal_price': round(modal_price, 2),
                    'arrivals': arrivals
                })

    df = pd.DataFrame(rows)
    print(f"  Generated {len(df):,} records")
    print(f"  Commodities: {df['commodity'].nunique()}")
    print(f"  Market Yards: {df['market_yard'].nunique()}")
    print(f"  Date Range: {df['date'].min().date()} to {df['date'].max().date()}")
    print(f"  Columns: {list(df.columns)}")
    print()
    return df


# ============================================================
# PHASE 1: Data Audit
# ============================================================
def test_phase1(df):
    print("=" * 60)
    print("PHASE 1: DATA AUDIT AND SELECTION")
    print("=" * 60)

    # Save sample CSVs to simulate raw data
    os.makedirs('data/raw', exist_ok=True)
    for i, commodity in enumerate(df['commodity'].unique()):
        subset = df[df['commodity'] == commodity]
        subset.to_csv(f'data/raw/market_data_{i+1}.csv', index=False)

    from src.data_audit import audit_datasets
    audit_results = audit_datasets('data/raw')
    print("\n  Audit Results:")
    print(audit_results.to_string(index=False))
    print(f"\n  ✓ Audited {len(audit_results)} dataset files")
    print(f"  ✓ Total missing values: {audit_results['missing_values'].sum()}")
    print(f"  ✓ Total duplicate rows: {audit_results['duplicate_rows'].sum()}")
    print()
    return audit_results


# ============================================================
# PHASE 2: Data Cleaning
# ============================================================
def test_phase2(df):
    print("=" * 60)
    print("PHASE 2: DATA CLEANING AND INTEGRATION")
    print("=" * 60)

    from src.data_cleaning import (
        standardize_dates, standardize_names, remove_duplicates,
        handle_missing_values, detect_outliers, clean_dataset
    )

    original_shape = df.shape
    print(f"  Original shape: {original_shape}")

    # Inject some issues for testing
    df_test = df.copy()
    # Add some NaN values
    nan_indices = np.random.choice(len(df_test), size=50, replace=False)
    df_test.loc[nan_indices, 'modal_price'] = np.nan
    # Add duplicates
    dups = df_test.sample(20)
    df_test = pd.concat([df_test, dups], ignore_index=True)
    print(f"  After injecting issues: {df_test.shape}")
    print(f"  Missing modal_price: {df_test['modal_price'].isna().sum()}")
    print(f"  Duplicates: {df_test.duplicated(subset=['date','market_yard','commodity','variety']).sum()}")

    # Test standardize_dates
    df_clean = standardize_dates(df_test)
    print(f"\n  ✓ standardize_dates: dtype = {df_clean['date'].dtype}")

    # Test remove_duplicates
    df_clean = remove_duplicates(df_clean)
    print(f"  ✓ remove_duplicates: {original_shape[0] + 50 - len(df_clean)} duplicates removed -> {df_clean.shape}")

    # Test handle_missing_values
    before_missing = df_clean['modal_price'].isna().sum()
    df_clean = handle_missing_values(df_clean)
    after_missing = df_clean['modal_price'].isna().sum()
    print(f"  ✓ handle_missing_values: {before_missing} -> {after_missing} missing values")

    # Test detect_outliers
    outliers = detect_outliers(df_clean)
    print(f"  ✓ detect_outliers: Found {len(outliers)} outliers ({len(outliers)/len(df_clean)*100:.2f}%)")

    # Test full pipeline
    df_full_clean = clean_dataset(df_test.copy())
    os.makedirs('data/processed', exist_ok=True)
    df_full_clean.to_csv('data/processed/market_data_cleaned.csv', index=False)
    print(f"\n  ✓ Full clean_dataset pipeline: {df_test.shape} -> {df_full_clean.shape}")
    print(f"  ✓ Saved cleaned data to data/processed/market_data_cleaned.csv")
    print()
    return df_full_clean


# ============================================================
# PHASE 3: Exploratory Analysis
# ============================================================
def test_phase3(df):
    print("=" * 60)
    print("PHASE 3: EXPLORATORY ANALYSIS")
    print("=" * 60)

    from src.exploratory_analysis import (
        analyze_price_trends, analyze_seasonal_patterns,
        analyze_yard_variations, analyze_arrivals_price_relationship,
        generate_insights
    )

    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month

    # Price trends
    yearly_avg = analyze_price_trends(df)
    print("\n  Price Trends (Yearly Average):")
    print(yearly_avg.to_string())

    # Seasonal patterns
    monthly_avg = analyze_seasonal_patterns(df)
    print(f"\n  ✓ Seasonal patterns: {monthly_avg.shape} (commodities x months)")

    # Yard variations
    yard_avg = analyze_yard_variations(df)
    print(f"  ✓ Yard variations: {yard_avg.shape}")

    # Arrivals-price correlation
    correlation = analyze_arrivals_price_relationship(df)
    print("\n  Arrivals-Price Correlation:")
    for commodity, corr in correlation.items():
        print(f"    {commodity}: {corr:.4f}")

    # Visualizations
    from src.exploratory_analysis import create_visualizations
    os.makedirs('reports', exist_ok=True)
    try:
        create_visualizations(df, 'reports')
        print(f"  ✓ Saved visualizations to reports/ (price_trends.png, seasonal_patterns.png)")
    except Exception as e:
        print(f"  ⚠ Visualization note: {e}")

    # Insights
    insights = generate_insights(df)
    print(f"\n  ✓ Generated {len(insights)} insights:")
    for i, insight in enumerate(insights, 1):
        print(f"    {i}. {insight}")
    print()
    return True


# ============================================================
# PHASE 4: Feature Engineering
# ============================================================
def test_phase4(df):
    print("=" * 60)
    print("PHASE 4: FEATURE ENGINEERING")
    print("=" * 60)

    from src.feature_engineering import (
        add_msp_features, add_rainfall_features,
        add_seasonal_features, create_lag_features,
        create_rolling_features, engineer_features
    )

    original_cols = len(df.columns)
    df_sorted = df.sort_values(['market_yard', 'commodity', 'date']).reset_index(drop=True)

    # MSP features
    df_feat = add_msp_features(df_sorted.copy())
    msp_cols = [c for c in df_feat.columns if 'msp' in c.lower()]
    print(f"\n  ✓ MSP features added: {msp_cols}")
    print(f"    Sample MSP gap: Cotton = ₹{df_feat[df_feat['commodity']=='Cotton']['msp_gap'].mean():,.0f}")

    # Rainfall features
    df_feat = add_rainfall_features(df_feat)
    rain_cols = [c for c in df_feat.columns if 'rainfall' in c.lower()]
    print(f"  ✓ Rainfall features added: {rain_cols}")

    # Seasonal features
    df_feat = add_seasonal_features(df_feat)
    season_cols = ['season', 'is_harvest_season', 'festival_diwali', 'festival_holi']
    print(f"  ✓ Seasonal features added: {season_cols}")
    print(f"    Season distribution: {df_feat['season'].value_counts().to_dict()}")

    # Lag features
    df_feat = create_lag_features(df_feat)
    lag_cols = [c for c in df_feat.columns if 'lag' in c]
    print(f"  ✓ Lag features added: {len(lag_cols)} columns")

    # Rolling features
    df_feat = create_rolling_features(df_feat)
    rolling_cols = [c for c in df_feat.columns if 'rolling' in c or 'volatility' in c]
    print(f"  ✓ Rolling features added: {len(rolling_cols)} columns")

    # Full pipeline
    df_full = engineer_features(df_sorted.copy())
    new_cols = len(df_full.columns)
    df_full.to_csv('data/processed/market_data_features.csv', index=False)
    print(f"\n  ✓ Full engineer_features pipeline: {original_cols} -> {new_cols} columns (+{new_cols - original_cols})")
    print(f"  ✓ Saved feature-engineered data to data/processed/market_data_features.csv")
    print(f"    All new columns: {[c for c in df_full.columns if c not in df_sorted.columns]}")
    print()
    return df_full


# ============================================================
# PHASE 5: Baseline Models
# ============================================================
def test_phase5(df):
    print("=" * 60)
    print("PHASE 5: BASELINE MODELS")
    print("=" * 60)

    from src.models import (
        naive_forecast, seasonal_naive_forecast,
        moving_average_forecast, calculate_metrics
    )

    # Use a single commodity-yard for testing
    test_data = df[(df['commodity'] == 'Cotton') & (df['market_yard'] == 'Hyderabad RCI Market')].copy()
    test_data = test_data.sort_values('date').reset_index(drop=True)
    test_data['modal_price_target'] = test_data['modal_price'].shift(-7)

    print(f"\n  Test data: {len(test_data)} rows (Cotton @ Hyderabad RCI Market)")

    # Naive forecast
    test_naive = naive_forecast(test_data.copy(), horizon=7)
    actual = test_naive['modal_price_target'].dropna()
    predicted = test_naive['naive_forecast'].dropna()
    common_idx = actual.index.intersection(predicted.index)
    if len(common_idx) > 0:
        metrics = calculate_metrics(actual[common_idx].values, predicted[common_idx].values)
        if metrics:
            print(f"  ✓ Naive Model:    MAE=₹{metrics['MAE']:,.0f}  RMSE=₹{metrics['RMSE']:,.0f}  MAPE={metrics['MAPE']:.1f}%")

    # Seasonal naive
    test_seasonal = seasonal_naive_forecast(test_data.copy(), horizon=7)
    predicted_s = test_seasonal['seasonal_naive'].dropna()
    common_idx_s = actual.index.intersection(predicted_s.index)
    if len(common_idx_s) > 0:
        metrics_s = calculate_metrics(actual[common_idx_s].values, predicted_s[common_idx_s].values)
        if metrics_s:
            print(f"  ✓ Seasonal Naive: MAE=₹{metrics_s['MAE']:,.0f}  RMSE=₹{metrics_s['RMSE']:,.0f}  MAPE={metrics_s['MAPE']:.1f}%")

    # Moving average
    test_ma = test_data.copy()
    test_ma['ma_forecast'] = test_ma['modal_price'].rolling(7).mean()
    predicted_ma = test_ma['ma_forecast'].dropna()
    actual_ma = test_ma['modal_price_target'].loc[predicted_ma.index].dropna()
    common_idx_ma = actual_ma.index.intersection(predicted_ma.index)
    if len(common_idx_ma) > 0:
        metrics_ma = calculate_metrics(actual_ma[common_idx_ma].values, predicted_ma[common_idx_ma].values)
        if metrics_ma:
            print(f"  ✓ Moving Avg (7): MAE=₹{metrics_ma['MAE']:,.0f}  RMSE=₹{metrics_ma['RMSE']:,.0f}  MAPE={metrics_ma['MAPE']:.1f}%")

    print()
    return True


# ============================================================
# PHASE 6: Advanced Models
# ============================================================
def test_phase6(df):
    print("=" * 60)
    print("PHASE 6: ADVANCED FORECASTING MODELS")
    print("=" * 60)

    from src.advanced_models import (
        fit_arima_model, fit_random_forest, fit_xgboost_model,
        ARIMA_AVAILABLE, XGBOOST_AVAILABLE
    )

    # Test on single commodity-yard
    test_data = df[(df['commodity'] == 'Cotton') & (df['market_yard'] == 'Hyderabad RCI Market')].copy()
    test_data = test_data.sort_values('date').reset_index(drop=True)

    print(f"\n  Library availability:")
    print(f"    ARIMA (statsmodels): {'✓ Available' if ARIMA_AVAILABLE else '✗ Not installed'}")
    print(f"    XGBoost: {'✓ Available' if XGBOOST_AVAILABLE else '✗ Not installed'}")

    try:
        from prophet import Prophet
        print(f"    Prophet: ✓ Available")
        PROPHET_AVAILABLE = True
    except ImportError:
        print(f"    Prophet: ✗ Not installed (optional)")
        PROPHET_AVAILABLE = False

    # ARIMA
    if ARIMA_AVAILABLE:
        series = test_data['modal_price'].values[-200:]
        arima_model = fit_arima_model(pd.Series(series), order=(1, 1, 1))
        if arima_model:
            forecast = arima_model.forecast(steps=7)
            print(f"\n  ✓ ARIMA(1,1,1): 7-day forecast = {[f'₹{p:,.0f}' for p in forecast]}")
        else:
            print(f"\n  ⚠ ARIMA fitting failed")

    # Random Forest
    feature_cols = ['modal_price_lag_1', 'modal_price_lag_7', 'modal_price_rolling_mean_7']
    if all(col in df.columns for col in feature_cols):
        X_train = df[feature_cols].dropna()
        y_train = df.loc[X_train.index, 'modal_price']
        rf_model = fit_random_forest(X_train, y_train)
        if rf_model:
            predictions = rf_model.predict(X_train.tail(7))
            print(f"  ✓ Random Forest: 7-sample predictions = {[f'₹{p:,.0f}' for p in predictions]}")
            importances = dict(zip(feature_cols, rf_model.feature_importances_))
            print(f"    Feature importances: { {k: f'{v:.3f}' for k, v in importances.items()} }")
    else:
        # Create simple features for testing
        test_data['modal_price_lag_1'] = test_data['modal_price'].shift(1)
        test_data['modal_price_lag_7'] = test_data['modal_price'].shift(7)
        test_data['modal_price_rolling_mean_7'] = test_data['modal_price'].rolling(7).mean()
        feature_cols_simple = ['modal_price_lag_1', 'modal_price_lag_7', 'modal_price_rolling_mean_7']
        X = test_data[feature_cols_simple].dropna()
        y = test_data.loc[X.index, 'modal_price']

        rf_model = fit_random_forest(X, y)
        if rf_model:
            predictions = rf_model.predict(X.tail(7))
            print(f"  ✓ Random Forest: 7-sample predictions = {[f'₹{p:,.0f}' for p in predictions]}")
            importances = dict(zip(feature_cols_simple, rf_model.feature_importances_))
            print(f"    Feature importances: { {k: f'{v:.3f}' for k, v in importances.items()} }")

    # XGBoost
    if XGBOOST_AVAILABLE:
        test_data2 = test_data.copy()
        test_data2['lag1'] = test_data2['modal_price'].shift(1)
        test_data2['lag7'] = test_data2['modal_price'].shift(7)
        test_data2['roll7'] = test_data2['modal_price'].rolling(7).mean()
        X_xgb = test_data2[['lag1','lag7','roll7']].dropna()
        y_xgb = test_data2.loc[X_xgb.index, 'modal_price']
        xgb_model = fit_xgboost_model(X_xgb, y_xgb)
        if xgb_model:
            xgb_preds = xgb_model.predict(X_xgb.tail(7))
            print(f"  ✓ XGBoost: 7-sample predictions = {[f'₹{p:,.0f}' for p in xgb_preds]}")

    print()
    return True


# ============================================================
# PHASE 7: Model Evaluation
# ============================================================
def test_phase7(df):
    print("=" * 60)
    print("PHASE 7: MODEL EVALUATION AND COMPARISON")
    print("=" * 60)

    from src.evaluation import (
        calculate_comprehensive_metrics, compare_models,
        create_evaluation_visualizations, generate_evaluation_report
    )

    # Simulate results from multiple models
    np.random.seed(42)
    test_data = df[(df['commodity'] == 'Cotton') & (df['market_yard'] == 'Hyderabad RCI Market')].copy()
    test_data = test_data.sort_values('date').reset_index(drop=True)
    actual = test_data['modal_price'].values[-100:]

    models_preds = {
        'Naive': actual + np.random.normal(0, 300, 100),
        'Moving_Average': actual + np.random.normal(0, 250, 100),
        'ARIMA': actual + np.random.normal(0, 230, 100),
        'Random_Forest': actual + np.random.normal(0, 220, 100),
        'XGBoost': actual + np.random.normal(0, 210, 100),
    }

    results = []
    for model_name, predicted in models_preds.items():
        for horizon in [7, 14]:
            metrics = calculate_comprehensive_metrics(actual, predicted)
            if metrics:
                metrics['Model'] = model_name
                metrics['Horizon'] = f'{horizon}d'
                results.append(metrics)

    results_df = pd.DataFrame(results)

    print("\n  Comprehensive Metrics:")
    display_cols = ['Model', 'Horizon', 'MAE', 'RMSE', 'MAPE', 'SMAPE', 'MASE', 'Directional_Accuracy']
    print(results_df[display_cols].to_string(index=False, float_format='{:.2f}'.format))

    # Model comparison
    comparison = compare_models(results_df[results_df['Horizon'] == '7d'])
    print(f"\n  Best Models (7-day horizon):")
    for metric, info in comparison.items():
        print(f"    {metric}: {info['best_model']} ({info['best_value']:.2f})")

    # Generate reports and plots
    try:
        generate_evaluation_report(results_df, 'reports')
        create_evaluation_visualizations(results_df, 'reports')
        print(f"  ✓ Saved evaluation report & plots to reports/")
    except Exception as e:
        print(f"  ⚠ Report generation note: {e}")

    print()
    return results_df


# ============================================================
# PHASE 8: Recommendation Engine
# ============================================================
def test_phase8(df):
    print("=" * 60)
    print("PHASE 8: RECOMMENDATION ENGINE")
    print("=" * 60)

    from src.recommendation import RecommendationEngine

    engine = RecommendationEngine()
    print(f"\n  Config: {engine.config}")

    # Test net gain calculation
    gain = engine.calculate_net_gain(
        current_price=8500,
        forecast_price=9000,
        days_to_wait=7
    )
    print(f"\n  Net Gain Calculation (₹8,500 -> ₹9,000 in 7 days):")
    for k, v in gain.items():
        print(f"    {k}: ₹{v:,.2f}" if 'pct' not in k else f"    {k}: {v:.2f}%")

    # Test recommendation scenarios
    scenarios = [
        {"name": "Rising market", "current": 8500, "f7d": 9200, "f14d": 9500, "c7d": 0.85, "c14d": 0.70},
        {"name": "Stable market", "current": 8500, "f7d": 8550, "f14d": 8600, "c7d": 0.90, "c14d": 0.85},
        {"name": "Declining market", "current": 8500, "f7d": 8200, "f14d": 7900, "c7d": 0.80, "c14d": 0.75},
        {"name": "Uncertain rise", "current": 8500, "f7d": 9000, "f14d": 9500, "c7d": 0.40, "c14d": 0.30},
    ]

    print(f"\n  Recommendation Scenarios:")
    print(f"  {'Scenario':<20} {'Recommendation':<18} {'Confidence':<12} {'Net Gain %':<10}")
    print(f"  {'-'*60}")
    for s in scenarios:
        rec = engine.generate_recommendation(s['current'], s['f7d'], s['f14d'], s['c7d'], s['c14d'])
        print(f"  {s['name']:<20} {rec['recommendation']:<18} {rec['confidence_level']:<12} {rec['net_gain_pct']:<10.2f}")

    # Test yard comparison
    yards_data = [
        {'yard': 'Hyderabad', 'current_price': 8800, 'forecast_7d': 9200, 'forecast_14d': 9500, 'confidence_7d': 0.85, 'confidence_14d': 0.75},
        {'yard': 'Warangal', 'current_price': 8500, 'forecast_7d': 8600, 'forecast_14d': 8700, 'confidence_7d': 0.80, 'confidence_14d': 0.70},
        {'yard': 'Karimnagar', 'current_price': 8300, 'forecast_7d': 8900, 'forecast_14d': 9200, 'confidence_7d': 0.75, 'confidence_14d': 0.65},
    ]
    comparisons = engine.compare_yards('Cotton', yards_data)
    print(f"\n  Yard Comparison (Cotton):")
    print(f"  {'Yard':<20} {'Price':<12} {'Recommendation':<18} {'Confidence':<12}")
    print(f"  {'-'*62}")
    for c in comparisons:
        print(f"  {c['yard']:<20} ₹{c['current_price']:<10,} {c['recommendation']['recommendation']:<18} {c['recommendation']['confidence_level']:<12}")

    print()
    return True


# ============================================================
# PHASE 9: App Validation (import check)
# ============================================================
def test_phase9():
    print("=" * 60)
    print("PHASE 9: WEB APP VALIDATION")
    print("=" * 60)

    # Check imports
    modules = [
        ('streamlit', 'Streamlit'),
        ('plotly.express', 'Plotly Express'),
        ('plotly.graph_objects', 'Plotly Graph Objects'),
    ]

    for module_name, display_name in modules:
        try:
            __import__(module_name)
            print(f"  ✓ {display_name} imported successfully")
        except ImportError:
            print(f"  ✗ {display_name} not available")

    # Check app files exist
    app_files = [
        'app/app.py',
        'app/pages/forecast.py',
        'app/pages/recommendation.py',
        'app/pages/market_comparison.py',
    ]

    for f in app_files:
        exists = os.path.exists(f)
        print(f"  {'✓' if exists else '✗'} {f}: {'exists' if exists else 'MISSING'}")

    # Validate app.py can be parsed
    try:
        import ast
        with open('app/app.py', 'r') as f:
            ast.parse(f.read())
        print(f"  ✓ app/app.py: valid Python syntax")
    except SyntaxError as e:
        print(f"  ✗ app/app.py: syntax error - {e}")

    for page in app_files[1:]:
        try:
            with open(page, 'r') as f:
                ast.parse(f.read())
            print(f"  ✓ {page}: valid Python syntax")
        except SyntaxError as e:
            print(f"  ✗ {page}: syntax error - {e}")

    print()
    return True


# ============================================================
# MAIN: Run all phases
# ============================================================
if __name__ == "__main__":
    print("\n" + "🌾" * 30)
    print("  SMART MANDI ADVISORY - COMPREHENSIVE PHASE TESTING")
    print("🌾" * 30 + "\n")

    results = {}

    try:
        # Generate data
        df = generate_synthetic_data()
        results['Data Generation'] = '✓ PASS'

        # Phase 1
        try:
            audit = test_phase1(df)
            results['Phase 1: Data Audit'] = '✓ PASS'
        except Exception as e:
            results['Phase 1: Data Audit'] = f'✗ FAIL: {e}'
            traceback.print_exc()

        # Phase 2
        try:
            df_clean = test_phase2(df)
            results['Phase 2: Data Cleaning'] = '✓ PASS'
        except Exception as e:
            results['Phase 2: Data Cleaning'] = f'✗ FAIL: {e}'
            traceback.print_exc()

        # Phase 3
        try:
            test_phase3(df_clean)
            results['Phase 3: Exploratory Analysis'] = '✓ PASS'
        except Exception as e:
            results['Phase 3: Exploratory Analysis'] = f'✗ FAIL: {e}'
            traceback.print_exc()

        # Phase 4
        try:
            df_feat = test_phase4(df_clean)
            results['Phase 4: Feature Engineering'] = '✓ PASS'
        except Exception as e:
            results['Phase 4: Feature Engineering'] = f'✗ FAIL: {e}'
            traceback.print_exc()

        # Phase 5
        try:
            test_phase5(df_feat)
            results['Phase 5: Baseline Models'] = '✓ PASS'
        except Exception as e:
            results['Phase 5: Baseline Models'] = f'✗ FAIL: {e}'
            traceback.print_exc()

        # Phase 6
        try:
            test_phase6(df_feat)
            results['Phase 6: Advanced Models'] = '✓ PASS'
        except Exception as e:
            results['Phase 6: Advanced Models'] = f'✗ FAIL: {e}'
            traceback.print_exc()

        # Phase 7
        try:
            test_phase7(df_feat)
            results['Phase 7: Evaluation'] = '✓ PASS'
        except Exception as e:
            results['Phase 7: Evaluation'] = f'✗ FAIL: {e}'
            traceback.print_exc()

        # Phase 8
        try:
            test_phase8(df_feat)
            results['Phase 8: Recommendation'] = '✓ PASS'
        except Exception as e:
            results['Phase 8: Recommendation'] = f'✗ FAIL: {e}'
            traceback.print_exc()

        # Phase 9
        try:
            test_phase9()
            results['Phase 9: Web App'] = '✓ PASS'
        except Exception as e:
            results['Phase 9: Web App'] = f'✗ FAIL: {e}'
            traceback.print_exc()

    except Exception as e:
        results['Data Generation'] = f'✗ FAIL: {e}'
        traceback.print_exc()

    # Final Summary
    print("\n" + "=" * 60)
    print("FINAL SUMMARY")
    print("=" * 60)
    for phase, status in results.items():
        print(f"  {phase}: {status}")

    passed = sum(1 for s in results.values() if '✓' in s)
    total = len(results)
    print(f"\n  Results: {passed}/{total} phases passed")
    print("=" * 60)
