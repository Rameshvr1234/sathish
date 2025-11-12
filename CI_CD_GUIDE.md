# CI/CD Guide - GitHub Actions

Complete guide for setting up Continuous Integration and Continuous Deployment for the Real Estate Portal.

## Table of Contents

1. [Overview](#overview)
2. [Workflows Explained](#workflows-explained)
3. [Setup Instructions](#setup-instructions)
4. [GitHub Secrets Configuration](#github-secrets-configuration)
5. [Deployment Strategies](#deployment-strategies)
6. [Monitoring & Notifications](#monitoring--notifications)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## Overview

We use **GitHub Actions** for automated CI/CD pipelines with the following workflows:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `backend-ci.yml` | Push/PR to backend code | Test and build backend |
| `frontend-ci.yml` | Push/PR to frontend code | Test and build frontend |
| `deploy-production.yml` | Push to main (with `[deploy]`) | Deploy to production |
| `docker-build.yml` | Push to main/develop, tags | Build and push Docker images |
| `code-quality.yml` | Push/PR | Security scans, linting, coverage |

**Key Features:**
- ✅ Automated testing on every push
- ✅ Docker image building and caching
- ✅ Security vulnerability scanning
- ✅ Code quality checks (ESLint, Prettier)
- ✅ Test coverage reporting
- ✅ Automated deployments to Railway + Vercel
- ✅ Health checks after deployment
- ✅ Slack notifications (optional)

---

## Workflows Explained

### 1. Backend CI (`backend-ci.yml`)

**Triggers:**
- Push to `main`, `develop`, or `claude/**` branches affecting backend code
- Pull requests to `main` or `develop`

**Jobs:**

**a) Test Job:**
```yaml
- Spins up PostgreSQL test database
- Installs Node.js dependencies
- Runs linter
- Runs tests with coverage
- Checks for security vulnerabilities
- Uploads coverage to Codecov
```

**b) Build Job:**
```yaml
- Builds Docker image
- Tests Docker image by running container
- Validates health check endpoint
```

**Example Test Run:**
```bash
# Locally replicate what CI does:
cd backend
npm ci
npm test
docker build -t test-backend .
docker run --rm test-backend node --version
```

### 2. Frontend CI (`frontend-ci.yml`)

**Triggers:**
- Push to `main`, `develop`, or `claude/**` branches affecting frontend code
- Pull requests to `main` or `develop`

**Jobs:**

**a) Test Job:**
```yaml
- Installs dependencies
- Runs ESLint
- Type checks (if TypeScript configured)
- Runs tests
- Builds production bundle
- Checks build size
- Uploads build artifacts
```

**b) Build Docker Job:**
```yaml
- Builds Docker image with Nginx
- Tests image by running container
- Validates health check endpoint
```

**Build Size Check Example:**
```
Build size:
2.5M    dist

Detailed breakdown:
1.8M    dist/assets
500K    dist/index.html
200K    dist/favicon.ico
```

### 3. Deploy Production (`deploy-production.yml`)

**Triggers:**
- Push to `main` branch with commit message containing `[deploy]`
- Manual trigger via GitHub UI (workflow_dispatch)

**Jobs:**

**a) Deploy Backend to Railway:**
```yaml
1. Checkout code
2. Install Railway CLI
3. Deploy backend service
4. Run database migrations
5. Health check
6. Notify success
```

**b) Deploy Frontend to Vercel:**
```yaml
1. Checkout code
2. Install Vercel CLI
3. Deploy with production environment variables
4. Health check
5. Notify success
```

**c) Notify Success:**
```yaml
- Send Slack notification (if configured)
- Create deployment tag (deploy-YYYYMMDD-HHMMSS)
```

**Manual Deployment:**
```bash
# Trigger deployment
git commit -m "fix: update property filter [deploy]"
git push origin main

# Or use GitHub UI: Actions → Deploy to Production → Run workflow
```

### 4. Docker Build (`docker-build.yml`)

**Triggers:**
- Push to `main` or `develop`
- Git tags starting with `v*` (e.g., v1.0.0)
- Manual trigger

**Jobs:**

**a) Build and Push:**
```yaml
- Builds Docker images for backend and frontend
- Pushes to GitHub Container Registry (ghcr.io)
- Tags with branch name, commit SHA, version
- Runs Trivy security scan
- Uploads security results to GitHub
```

**b) Deploy via Docker Compose:**
```yaml
- SSH to production server
- Pull latest code and images
- Run docker compose up
- Execute database migrations
```

**Docker Image Tags:**
```
ghcr.io/your-org/realestate-backend:main
ghcr.io/your-org/realestate-backend:develop
ghcr.io/your-org/realestate-backend:v1.0.0
ghcr.io/your-org/realestate-backend:main-abc1234
ghcr.io/your-org/realestate-backend:latest
```

### 5. Code Quality (`code-quality.yml`)

**Triggers:**
- All pushes and pull requests

**Jobs:**

