#!/bin/bash

# Real Estate Portal - Railway Deployment Script
# This script deploys the backend to Railway

echo "🚀 Real Estate Portal - Railway Deployment"
echo "=========================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed"
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if logged in
echo "🔐 Checking Railway authentication..."
railway whoami || {
    echo "Please login to Railway:"
    railway login
}

# Navigate to backend directory
cd backend || exit 1

# Create new project or link existing
echo "🔗 Setting up Railway project..."
railway init

# Add PostgreSQL database
echo "💾 Adding PostgreSQL database..."
railway add --database postgresql

# Set environment variables
echo "⚙️  Setting environment variables..."
echo "Please enter your environment variables:"

read -p "JWT_SECRET (press enter for default): " JWT_SECRET
JWT_SECRET=${JWT_SECRET:-$(openssl rand -base64 32)}
railway variables set JWT_SECRET="$JWT_SECRET"

read -p "FRONTEND_URL: " FRONTEND_URL
railway variables set FRONTEND_URL="$FRONTEND_URL"

read -p "RAZORPAY_KEY_ID: " RAZORPAY_KEY_ID
railway variables set RAZORPAY_KEY_ID="$RAZORPAY_KEY_ID"

read -p "RAZORPAY_KEY_SECRET: " RAZORPAY_KEY_SECRET
railway variables set RAZORPAY_KEY_SECRET="$RAZORPAY_KEY_SECRET"

read -p "EMAIL_HOST: " EMAIL_HOST
railway variables set EMAIL_HOST="$EMAIL_HOST"

read -p "EMAIL_PORT: " EMAIL_PORT
railway variables set EMAIL_PORT="$EMAIL_PORT"

read -p "EMAIL_USER: " EMAIL_USER
railway variables set EMAIL_USER="$EMAIL_USER"

read -p "EMAIL_PASSWORD: " EMAIL_PASSWORD
railway variables set EMAIL_PASSWORD="$EMAIL_PASSWORD"

# Set Node environment
railway variables set NODE_ENV="production"
railway variables set PORT="5000"

# Deploy
echo "🚀 Deploying to Railway..."
railway up

# Get deployment URL
echo "✅ Deployment complete!"
echo "📋 Your backend URL:"
railway domain

echo ""
echo "🎉 Backend deployed successfully!"
echo "Make sure to:"
echo "  1. Update your frontend VITE_API_URL with the Railway URL"
echo "  2. Add the Railway URL to FRONTEND_URL in Railway variables"
echo "  3. Set up custom domain if needed"

cd ..
