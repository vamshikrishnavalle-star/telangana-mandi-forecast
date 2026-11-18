"""
Phase 6: Advanced Forecasting Models
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
import warnings
warnings.filterwarnings('ignore')

# Try importing advanced libraries
try:
    from statsmodels.tsa.arima.model import ARIMA
    ARIMA_AVAILABLE = True
except ImportError:
    ARIMA_AVAILABLE = False

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False

try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

def fit_arima_model(series, order=(1, 1, 1)):
    """Fit ARIMA model to time series"""
    if not ARIMA_AVAILABLE:
        return None
    
    try:
        model = ARIMA(series, order=order)
        fitted_model = model.fit()
        return fitted_model
    except Exception as e:
        print(f"ARIMA fitting failed: {e}")
        return None

def fit_prophet_model(df):
    """Fit Prophet model to time series"""
    if not PROPHET_AVAILABLE:
        return None
    
    try:
        # Prepare data for Prophet
        prophet_data = df[['date', 'modal_price']].rename(columns={'date': 'ds', 'modal_price': 'y'})
        
        model = Prophet(daily_seasonality=False, weekly_seasonality=True, yearly_seasonality=True)
        model.fit(prophet_data)
        
        return model
    except Exception as e:
        print(f"Prophet fitting failed: {e}")
        return None

def fit_random_forest(X_train, y_train):
    """Fit Random Forest model"""
    try:
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        return model
    except Exception as e:
        print(f"Random Forest fitting failed: {e}")
        return None

def fit_xgboost_model(X_train, y_train):
    """Fit XGBoost model"""
    if not XGBOOST_AVAILABLE:
        return None
    
    try:
        model = xgb.XGBRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        return model
    except Exception as e:
        print(f"XGBoost fitting failed: {e}")
        return None

def prepare_features_for_ml(df, feature_cols):
    """Prepare features for machine learning models"""
    # Select features
    X = df[feature_cols].copy()
    y = df['modal_price'].copy()
    
    # Handle missing values
    X = X.fillna(method='ffill').fillna(method='bfill')
    
    return X, y

def create_advanced_models(df):
    """Create and fit advanced forecasting models"""
    models = {}
    
    # Feature columns for ML models
    feature_cols = ['modal_price_lag_1', 'modal_price_lag_7', 'modal_price_lag_14',
                   'arrivals_lag_1', 'arrivals_lag_7', 'price_change_1d',
                   'price_volatility_7', 'rainfall_7d', 'msp_gap_pct']
    
    # Prepare data
    X, y = prepare_features_for_ml(df, feature_cols)
    
    # Fit models
    models['random_forest'] = fit_random_forest(X, y)
    models['xgboost'] = fit_xgboost_model(X, y)
    
    # Fit time series models for each commodity-yard combination
    for commodity in df['commodity'].unique():
        for yard in df['market_yard'].unique():
            series_data = df[(df['commodity'] == commodity) & (df['market_yard'] == yard)]
            if len(series_data) > 30:
                models[f'arima_{commodity}_{yard}'] = fit_arima_model(series_data['modal_price'])
                models[f'prophet_{commodity}_{yard}'] = fit_prophet_model(series_data)
    
    return models
