"""
Phase 4: Feature Engineering and External Data Integration
"""

import pandas as pd
import numpy as np
from datetime import datetime

def add_msp_features(df):
    """Add Minimum Support Price features"""
    msp_data = {
        'Cotton': {2020: 5515, 2021: 5715, 2022: 8615, 2023: 8915, 2024: 9200, 2025: 9500, 2026: 9800},
        'Chilli': {2020: 7000, 2021: 7500, 2022: 8000, 2023: 8500, 2024: 9000, 2025: 9500, 2026: 10000},
        'Maize': {2020: 1870, 2021: 1920, 2022: 2015, 2023: 2115, 2024: 2225, 2025: 2325, 2026: 2425},
        'Paddy': {2020: 1910, 2021: 1940, 2022: 2015, 2023: 2180, 2024: 2300, 2025: 2400, 2026: 2500},
        'Turmeric': {2020: 6200, 2021: 6500, 2022: 7000, 2023: 7500, 2024: 8000, 2025: 8500, 2026: 9000}
    }
    
    df['year'] = df['date'].dt.year
    df['msp'] = 0.0
    
    for commodity in df['commodity'].unique():
        if commodity in msp_data:
            for year, price in msp_data[commodity].items():
                mask = (df['commodity'] == commodity) & (df['year'] == year)
                df.loc[mask, 'msp'] = price
    
    df['msp_gap'] = df['modal_price'] - df['msp']
    df['msp_gap_pct'] = (df['msp_gap'] / df['msp']) * 100
    
    return df

def add_rainfall_features(df):
    """Add synthetic rainfall features based on Telangana climate"""
    # Generate synthetic rainfall data
    df['rainfall'] = np.random.normal(10, 5, len(df))
    df['rainfall'] = df['rainfall'].clip(lower=0)
    
    # Rolling rainfall totals
    df['rainfall_7d'] = df.groupby(['market_yard', 'commodity'])['rainfall'].rolling(7).sum().reset_index(level=[0,1], drop=True)
    df['rainfall_30d'] = df.groupby(['market_yard', 'commodity'])['rainfall'].rolling(30).sum().reset_index(level=[0,1], drop=True)
    
    return df

def add_seasonal_features(df):
    """Add season and festival features"""
    df['season'] = df['date'].dt.month.apply(lambda x: 'Kharif' if x in [6,7,8,9,10,11] else 'Rabi')
    df['is_harvest_season'] = df['date'].dt.month.isin([3,4,10,11,12]).astype(int)
    
    # Festival indicators
    df['festival_diwali'] = df['date'].dt.month.isin([10,11]).astype(int)
    df['festival_holi'] = df['date'].dt.month.isin([2,3]).astype(int)
    
    return df

def create_lag_features(df, lag_periods=[1, 7, 14, 30]):
    """Create lag features for time series modeling"""
    for lag in lag_periods:
        df[f'modal_price_lag_{lag}'] = df.groupby(['market_yard', 'commodity'])['modal_price'].shift(lag)
        df[f'arrivals_lag_{lag}'] = df.groupby(['market_yard', 'commodity'])['arrivals'].shift(lag)
    
    return df

def create_rolling_features(df, windows=[7, 14, 30]):
    """Create rolling statistical features"""
    for window in windows:
        df[f'modal_price_rolling_mean_{window}'] = df.groupby(['market_yard', 'commodity'])['modal_price'].rolling(window).mean().reset_index(level=[0,1], drop=True)
        df[f'modal_price_rolling_std_{window}'] = df.groupby(['market_yard', 'commodity'])['modal_price'].rolling(window).std().reset_index(level=[0,1], drop=True)
        df[f'price_volatility_{window}'] = (df[f'modal_price_rolling_std_{window}'] / df[f'modal_price_rolling_mean_{window}']) * 100
    
    return df

def engineer_features(df):
    """Complete feature engineering pipeline"""
    df = add_msp_features(df)
    df = add_rainfall_features(df)
    df = add_seasonal_features(df)
    df = create_lag_features(df)
    df = create_rolling_features(df)
    
    return df
