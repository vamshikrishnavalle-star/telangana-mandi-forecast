# Smart Mandi Price Forecasting and Sell-Time Advisory System - Final Report

## Executive Summary
This project implements a comprehensive price forecasting and sell-time advisory system for Telangana farmers using daily market yard data. The system provides actionable recommendations to maximize farmer profits across 5 key commodities and major market yards across Telangana.

## Project Overview
- **Domain**: Agricultural Price Forecasting & Advisory
- **Location**: Telangana, India
- **Crops**: Cotton, Chilli, Maize, Paddy, Turmeric
- **Market Yards**: Hyderabad RCI Market, Warangal Gurramguda, Karimnagar BCCL Market, Nizamabad, Khammam, Adilabad
- **Data Period**: 2020 through 2026 (76,710 total daily records)

## Technical Architecture

### Data Pipeline
1. **Data Collection**: Telangana Open Data Portal API & Open-Meteo Weather API
2. **Data Processing**: Comprehensive cleaning, temporal imputation, and feature engineering
3. **Model Training**: Multi-horizon forecasting (ARIMA, Random Forest, XGBoost)
4. **Prediction**: 7-day and 14-day price forecasting with 95% confidence intervals
5. **Recommendation Engine**: Sell/wait decision optimization factoring holding costs and risk discount

### Technology Stack
- **Backend**: Python 3.14, Pandas 3.0+, NumPy 2.4+, Scikit-learn 1.9+, Statsmodels 0.15+, XGBoost 3.4+
- **Frontend**: Streamlit 1.67+, Plotly 7.1+
- **Testing**: Python unittest, automated test runner

## Key Features

### 1. Price Forecasting
- 7-day and 14-day price predictions
- 95% confidence interval bounds
- Multi-model evaluation (Random Forest, XGBoost, ARIMA, Moving Average, Naive)
- Historical price movement tracking (180-day interactive trace)

### 2. Recommendation Engine
- Sell/Wait decision support (`Wait 7 Days`, `Wait 14 Days`, `Sell Now`)
- Dynamic net-gain accounting: Gross Forecast Gain minus Storage Cost (0.1%/day) minus Risk Discount (2.0%)
- Confidence score integration to safeguard farmers against volatile predictions

### 3. Market Analysis & Arbitrage
- Yard-to-yard price comparison matrix
- Spread analysis to detect price arbitrage between regional yards
- Kharif vs. Rabi seasonal pattern tracking and harvest premium calculations

### 4. Interactive Web Application
- Single-page application with sidebar navigation across 6 distinct views
- Responsive data visualization powered by Plotly Express and Graph Objects
- Live local hosting on port 8501

## Results and Metrics (2020–2026 Multi-Year Evaluation)

### Model Performance
- **Random Forest**: Best MAE ₹155.71/q, RMSE ₹194.95/q, MAPE 1.66%, MASE 0.63
- **XGBoost**: MAE ₹179.63/q, RMSE ₹222.57/q, MAPE 1.93%, MASE 0.73
- **Moving Average (7d)**: MAE ₹189.05/q, RMSE ₹237.29/q, MAPE 2.03%
- **Directional Accuracy**: Up to 77.8% across 7-day horizons

### Impact for Farmers
- **Profit Optimization**: 3–8% projected net return increase through timed release of crop stocks
- **Holding Risk Mitigation**: Automated trigger to sell immediately when price trends decline or stay flat
- **Transparent Yard Comparison**: Farmers can immediately evaluate if hauling to a neighboring yard is cost-effective

## Testing Strategy & Coverage
- **`tests/test_data_cleaning.py`**: Validates date parsing, name standardization, deduplication, missing value imputation, and outlier detection.
- **`tests/test_recommendation.py`**: Verifies net gain accounting, sell/wait decision thresholds, and yard ranking logic.
- **`tests/test_models.py`**: Verifies baseline lag shifting, rolling forecasts, and error metric calculations.

## Deployment Guide
- Local: `cd app && python -m streamlit run app.py`
- Cloud: Ready for Streamlit Community Cloud deployment by targeting `app/app.py`.

## Contact & Links
- **Repository**: https://github.com/vamshikrishnavalle-star/telangana-mandi-forecast
- **Documentation**: See PROJECT.md and deployment.md for details