**a) Security Scan:**
```yaml
- Snyk vulnerability scanning
- CodeQL analysis for JavaScript
```

**b) Dependency Review:**
```yaml
- Reviews dependencies in pull requests
- Fails if high-severity vulnerabilities found
```

**c) Lint:**
```yaml
- ESLint for code quality
- Prettier for formatting
```

**d) Test Coverage:**
```yaml
- Runs tests with coverage report
- Uploads to Codecov
- Comments coverage % on pull requests
```

---

## Setup Instructions

### Step 1: Enable GitHub Actions

1. Go to your GitHub repository
2. Click **Settings** → **Actions** → **General**
3. Select **Allow all actions and reusable workflows**
4. Click **Save**

### Step 2: Create Workflow Files

All workflow files are already created in `.github/workflows/`. Just commit and push:

```bash
git add .github/workflows/
git commit -m "feat: add CI/CD workflows"
git push origin main
```

### Step 3: Configure Branch Protection

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require pull request before merging
   - ✅ Require status checks to pass (select: Backend CI, Frontend CI, Code Quality)
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings

### Step 4: Set Up Secrets

See [GitHub Secrets Configuration](#github-secrets-configuration) below.

---

## GitHub Secrets Configuration

### Required Secrets

Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### For Railway Deployment

| Secret | How to Get | Example |
|--------|------------|---------|
| `RAILWAY_TOKEN` | Railway Dashboard → Settings → Tokens | `railway_token_abc123...` |
| `RAILWAY_PROJECT_ID` | Railway Project → Settings | `proj_abc123xyz` |
| `BACKEND_URL` | Your Railway backend URL | `https://your-app.railway.app` |

**Getting Railway Token:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Get project ID
railway status
```

#### For Vercel Deployment

| Secret | How to Get | Example |
|--------|------------|---------|
| `VERCEL_TOKEN` | Vercel → Settings → Tokens | `vercel_token_abc123...` |
| `VERCEL_ORG_ID` | Vercel project settings | `team_abc123xyz` |
| `VERCEL_PROJECT_ID` | Vercel project settings | `prj_abc123xyz` |
| `FRONTEND_URL` | Your Vercel frontend URL | `https://your-app.vercel.app` |

**Getting Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Click **Create Token**
3. Name: "GitHub Actions"
4. Scope: Full Account
5. Copy token

**Getting Vercel Project IDs:**
```bash
# Install Vercel CLI
npm install -g vercel

# Link project
cd frontend
vercel link

# View project details
cat .vercel/project.json
```

#### For Docker Deployment (Optional)

| Secret | How to Get | Example |
|--------|------------|---------|
| `DEPLOY_HOST` | Your server IP or domain | `123.45.67.89` |
| `DEPLOY_USER` | SSH username | `ubuntu` |
| `DEPLOY_SSH_KEY` | SSH private key | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

**Generate SSH Key:**
```bash
ssh-keygen -t ed25519 -C "github-actions@your-domain.com" -f github_actions_key
cat github_actions_key  # Copy this to DEPLOY_SSH_KEY
cat github_actions_key.pub  # Add to server's ~/.ssh/authorized_keys
```

#### Additional Secrets

| Secret | Purpose | Required? |
|--------|---------|-----------|
| `RAZORPAY_KEY_ID` | Payment gateway | Yes |
| `SNYK_TOKEN` | Security scanning | Optional |
| `SLACK_WEBHOOK_URL` | Deployment notifications | Optional |
| `CODECOV_TOKEN` | Coverage reporting | Optional |

---

## Deployment Strategies

### Strategy 1: Railway + Vercel (Recommended)

**Pros:**
- Easy setup
- Automatic HTTPS
- Built-in monitoring
- Free tier available

**Deployment Flow:**
```
Push to main [deploy]
  → Backend CI passes
  → Frontend CI passes
  → Deploy Backend to Railway
  → Run migrations
  → Deploy Frontend to Vercel
  → Health checks
  → Notify success
```

**Setup:**
1. Create Railway project for backend
2. Create Vercel project for frontend
3. Add secrets to GitHub
4. Push with `[deploy]` tag

### Strategy 2: Docker on VPS

**Pros:**
- Full control
- Lower cost at scale
- Can self-host everything

**Deployment Flow:**
```
Push to main
  → Build Docker images
  → Push to ghcr.io
  → SSH to server
  → Pull images
  → Docker compose up
  → Run migrations
```

**Setup:**
1. Set up VPS (DigitalOcean, Linode, AWS EC2)
2. Install Docker and Docker Compose
3. Clone repository on server
4. Add SSH secrets to GitHub
5. Push to trigger deployment

### Strategy 3: Kubernetes (Advanced)

**Pros:**
- Auto-scaling
- High availability
- Production-grade

**Deployment Flow:**
```
Push to main
  → Build images
  → Push to registry
  → Update K8s manifests
  → kubectl apply
  → Rolling update
```

**Setup:**
1. Create Kubernetes cluster (GKE, EKS, AKS)
2. Convert docker-compose to K8s manifests
3. Set up kubectl in GitHub Actions
4. Configure secrets in K8s
5. Deploy via workflow

---

## Monitoring & Notifications

### 1. GitHub Actions Dashboard

View workflow runs:
```
Repository → Actions tab
  → See all workflows
  → Click on run for details
  → View logs, artifacts, and status
```

### 2. Slack Notifications

**Setup:**
1. Create Slack webhook:
   - Go to https://api.slack.com/apps
   - Create new app → Incoming Webhooks
   - Activate webhooks
   - Add to channel
   - Copy webhook URL

2. Add to GitHub secrets:
   ```
   SLACK_WEBHOOK_URL = https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX
   ```

3. Notifications will be sent on:
   - ✅ Successful deployments
   - ❌ Failed deployments
   - 📊 Test coverage reports

**Sample Notification:**
```
✅ Production Deployment Successful

Commit: abc1234
Branch: main
Author: john-doe
Backend: https://api.yourapp.com
Frontend: https://yourapp.com
```

### 3. Email Notifications

GitHub automatically sends emails on:
- Failed workflow runs
- Security vulnerability alerts

Configure in: **Settings** → **Notifications**

### 4. Status Badges

Add to README.md:

```markdown
![Backend CI](https://github.com/your-org/repo/workflows/Backend%20CI/badge.svg)
![Frontend CI](https://github.com/your-org/repo/workflows/Frontend%20CI/badge.svg)
![Code Quality](https://github.com/your-org/repo/workflows/Code%20Quality/badge.svg)
```

---

## Troubleshooting

### Issue 1: Workflow Not Triggering

**Possible causes:**
- Workflow file has syntax errors
- File path doesn't match trigger
- Actions disabled in repository settings

**Solution:**
```bash
# Validate workflow syntax
yamllint .github/workflows/backend-ci.yml

# Check file paths in trigger
on:
  push:
    paths:
      - 'backend/**'  # Must match actual changes

# Enable Actions
# Settings → Actions → General → Allow all actions
```

### Issue 2: Tests Failing in CI

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```yaml
# Ensure PostgreSQL service is healthy before running tests
jobs:
  test:
    services:
      postgres:
        # ...
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
```

### Issue 3: Deployment Fails

**Error:**
```
Error: RAILWAY_TOKEN is not set
```

**Solution:**
1. Go to Settings → Secrets → Actions
2. Verify `RAILWAY_TOKEN` exists
3. Re-create if necessary
4. Re-run workflow

### Issue 4: Docker Build Timeout

**Error:**
```
Error: buildx failed with: ERROR: failed to solve: process timeout
```

**Solution:**
```yaml
# Increase timeout and use caching
- name: Build Docker image
  uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
  timeout-minutes: 30  # Add timeout
```

### Issue 5: Out of GitHub Actions Minutes

**Free tier limits:**
- Public repos: Unlimited
- Private repos: 2,000 minutes/month

**Solution:**
1. Optimize workflows (run only on changed files)
2. Use self-hosted runners
3. Upgrade GitHub plan

---

## Best Practices

### 1. Workflow Optimization

```yaml
# Only run on relevant file changes
on:
  push:
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'

# Cache dependencies
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    cache: 'npm'

# Run jobs in parallel when possible
jobs:
  test-backend:
    # ...
  test-frontend:
    # ...
  # Both run simultaneously
```

### 2. Security

```yaml
# Use secrets for sensitive data
env:
  JWT_SECRET: ${{ secrets.JWT_SECRET }}

# Pin action versions
uses: actions/checkout@v4  # Not @main

# Scan for vulnerabilities
- name: Run Trivy scan
  uses: aquasecurity/trivy-action@master

# Review permissions
permissions:
  contents: read
  packages: write
```

### 3. Testing

```yaml
# Test in multiple Node versions
strategy:
  matrix:
    node-version: [16, 18, 20]

# Fail fast or continue on error
continue-on-error: true  # For optional checks

# Upload artifacts for debugging
- name: Upload logs
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: error-logs
    path: logs/
```

### 4. Deployment Safety

```yaml
# Require manual approval for production
environment:
  name: production
  url: https://yourapp.com

# Run health checks
- name: Health Check
  run: |
    sleep 30
    curl -f ${{ secrets.BACKEND_URL }}/health || exit 1

# Rollback on failure
- name: Rollback on failure
  if: failure()
  run: railway rollback
```

---

## Advanced Features

### 1. Matrix Builds

Test on multiple Node versions:

```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]

steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

### 2. Scheduled Workflows

Run tests nightly:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
```

### 3. Reusable Workflows

Create `.github/workflows/reusable-test.yml`:

```yaml
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      # ...
```

Use in other workflows:

```yaml
jobs:
  test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '18'
```

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway Deployment Guide](https://docs.railway.app/deploy/deployments)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Codecov GitHub Action](https://github.com/codecov/codecov-action)

---

**Automate everything with GitHub Actions!** 🚀⚙️
