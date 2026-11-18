"""
Phase 2: Data Cleaning and Integration
"""

import pandas as pd
import numpy as np
import re

def standardize_dates(df):
    """Standardize date format across all datasets"""
    df['date'] = pd.to_datetime(df['date'])
    return df

def standardize_names(df):
    """Standardize commodity, variety, and yard names"""
    # Commodity standardization
    df['commodity'] = df['commodity'].str.title().str.strip()
    
    # Yard name standardization
    yard_mapping = {
        'rci market': 'Hyderabad RCI Market',
        'gurramguda': 'Warangal Gurramguda',
        'bccl market': 'Karimnagar BCCL Market'
    }
    df['market_yard'] = df['market_yard'].str.lower().map(yard_mapping).fillna(df['market_yard'])
    
    return df

def remove_duplicates(df):
    """Remove duplicate records"""
    subset = [col for col in ['date', 'market_yard', 'commodity', 'variety'] if col in df.columns]
    return df.drop_duplicates(subset=subset if subset else None)

def handle_missing_values(df):
    """Handle missing values with appropriate strategies"""
    # Forward fill for short gaps
    df = df.ffill(limit=7)
    
    # Remove rows with critical missing values
    df = df.dropna(subset=['modal_price', 'market_yard', 'commodity'])
    
    return df

def detect_outliers(df):
    """Detect outliers using IQR method"""
    Q1 = df['modal_price'].quantile(0.25)
    Q3 = df['modal_price'].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    outliers = df[(df['modal_price'] < lower_bound) | (df['modal_price'] > upper_bound)]
    return outliers

def clean_dataset(df):
    """Complete data cleaning pipeline"""
    df = standardize_dates(df)
    df = standardize_names(df)
    df = remove_duplicates(df)
    df = handle_missing_values(df)
    
    return df
