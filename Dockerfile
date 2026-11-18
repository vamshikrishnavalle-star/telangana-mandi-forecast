# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend & Nginx Server
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies and Nginx
RUN apt-get update && apt-get install -y nginx supervisor && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir fastapi uvicorn pydantic requests

# Copy source code and data
COPY src/ ./src/
COPY data/ ./data/
COPY backend/ ./backend/

# Copy built React files to Nginx web root
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Configure Nginx reverse proxy
RUN echo 'server {\n\
    listen 80;\n\
    location /api/ {\n\
        proxy_pass http://127.0.0.1:8000/api/;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
    }\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Setup Supervisor to run both Nginx and FastAPI
RUN echo '[supervisord]\nnodaemon=true\n\
[program:uvicorn]\ncommand=uvicorn backend.app:app --host 127.0.0.1 --port 8000\n\
[program:nginx]\ncommand=nginx -g "daemon off;"' > /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80
CMD ["/usr/bin/supervisord"]
