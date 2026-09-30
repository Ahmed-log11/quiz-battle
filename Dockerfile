# Stage 1: build the React app
FROM node:22 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: run FastAPI and serve the built React files
FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
COPY --from=frontend /app/frontend/dist ./static

# ONE worker: game state lives in memory and all players must share it
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
