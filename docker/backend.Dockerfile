FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application source
COPY backend/ ./backend

# Set environment paths
ENV PYTHONPATH=/app
ENV FLASK_APP=backend/app.py
ENV FLASK_ENV=production

EXPOSE 5001

# Run with Gunicorn using eventlet worker class for Socket.IO compatibility
CMD ["gunicorn", "-w", "1", "-k", "eventlet", "-b", "0.0.0.0:5001", "backend.app:create_app()"]
