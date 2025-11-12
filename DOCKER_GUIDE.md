# Docker Deployment Guide

Complete guide for containerizing and deploying the Real Estate Portal using Docker.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Docker Files Explained](#docker-files-explained)
5. [Development Setup](#development-setup)
6. [Production Deployment](#production-deployment)
7. [Docker Commands Reference](#docker-commands-reference)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Overview

The Real Estate Portal uses Docker for:
- **Consistent environments** across development, testing, and production
- **Easy deployment** with single command startup
- **Isolation** of services (database, backend, frontend, Redis)
- **Scalability** for future horizontal scaling

**Services:**
- `postgres` - PostgreSQL 14 database
- `backend` - Node.js/Express API server
- `frontend` - React app served by Nginx
- `redis` - Redis cache (optional)

---

## Prerequisites

### Install Docker

**macOS:**
```bash
# Install Docker Desktop
brew install --cask docker

# Or download from: https://www.docker.com/products/docker-desktop
```

**Ubuntu/Debian:**
```bash
# Update packages
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt-get install docker-compose-plugin
```

**Windows:**
```bash
# Download Docker Desktop from:
# https://www.docker.com/products/docker-desktop

# Or use WSL2 + Docker Desktop
```

**Verify Installation:**
```bash
docker --version
# Docker version 24.0.0 or higher

docker compose version
# Docker Compose version v2.20.0 or higher
```

---

## Quick Start

### 1. Clone and Setup

```bash
# Clone repository
git clone <your-repo-url>
cd sathish

# Copy environment file
cp .env.docker .env

# Edit .env with your values
nano .env
```

### 2. Start All Services

```bash
# Build and start all containers
docker compose up -d

# View logs
docker compose logs -f

# Check status
docker compose ps
```

### 3. Access the Application

- **Frontend:** http://localhost
- **Backend API:** http://localhost:5000
- **Database:** localhost:5432
- **Redis:** localhost:6379

### 4. Stop Services

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (WARNING: deletes data)
docker compose down -v
```

---

## Docker Files Explained

### Backend Dockerfile

**Location:** `backend/Dockerfile`

```dockerfile
# Multi-stage build reduces final image size
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production  # Only production dependencies

# Production stage
FROM node:18-alpine
WORKDIR /app

# dumb-init handles signals properly (graceful shutdown)
RUN apk add --no-cache dumb-init

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

USER nodejs
EXPOSE 5000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s CMD node -e "..."

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

**Key Features:**
- Multi-stage build (smaller image: ~150MB vs ~500MB)
- Non-root user for security
- Health checks for monitoring
- Production-only dependencies

### Frontend Dockerfile

**Location:** `frontend/Dockerfile`

```dockerfile
# Build React app
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Build args for environment variables
ARG VITE_API_URL
ARG VITE_RAZORPAY_KEY_ID
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Serve with Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Key Features:**
- Two-stage build (build + serve)
- Nginx for production serving
- Gzip compression enabled
- React Router support

### Docker Compose

**Location:** `docker-compose.yml`

**Services Configuration:**

```yaml
postgres:
  - Image: postgres:14-alpine
  - Port: 5432
  - Volume: postgres_data (persists database)
  - Health check: pg_isready

backend:
  - Build: ./backend
  - Port: 5000
  - Depends on: postgres
  - Volume: backend_uploads (persists uploaded files)
  - Environment: All backend configs

frontend:
  - Build: ./frontend with build args
  - Port: 80
  - Depends on: backend
  - No volumes needed (static build)

redis (optional):
  - Image: redis:7-alpine
  - Port: 6379
  - Volume: redis_data
```

---

## Development Setup

### Option 1: Full Docker Development

```bash
# Start with logs visible
docker compose up

# Rebuild after code changes
docker compose up --build

# Run backend tests
docker compose exec backend npm test

# Access backend shell
docker compose exec backend sh

# Access database
docker compose exec postgres psql -U realestate -d realestate_db
```

### Option 2: Hybrid Development

Run database in Docker, code locally:

```bash
# Start only database
docker compose up postgres -d

# In backend directory
cd backend
npm install
npm run dev

# In frontend directory
cd frontend
npm install
npm run dev
```

**Advantages:**
- Faster hot-reload
- Easier debugging
- Consistent database environment

---

## Production Deployment

### Option 1: Single Server Deployment

**On your production server:**

```bash
# Install Docker (if not already)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone repository
git clone <your-repo-url>
cd sathish

# Create production .env
nano .env
# Update with production values:
# - Strong DB_PASSWORD
# - Random JWT_SECRET (use: openssl rand -base64 32)
# - Production RAZORPAY keys
# - Production AWS credentials

# Build and start
docker compose up -d

# View logs
docker compose logs -f backend

# Enable auto-restart on boot
# (systemd service - see below)
```

### Option 2: Docker Swarm (Multi-Server)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml realestate

# Scale backend
docker service scale realestate_backend=3

# View services
docker stack services realestate
```

### Option 3: Kubernetes (Advanced)

```bash
# Convert docker-compose to Kubernetes
kompose convert

# Apply configurations
kubectl apply -f .

# Expose service
kubectl expose deployment backend --type=LoadBalancer --port=5000
```

### Systemd Service (Auto-Start on Boot)

Create `/etc/systemd/system/realestate.service`:

```ini
[Unit]
Description=Real Estate Portal
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/path/to/sathish
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable service:

```bash
sudo systemctl enable realestate
sudo systemctl start realestate
sudo systemctl status realestate
```

---

## Docker Commands Reference

### Container Management

```bash
# List running containers
docker compose ps

# Start services
docker compose up -d

# Stop services
docker compose stop

# Restart service
docker compose restart backend

# Remove containers
docker compose down

# Remove containers + volumes (⚠️ DATA LOSS)
docker compose down -v

# View logs
docker compose logs -f backend
docker compose logs --tail=100 frontend

# Execute command in container
docker compose exec backend npm run migrate
docker compose exec postgres psql -U realestate
```

### Image Management

```bash
# Build images
docker compose build

# Build without cache
docker compose build --no-cache

# Pull latest images
docker compose pull

# Remove unused images
docker image prune -a

# List images
docker images
```

### Database Operations

```bash
# Backup database
docker compose exec postgres pg_dump -U realestate realestate_db > backup.sql

# Restore database
cat backup.sql | docker compose exec -T postgres psql -U realestate realestate_db

# Access PostgreSQL CLI
docker compose exec postgres psql -U realestate -d realestate_db

# Run migrations
docker compose exec backend npx sequelize-cli db:migrate
```

### Monitoring

```bash
# Resource usage
docker stats

# Container details
docker compose exec backend ps aux
docker compose exec backend df -h

# Network inspection
docker network inspect sathish_realestate_network

# Volume inspection
docker volume ls
docker volume inspect sathish_postgres_data
```

---

## Troubleshooting

### Issue 1: Port Already in Use

**Error:**
```
Error: bind: address already in use
```

**Solution:**
```bash
# Find process using port
sudo lsof -i :5000
sudo lsof -i :80

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "8080:80"  # Use port 8080 instead
```

### Issue 2: Database Connection Failed

**Error:**
```
Error: connect ECONNREFUSED postgres:5432
```

**Solution:**
```bash
# Check if postgres is healthy
docker compose ps postgres

# View postgres logs
docker compose logs postgres

# Restart postgres
docker compose restart postgres

# Wait for health check
docker compose up -d postgres
sleep 10
docker compose up -d backend
```

### Issue 3: Frontend Can't Reach Backend

**Error:**
```
Network Error: Failed to fetch
```

**Solution:**

Check `VITE_API_URL` in frontend build:

```bash
# Rebuild frontend with correct API URL
docker compose build --no-cache frontend \
  --build-arg VITE_API_URL=http://localhost:5000/api

docker compose up -d frontend
```

### Issue 4: Out of Disk Space

**Solution:**
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes

# Check disk usage
docker system df
```

### Issue 5: Container Keeps Restarting

**Solution:**
```bash
# Check logs
docker compose logs backend

# Check health status
docker compose ps

# Run container interactively to debug
docker compose run --rm backend sh

# Check environment variables
docker compose exec backend env
```

---

## Best Practices

### 1. Security

```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use secrets for sensitive data (Docker Swarm)
echo "my-secret-password" | docker secret create db_password -

# Scan images for vulnerabilities
docker scan realestate_backend

# Run as non-root user (already configured in Dockerfiles)

# Keep images updated
docker compose pull
docker compose up -d
```

### 2. Performance

```bash
# Use multi-stage builds (already implemented)

# Optimize layer caching
# Copy package.json before source code
COPY package*.json ./
RUN npm install
COPY . .

# Use .dockerignore
# Exclude node_modules, .git, etc.

# Limit container resources
docker compose up -d --memory=512m --cpus=1
```

### 3. Monitoring

```bash
# Health checks (already configured)

# Log aggregation with ELK stack
# Or use cloud logging (CloudWatch, Stackdriver)

# Metrics with Prometheus
# Add prometheus exporter to backend

# Alerting
# Configure alerts for container restarts, high memory, etc.
```

### 4. Backup Strategy

```bash
# Daily database backups
crontab -e
# Add: 0 2 * * * docker compose exec postgres pg_dump -U realestate realestate_db > /backups/db_$(date +\%Y\%m\%d).sql

# Volume backups
docker run --rm \
  -v sathish_postgres_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/postgres_data.tar.gz /data
```

### 5. CI/CD Integration

```bash
# Build in CI
docker compose build

# Run tests
docker compose run --rm backend npm test

# Push to registry
docker tag realestate_backend:latest your-registry/realestate_backend:v1.0.0
docker push your-registry/realestate_backend:v1.0.0

# Deploy
ssh production-server "cd /app && docker compose pull && docker compose up -d"
```

---

## Production Checklist

- [ ] Strong database password in `.env`
- [ ] Random JWT secret (min 32 characters)
- [ ] Production Razorpay keys
- [ ] AWS S3 credentials configured
- [ ] Frontend `VITE_API_URL` points to production backend
- [ ] HTTPS configured (use reverse proxy like Traefik or Nginx)
- [ ] Database backups scheduled
- [ ] Monitoring and logging set up
- [ ] Resource limits configured
- [ ] Health checks working
- [ ] Auto-restart on failure enabled
- [ ] Domain name configured
- [ ] Firewall rules configured
- [ ] SSL certificates installed

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Security](https://docs.docker.com/engine/security/)

---

**Deployment made easy with Docker!** 🐳🚀
