"""
Sell Recommendation Page
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

def show():
    st.header("💡 Sell Recommendation")
    
    col1, col2 = st.columns(2)
    
    with col1:
        commodity = st.selectbox(
            "Select Crop",
            ["Cotton", "Chilli", "Maize", "Paddy", "Turmeric"],
            key="rec_commodity"
        )
    
    with col2:
        yard = st.selectbox(
            "Select Market Yard",
            ["Hyderabad RCI Market", "Warangal Gurramguda", "Karimnagar BCCL Market",
             "Nizamabad", "Khammam", "Adilabad"],
            key="rec_yard"
        )
    
    # Generate sample recommendation
    np.random.seed(hash(f"{commodity}_{yard}_rec") % 2**32)
    
    base_price = {'Cotton': 8500, 'Chilli': 12000, 'Maize': 2200, 'Paddy': 2100, 'Turmeric': 9500}
    current_price = base_price.get(commodity, 5000) + np.random.normal(0, 200)
    forecast_7d = current_price * (1 + np.random.uniform(-0.05, 0.08))
    forecast_14d = current_price * (1 + np.random.uniform(-0.08, 0.12))
    
    change_7d = forecast_7d - current_price
    change_14d = forecast_14d - current_price
    
    # Determine recommendation
    if change_7d > current_price * 0.03:
        recommendation = "⏳ Wait 7 Days"
        rec_color = "orange"
        confidence = "High"
        explanation = f"Prices expected to rise by ₹{change_7d:,.0f} ({(change_7d/current_price)*100:.1f}%) in 7 days."
    elif change_14d > current_price * 0.05:
        recommendation = "⏳ Wait 14 Days"
        rec_color = "orange"
        confidence = "Medium"
        explanation = f"Prices expected to rise by ₹{change_14d:,.0f} ({(change_14d/current_price)*100:.1f}%) in 14 days."
    else:
        recommendation = "✅ Sell Now"
        rec_color = "green"
        confidence = "High"
        explanation = f"Current price of ₹{current_price:,.0f} is favorable. No significant upside expected."
    
    # Display recommendation card
    st.markdown("---")
    st.subheader("📋 Current Recommendation")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Current Price", f"₹{current_price:,.0f}")
    with col2:
        st.metric("Recommendation", recommendation)
    with col3:
        st.metric("Confidence Level", confidence)
    
    st.info(f"💡 **Analysis**: {explanation}")
    
    # Detailed breakdown
    st.markdown("---")
    st.subheader("📊 Detailed Analysis")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.write("**7-Day Outlook**")
        st.metric("Forecast Price (7d)", f"₹{forecast_7d:,.0f}", f"{change_7d:+,.0f}")
        storage_cost_7d = current_price * 0.001 * 7
        st.write(f"Storage Cost: ₹{storage_cost_7d:,.0f}")
        net_gain_7d = change_7d - storage_cost_7d
        st.write(f"Net Gain: ₹{net_gain_7d:,.0f}")
    
    with col2:
        st.write("**14-Day Outlook**")
        st.metric("Forecast Price (14d)", f"₹{forecast_14d:,.0f}", f"{change_14d:+,.0f}")
        storage_cost_14d = current_price * 0.001 * 14
        st.write(f"Storage Cost: ₹{storage_cost_14d:,.0f}")
        net_gain_14d = change_14d - storage_cost_14d
        st.write(f"Net Gain: ₹{net_gain_14d:,.0f}")
    
    # MSP comparison
    st.markdown("---")
    st.subheader("📏 MSP Comparison")
    
    msp_data = {'Cotton': 8915, 'Chilli': 8500, 'Maize': 2115, 'Paddy': 2180, 'Turmeric': 7500}
    msp = msp_data.get(commodity, 5000)
    msp_gap = current_price - msp
    msp_gap_pct = (msp_gap / msp) * 100
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("MSP", f"₹{msp:,.0f}")
    with col2:
        st.metric("Current vs MSP", f"₹{msp_gap:+,.0f}")
    with col3:
        st.metric("Premium over MSP", f"{msp_gap_pct:+.1f}%")

if __name__ == "__main__":
    show()
