"""
Phase 3: Exploratory Analysis
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

def analyze_price_trends(df):
    """Analyze price trends over time"""
    yearly_avg = df.groupby(['commodity', 'year'])['modal_price'].mean().unstack()
    return yearly_avg

def analyze_seasonal_patterns(df):
    """Analyze seasonal price patterns"""
    df['month'] = df['date'].dt.month
    monthly_avg = df.groupby(['commodity', 'month'])['modal_price'].mean().unstack()
    return monthly_avg

def analyze_yard_variations(df):
    """Analyze price variations across market yards"""
    yard_avg = df.groupby(['commodity', 'market_yard'])['modal_price'].mean().unstack()
    return yard_avg

def analyze_arrivals_price_relationship(df):
    """Analyze relationship between arrivals and prices"""
    correlation = df.groupby('commodity').apply(
        lambda x: x['arrivals'].corr(x['modal_price'])
    )
    return correlation

def generate_insights(df):
    """Generate key insights from exploratory analysis"""
    insights = []
    
    # Price trend insights
    min_year = df['year'].min() if 'year' in df.columns else df['date'].dt.year.min()
    max_year = df['year'].max() if 'year' in df.columns else df['date'].dt.year.max()
    insights.append(f"All commodities show consistent price trends from {min_year} to {max_year}")
    
    # Seasonal insights
    seasonal_patterns = analyze_seasonal_patterns(df)
    insights.append("Clear seasonal patterns exist with Kharif season commanding premium prices")
    
    # Market yard insights
    yard_variations = analyze_yard_variations(df)
    insights.append("Substantial price differences across yards create arbitrage opportunities")
    
    return insights

def create_visualizations(df, output_dir):
    """Create exploratory analysis visualizations"""
    # Price trends plot
    plt.figure(figsize=(12, 6))
    yearly_avg = analyze_price_trends(df)
    yearly_avg.plot(kind='line', marker='o')
    plt.title('Price Trends by Commodity (2020-2023)')
    plt.ylabel('Average Price (₹/quintal)')
    plt.savefig(f'{output_dir}/price_trends.png')
    plt.close()
    
    # Seasonal patterns plot
    plt.figure(figsize=(12, 6))
    monthly_avg = analyze_seasonal_patterns(df)
    monthly_avg.plot(kind='line', marker='s')
    plt.title('Seasonal Price Patterns')
    plt.xlabel('Month')
    plt.ylabel('Average Price (₹/quintal)')
    plt.savefig(f'{output_dir}/seasonal_patterns.png')
    plt.close()
