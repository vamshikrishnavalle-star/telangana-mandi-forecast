# Deployment Guide for Smart Mandi Advisory System

## Streamlit Community Cloud Deployment

### Prerequisites
1. GitHub repository with the project code (`https://github.com/vamshikrishnavalle-star/telangana-mandi-forecast.git`)
2. Streamlit Community Cloud account

### Deployment Steps
1. Fork or push the repository to your GitHub account
2. Go to [Streamlit Community Cloud](https://share.streamlit.io/)
3. Click "New app"
4. Select your repository: `telangana-mandi-forecast`
5. Set branch: `main`
6. Set the main file path to: `app/app.py`
7. Click "Deploy"

### Environment Variables
Set the following environment variables in Streamlit Community Cloud if required:
- `DATA_PATH`: Path to your data directory (defaults to `data/processed/market_data_cleaned.csv`)
- `MODEL_PATH`: Path to your trained models (`models/`)

## Local Deployment

### Using Docker
```bash
docker build -t smart-mandi-advisory .
docker run -p 8501:8501 smart-mandi-advisory
```

### Manual Installation
```bash
# Clone repository
git clone https://github.com/vamshikrishnavalle-star/telangana-mandi-forecast.git
cd telangana-mandi-forecast

# Install dependencies
pip install -r requirements.txt

# Run Streamlit dashboard
cd app
streamlit run app.py
```

## Performance Optimization
- Caching with `@st.cache_data` and `@st.cache_resource` for instant loading
- Vectorized pandas lag/rolling transformations
- Interactive Plotly figures optimized for browser responsiveness
