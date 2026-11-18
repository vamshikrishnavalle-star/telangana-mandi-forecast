# File: app/pages/model_performance.py
import streamlit as st
import pandas as pd
import plotly.express as px

def show():
    st.header("📊 Detailed Model Performance")
    
    st.info("Comprehensive model evaluation and comparison validated across 2020–2026 dataset.")
    
    models = ['Random Forest', 'XGBoost', 'Moving Average', 'ARIMA', 'Naive']
    mae_scores = [155.71, 179.63, 189.05, 196.42, 216.84]
    rmse_scores = [194.95, 222.57, 237.29, 248.58, 272.87]
    mape_scores = [1.66, 1.93, 2.03, 2.10, 2.32]
    mase_scores = [0.632, 0.729, 0.767, 0.797, 0.880]
    directional_accuracy = [74.75, 62.63, 77.78, 77.78, 76.77]
    
    df = pd.DataFrame({
        'Model': models,
        'MAE (₹/q)': mae_scores,
        'RMSE (₹/q)': rmse_scores,
        'MAPE (%)': mape_scores,
        'MASE': mase_scores,
        'Directional Accuracy (%)': directional_accuracy
    })
    
    st.dataframe(df, use_container_width=True)
    
    col1, col2 = st.columns(2)
    with col1:
        fig1 = px.bar(df, x='Model', y='MAE (₹/q)', title='MAE by Model (Lower is Better)', color='MAE (₹/q)', color_continuous_scale='Reds_r')
        st.plotly_chart(fig1, use_container_width=True)
    with col2:
        fig2 = px.bar(df, x='Model', y='Directional Accuracy (%)', title='Directional Accuracy by Model (%)', color='Directional Accuracy (%)', color_continuous_scale='Greens')
        st.plotly_chart(fig2, use_container_width=True)

if __name__ == "__main__":
    show()
