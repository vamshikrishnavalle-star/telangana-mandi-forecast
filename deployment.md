# Production Deployment Guide: Smart Mandi Advisory

This guide details how to deploy the **FastAPI Backend**, **React Frontend**, and **Streamlit Dashboard**.

---

## 1. FastAPI Backend Deployment (Render / Railway)

### Deploying on Render (Free Tier)
1. Sign in to [Render](https://render.com) with GitHub.
2. Click **New +** -> **Web Service**.
3. Connect repository: `vamshikrishnavalle-star/telangana-mandi-forecast`.
4. Configure:
   - **Name**: `telangana-mandi-api`
   - **Region**: `Singapore` (closest to India)
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt && pip install fastapi uvicorn pydantic requests
     ```
   - **Start Command**:
     ```bash
     uvicorn backend.app:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: `Free`
5. Click **Deploy**. Note your live URL (e.g. `https://telangana-mandi-api.onrender.com`).
6. Verify by opening `https://<YOUR-APP>.onrender.com/docs`.

---

## 2. React + Leaflet Frontend Deployment (Vercel)

### Deploying on Vercel
1. Sign in to [Vercel](https://vercel.com) with GitHub.
2. Click **Add New...** -> **Project**.
3. Import `vamshikrishnavalle-star/telangana-mandi-forecast`.
4. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (Click Edit and select the `frontend` folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Set Environment Variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://<YOUR-RENDER-API-URL>/api/v1`
6. Click **Deploy**. Your React app with the Telangana map will be live globally.

---

## 3. Docker Deployment (Single Server / AWS EC2 / DigitalOcean)

To host both frontend and backend on a single server:
```bash
# Clone repository on your VPS
git clone https://github.com/vamshikrishnavalle-star/telangana-mandi-forecast.git
cd telangana-mandi-forecast

# Build multi-stage Docker container (React + Nginx + FastAPI)
docker build -t smart-mandi .

# Run on port 80
docker run -d -p 80:80 --restart always --name smart-mandi-app smart-mandi
```
Now navigating to `http://<YOUR-SERVER-IP>` serves the React frontend, and `/api/` routes directly to the FastAPI backend.

---

## 4. Streamlit Python App Deployment (Streamlit Community Cloud)

1. Sign in to [share.streamlit.io](https://share.streamlit.io/).
2. Click **New app**.
3. Select repository: `vamshikrishnavalle-star/telangana-mandi-forecast`.
4. Main file path: `app/app.py`.
5. Click **Deploy**.
