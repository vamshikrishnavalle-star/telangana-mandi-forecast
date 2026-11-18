"""
Price Forecast Page
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

def show():
    st.header("📈 Price Forecast")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        commodity = st.selectbox(
            "Select Crop",
            ["Cotton", "Chilli", "Maize", "Paddy", "Turmeric"],
            key="forecast_commodity"
        )
    
    with col2:
        yard = st.selectbox(
            "Select Market Yard",
            ["Hyderabad RCI Market", "Warangal Gurramguda", "Karimnagar BCCL Market",
             "Nizamabad", "Khammam", "Adilabad"],
            key="forecast_yard"
        )
    
    with col3:
        horizon = st.selectbox(
            "Forecast Horizon",
            ["7 Days", "14 Days"],
            key="forecast_horizon"
        )
    
    # Generate sample forecast data
    np.random.seed(hash(f"{commodity}_{yard}") % 2**32)
    
    # Historical data
    hist_dates = pd.date_range(end='2024-01-01', periods=90, freq='D')
    base_price = {'Cotton': 8500, 'Chilli': 12000, 'Maize': 2200, 'Paddy': 2100, 'Turmeric': 9500}
    hist_prices = base_price.get(commodity, 5000) + np.cumsum(np.random.normal(0, 50, 90))
    
    # Forecast data
    forecast_days = 7 if horizon == "7 Days" else 14
    forecast_dates = pd.date_range(start='2024-01-02', periods=forecast_days, freq='D')
    forecast_prices = hist_prices[-1] + np.cumsum(np.random.normal(5, 30, forecast_days))
    forecast_upper = forecast_prices + np.arange(1, forecast_days + 1) * 20
    forecast_lower = forecast_prices - np.arange(1, forecast_days + 1) * 20
    
    # Create forecast plot
    fig = go.Figure()
    
    # Historical prices
    fig.add_trace(go.Scatter(
        x=hist_dates, y=hist_prices,
        mode='lines', name='Historical',
        line=dict(color='blue')
    ))
    
    # Forecast
    fig.add_trace(go.Scatter(
        x=forecast_dates, y=forecast_prices,
        mode='lines+markers', name='Forecast',
        line=dict(color='red', dash='dash')
    ))
    
    # Confidence interval
    fig.add_trace(go.Scatter(
        x=list(forecast_dates) + list(forecast_dates[::-1]),
        y=list(forecast_upper) + list(forecast_lower[::-1]),
        fill='toself', fillcolor='rgba(255,0,0,0.1)',
        line=dict(color='rgba(255,0,0,0)'),
        name='95% Confidence'
    ))
    
    fig.update_layout(
        title=f'{commodity} Price Forecast at {yard}',
        xaxis_title='Date',
        yaxis_title='Price (₹/quintal)',
        height=500
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Forecast summary
    st.subheader("Forecast Summary")
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Current Price", f"₹{hist_prices[-1]:,.0f}")
    with col2:
        change = forecast_prices[-1] - hist_prices[-1]
        st.metric("Forecast Price", f"₹{forecast_prices[-1]:,.0f}", f"{change:+,.0f}")
    with col3:
        pct_change = (change / hist_prices[-1]) * 100
        st.metric("Expected Change", f"{pct_change:+.1f}%")
    with col4:
        st.metric("Confidence", "85%")

if __name__ == "__main__":
    show()
