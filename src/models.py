"""
Phase 5: Baseline Models
"""

import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error

def naive_forecast(df, horizon=7):
    """Naive forecast: tomorrow = today"""
    df['naive_forecast'] = df.groupby(['market_yard', 'commodity'])['modal_price'].shift(horizon)
    return df

def seasonal_naive_forecast(df, horizon=7):
    """Seasonal naive forecast using same day last week"""
    df['seasonal_naive'] = df.groupby(['market_yard', 'commodity'])['modal_price'].shift(horizon)
    return df

def moving_average_forecast(df, window=7, horizon=7):
    """Moving average forecast"""
    df['ma_forecast'] = df.groupby(['market_yard', 'commodity'])['modal_price'].transform(
        lambda s: s.rolling(window).mean().shift(horizon)
    )
    return df

def calculate_metrics(actual, predicted):
    """Calculate evaluation metrics"""
    actual_arr = np.asarray(actual, dtype=float)
    predicted_arr = np.asarray(predicted, dtype=float)
    mask = ~(np.isnan(actual_arr) | np.isnan(predicted_arr))
    actual_clean = actual_arr[mask]
    predicted_clean = predicted_arr[mask]
    
    if len(actual_clean) == 0:
        return None
    
    mae = mean_absolute_error(actual_clean, predicted_clean)
    rmse = np.sqrt(mean_squared_error(actual_clean, predicted_clean))
    mape = np.mean(np.abs((actual_clean - predicted_clean) / actual_clean)) * 100
    
    return {
        'MAE': mae,
        'RMSE': rmse,
        'MAPE': mape,
        'Count': len(actual_clean)
    }

def evaluate_baseline_models(df, horizon=7):
    """Evaluate all baseline models"""
    results = []
    
    # Naive model
    df_naive = naive_forecast(df, horizon)
    metrics_naive = calculate_metrics(df_naive['modal_price_target'], df_naive['naive_forecast'])
    if metrics_naive:
        metrics_naive['Model'] = 'Naive'
        results.append(metrics_naive)
    
    # Seasonal naive
    df_seasonal = seasonal_naive_forecast(df, horizon)
    metrics_seasonal = calculate_metrics(df_seasonal['modal_price_target'], df_seasonal['seasonal_naive'])
    if metrics_seasonal:
        metrics_seasonal['Model'] = 'Seasonal_Naive'
        results.append(metrics_seasonal)
    
    # Moving average
    df_ma = moving_average_forecast(df, window=7, horizon=horizon)
    metrics_ma = calculate_metrics(df_ma['modal_price_target'], df_ma['ma_forecast'])
    if metrics_ma:
        metrics_ma['Model'] = 'Moving_Average'
        results.append(metrics_ma)
    
    return pd.DataFrame(results)
