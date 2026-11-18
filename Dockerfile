# Production Dockerfile for Smart Mandi FastAPI Backend
FROM python:3.11-slim

WORKDIR /app

# Install system utilities
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir fastapi uvicorn pydantic requests

# Copy source code and data
COPY src/ ./src/
COPY data/ ./data/
COPY backend/ ./backend/

# Default port (Render automatically provides $PORT, defaults to 8000)
ENV PORT=8000

EXPOSE 8000

# Start Uvicorn bound to 0.0.0.0 and $PORT
CMD ["sh", "-c", "uvicorn backend.app:app --host 0.0.0.0 --port ${PORT}"]
