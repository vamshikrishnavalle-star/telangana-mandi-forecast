# Smart Mandi Price Forecasting and "Sell-Time" Advisory System

## Overview
This project forecasts short-term crop prices from historical daily market yard data in Telangana, providing actionable advice to farmers on when and where to sell their crops.

## Project Structure
- `data/raw/`: Raw datasets
- `data/processed/`: Cleaned and processed datasets
- `notebooks/`: Exploration notebooks
- `src/`: Source code
- `models/`: Trained models
- `app/`: Web application
- `reports/`: Analysis reports

## Phases
- Phase 0: Setup
- Phase 1: Data audit and selection
- Phase 2: Cleaning and integration
- Phase 3: Exploratory analysis
- Phase 4: External data and features
- Phase 5: Baselines
- Phase 6: Models
- Phase 7: Evaluation
- Phase 8: Recommendation engine
- Phase 9: App and dashboard

## Getting Started
1. Install dependencies: `pip install -r requirements.txt`
2. Run the web app: `cd app && streamlit run app.py`
3. Add your data files to `data/raw/`

## Features
- Price forecasting for major Telangana crops
- Sell/wait recommendations with confidence levels
- Market yard comparisons
- Interactive web dashboard
- Model performance tracking
