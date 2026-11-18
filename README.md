# 🌾 Smart Mandi Advisory — Telangana Price Forecasting & Sell-Time Advisory

> **Price forecasting and sell-time advisory for Telangana farmers using daily market yard data.**  
> Built end-to-end: Python ML pipeline → FastAPI backend → React + Leaflet dashboard.

---

## 🚀 Live Deployments

| Service | Platform | URL | Status |
|:--------|:---------|:----|:-------|
| **React Dashboard** (Frontend) | Vercel | https://telangana-mandi-forecast.vercel.app/ | 🟢 Live  |
| **FastAPI Backend** | Render | [https://telangana-mandi-forecast.onrender.com](https://telangana-mandi-forecast.onrender.com) | 🟢 Live |
| **API Docs (Swagger UI)** | Render | [https://telangana-mandi-forecast.onrender.com/docs](https://telangana-mandi-forecast.onrender.com/docs) | 🟢 Live |

> **Note:** The free-tier Render instance spins down after 15 minutes of inactivity.  
> The first request after idle may take **up to 50 seconds** to cold-start. Subsequent requests are instant.

---

## 🔌 Live API Endpoints

Base URL: `https://telangana-mandi-forecast.onrender.com`

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/` | Service info and endpoint directory |
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/mandi/latest` | Latest modal prices (filter by `?commodity=Cotton`) |
| `GET` | `/api/v1/forecast` | 7–30 day ML price forecast with 95% CI (`?commodity=Cotton&yard=Warangal+Gurramguda`) |
| `POST` | `/api/v1/recommendation` | Sell-now vs wait advisory from the recommendation engine |
| `GET` | `/api/v1/mandi/arbitrage` | Inter-mandi transport arbitrage opportunity (`?commodity=Cotton`) |
| `GET` | `/api/v1/weather` | Live weather data for a yard (`?yard=Hyderabad+RCI+Market`) |
| `GET` | `/docs` | Interactive Swagger UI |

**Supported Commodities:** Cotton · Chilli · Maize · Paddy · Turmeric  
**Supported Market Yards:** Hyderabad RCI Market · Warangal Gurramguda · Karimnagar BCCL Market · Nizamabad · Khammam · Adilabad

---

## 🗂️ Project Structure

```
telangana-mandi-forecast/
├── 📁 src/                        # Core ML pipeline (Python)
│   ├── data_audit.py              # Phase 1 – Data audit
│   ├── data_cleaning.py           # Phase 2 – Cleaning & integration
│   ├── exploratory_analysis.py    # Phase 3 – EDA & visualisations
│   ├── feature_engineering.py     # Phase 4 – Feature creation
│   ├── models.py                  # Phase 5 – Baseline models
│   ├── advanced_models.py         # Phase 6 – ARIMA, RF, XGBoost
│   ├── evaluation.py              # Phase 7 – Model evaluation
│   └── recommendation.py          # Phase 8 – Sell-time recommendation engine
│
├── 📁 backend/                    # FastAPI Realtime API
│   └── app.py                     # All API endpoints
│
├── 📁 frontend/                   # React + TypeScript + Leaflet Dashboard
│   ├── src/
│   │   ├── api/client.ts          # API client for backend
│   │   ├── components/            # TelanganaMap, RecommendationCard, GlassyDashboard
│   │   ├── pages/Dashboard.tsx    # Main dashboard page
│   │   └── App.tsx
│   ├── package.json
│   └── vercel.json                # SPA routing config for Vercel
│
├── 📁 app/                        # Streamlit dashboard (Phase 9)
│   └── app.py
│
├── 📁 data/
│   ├── raw/                       # Raw market yard CSVs
│   └── processed/
│       └── market_data_cleaned.csv  # 76,710 records (2020–2026)
│
├── 📁 models/                     # Trained ML model artifacts (.pkl)
├── 📁 reports/                    # EDA & evaluation reports
├── 📁 tests/                      # 14-test suite (all passing)
├── Dockerfile                     # Docker config for Render backend
├── requirements.txt               # Python dependencies
├── vercel.json                    # Vercel deployment config (root)
└── deployment.md                  # Full deployment guide
```

---

## 📊 Development Phases

| Phase | Description | Key Output |
|:------|:-----------|:-----------|
| **Phase 0** | Project setup & scaffold | `requirements.txt`, `.gitignore`, `PROJECT.md` |
| **Phase 1** | Data audit & selection | `src/data_audit.py`, `data/raw/` |
| **Phase 2** | Cleaning & integration | `market_data_cleaned.csv` (76,710 records) |
| **Phase 3** | Exploratory analysis | `reports/` with plots & insights |
| **Phase 4** | Feature engineering | Lag features, rolling stats, season flags |
| **Phase 5** | Baseline models | Linear regression, moving average |
| **Phase 6** | Advanced models | ARIMA, Random Forest, XGBoost |
| **Phase 7** | Evaluation | MAE, RMSE, MAPE metrics per commodity |
| **Phase 8** | Recommendation engine | Sell-now vs wait with storage cost & risk discount |
| **Phase 9** | Streamlit dashboard | Plotly Mapbox Telangana district map |
| **Phase 10** | Tests & documentation | 14/14 tests passing, final report |
| **Phase 11** | React frontend | Vite + TypeScript + Leaflet interactive map |
| **Phase 12** | FastAPI backend | Real-time price, forecast, arbitrage & weather APIs |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** — utility-first styling
- **Leaflet / React-Leaflet** — interactive Telangana district map
- **Lucide React** — icons
- Deployed on **Vercel**

### Backend
- **Python 3.11** + **FastAPI** + **Uvicorn**
- **Pandas** + **NumPy** — data processing
- **Scikit-learn / XGBoost / statsmodels** — ML forecasting
- Deployed on **Render** (Docker)

### ML Pipeline
- **Data**: 76,710 daily records across 6 Telangana market yards (2020–2026)
- **Models**: ARIMA, Random Forest, XGBoost with 95% confidence intervals
- **Recommendation Engine**: Factors gross gain, 0.1%/day storage cost, 2% risk discount

---

## 💻 Local Development

### 1. Clone the repository
```bash
git clone https://github.com/vamshikrishnavalle-star/telangana-mandi-forecast.git
cd telangana-mandi-forecast
```

### 2. Backend (FastAPI)
```bash
pip install -r requirements.txt
cd backend
uvicorn app:app --reload --port 8000
# API live at: http://localhost:8000
# Swagger UI:  http://localhost:8000/docs
```

### 3. Frontend (React)
```bash
cd frontend
npm install
# Create a .env file:
echo "VITE_API_BASE_URL=http://localhost:8000/api/v1" > .env
npm run dev
# Dashboard at: http://localhost:5173
```

### 4. Streamlit Dashboard (optional)
```bash
cd app
streamlit run app.py
```

### 5. Run Tests
```bash
python run_tests.py
# Expected: 14/14 tests passing
```

---

## 🌍 Environment Variables

### Frontend (Vercel)
| Variable | Value |
|:---------|:------|
| `VITE_API_BASE_URL` | `https://telangana-mandi-forecast.onrender.com/api/v1` |

### Backend (Render)
| Variable | Value |
|:---------|:------|
| `PORT` | Auto-injected by Render |

---

## 📈 Model Performance

| Commodity | Best Model | MAE (₹/quintal) | MAPE (%) |
|:----------|:-----------|:----------------|:---------|
| Cotton | XGBoost | ~₹180 | ~2.1% |
| Chilli | Random Forest | ~₹420 | ~2.4% |
| Maize | ARIMA | ~₹65 | ~2.9% |
| Paddy | Random Forest | ~₹58 | ~2.5% |
| Turmeric | XGBoost | ~₹310 | ~2.3% |

---

## 👨‍💻 Author

**Vamshi Krishna** — [github.com/vamshikrishnavalle-star](https://github.com/vamshikrishnavalle-star)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
